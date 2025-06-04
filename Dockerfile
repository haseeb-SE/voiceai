#########################################
# 1) BUILD STAGE: install, build, bundle #
#########################################
FROM node:18-bullseye-slim AS builder

# 1a) Install system dependencies + yt-dlp + ffmpeg
RUN apt-get update -qq \
 && apt-get install -y --no-install-recommends \
      curl \
      xz-utils \
      python3 \
      python3-pip \
      ca-certificates \
 && pip3 install --no-cache-dir --upgrade yt-dlp \
 && rm -rf /var/lib/apt/lists/*

# Symlink yt-dlp into /app/bin and create a "ytdlp" alias—don’t re‐link the existing /usr/local/bin/yt-dlp
RUN mkdir -p /app/bin \
 && ln -sf "$(which yt-dlp)" /app/bin/yt-dlp \
 && ln -sf "$(which yt-dlp)" /usr/local/bin/ytdlp



# Download static FFmpeg build and place into /usr/local/bin + /app/bin
RUN curl -L "https://johnvansickle.com/ffmpeg/releases/ffmpeg-release-amd64-static.tar.xz" \
      -o /tmp/ffmpeg.tar.xz \
 && mkdir -p /tmp/ffmpeg \
 && tar -xJf /tmp/ffmpeg.tar.xz -C /tmp/ffmpeg \
 && cp /tmp/ffmpeg/ffmpeg-*/ffmpeg /usr/local/bin/ffmpeg \
 && cp /tmp/ffmpeg/ffmpeg-*/ffprobe /usr/local/bin/ffprobe \
 && chmod +x /usr/local/bin/ffmpeg /usr/local/bin/ffprobe \
 && ln -s /usr/local/bin/ffmpeg /app/bin/ffmpeg \
 && ln -s /usr/local/bin/ffprobe /app/bin/ffprobe \
 && rm -rf /tmp/ffmpeg /tmp/ffmpeg.tar.xz

# Ensure our /app/bin is found first
ENV PATH="/usr/local/bin:/app/bin:$PATH"

WORKDIR /app

# Prepare a temp folder for yt-dlp to write into at runtime
RUN mkdir -p /tmp/youtube-downloader/temp \
 && chmod 777 /tmp/youtube-downloader/temp

# 1b) Install pnpm, throttle concurrency, cap Node’s heap to 512 MB
RUN npm install -g pnpm@10.10.0 \
 && pnpm config set network-concurrency 1

ENV NODE_OPTIONS="--max_old_space_size=512"

# 1c) Copy lockfile & package.json and install deps
COPY package.json pnpm-lock.yaml* ./
RUN pnpm install --no-frozen-lockfile --ignore-scripts

# 1d) Copy application code & build
COPY . .
RUN pnpm build


#####################################
# 2) RUNTIME STAGE: lean production #
#####################################
FROM node:18-bullseye-slim

WORKDIR /app

# 2a) Copy built output + runtime dependencies
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# 2b) Copy ffmpeg, ffprobe, and yt-dlp binaries
COPY --from=builder /usr/local/bin/ffmpeg /usr/local/bin/ffmpeg
COPY --from=builder /usr/local/bin/ffprobe /usr/local/bin/ffprobe
COPY --from=builder /usr/local/bin/yt-dlp /usr/local/bin/yt-dlp
COPY --from=builder /app/bin/yt-dlp /app/bin/yt-dlp

# If you have any extra runtime folders (e.g. lib or tmp), copy them as well:
COPY --from=builder /app/lib ./lib

ENV NODE_ENV=production
EXPOSE 3000

# Start the Next.js app
CMD ["pnpm", "start"]
