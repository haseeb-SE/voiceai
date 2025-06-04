#########################################
# 1) BUILD STAGE: install, build, bundle #
#########################################
FROM node:18-alpine AS builder

#——— 1a) Install system dependencies + yt-dlp + ffmpeg ———
RUN apk add --no-cache \
      curl \
      xz \
      python3 \
      py3-pip \
      ca-certificates \
    && pip3 install --no-cache-dir --upgrade yt-dlp --break-system-packages

# Symlink yt-dlp into /app/bin so our code can call it at runtime
RUN mkdir -p /app/bin \
 && ln -s "$(which yt-dlp)" /usr/local/bin/yt-dlp \
 && ln -s "$(which yt-dlp)" /app/bin/yt-dlp \
 && ln -s "$(which yt-dlp)" /usr/local/bin/ytdlp

# Download a static build of ffmpeg + ffprobe and put them into /usr/local/bin + /app/bin
RUN curl -L "https://johnvansickle.com/ffmpeg/releases/ffmpeg-release-amd64-static.tar.xz" \
      -o /tmp/ffmpeg.tar.xz \
 && mkdir -p /tmp/ffmpeg \
 && tar -xJf /tmp/ffmpeg.tar.xz -C /tmp/ffmpeg \
 && cp /tmp/ffmpeg/ffmpeg-*/ffmpeg /usr/local/bin/ \
 && cp /tmp/ffmpeg/ffmpeg-*/ffprobe /usr/local/bin/ \
 && chmod +x /usr/local/bin/ffmpeg /usr/local/bin/ffprobe \
 && ln -s /usr/local/bin/ffmpeg /app/bin/ffmpeg \
 && ln -s /usr/local/bin/ffprobe /app/bin/ffprobe \
 && rm -rf /tmp/ffmpeg /tmp/ffmpeg.tar.xz

# Ensure our /app/bin is first in PATH
ENV PATH="/usr/local/bin:/app/bin:$PATH"

WORKDIR /app

# Prepare a temp folder for yt-dlp to write into at runtime
RUN mkdir -p /tmp/youtube-downloader/temp \
 && chmod 777 /tmp/youtube-downloader/temp

#——— 1b) Install pnpm, throttle concurrency, limit Node’s heap ———
RUN npm install -g pnpm@10.10.0
# limit pnpm’s network concurrency to 1
RUN pnpm config set network-concurrency 1

# In very low-RAM environments, also cap Node’s heap to ~512 MB
ENV NODE_OPTIONS="--max_old_space_size=512"

#——— 1c) Copy only lockfile & package.json, install deps ———
COPY package.json pnpm-lock.yaml* ./
RUN pnpm install --no-frozen-lockfile --ignore-scripts --shamefully-hoist

#——— 1d) Copy application code & build ———
COPY . .
RUN pnpm build


#####################################
# 2) RUNTIME STAGE: lean production #
#####################################
FROM node:18-alpine

WORKDIR /app

#——— 2a) Copy only the built output + minimal runtime files ———
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

#——— 2b) Copy ffmpeg + ffprobe + yt-dlp binaries into the final image ———
COPY --from=builder /usr/local/bin/ffmpeg /usr/local/bin/ffmpeg
COPY --from=builder /usr/local/bin/ffprobe /usr/local/bin/ffprobe
COPY --from=builder /usr/local/bin/yt-dlp /usr/local/bin/yt-dlp
COPY --from=builder /app/bin/yt-dlp /app/bin/yt-dlp

# (Optionally) copy any other runtime‐needed folders, e.g. /app/lib or /app/tmp
COPY --from=builder /app/lib ./lib

ENV NODE_ENV=production
EXPOSE 3000

# Start your Next.js app
CMD ["pnpm", "start"]
