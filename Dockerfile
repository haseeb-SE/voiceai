#########################################
# 1) BUILD STAGE (Alpine) – install + build
#########################################
FROM node:18-alpine AS builder

# 1a) Install system dependencies, python3/pip, yt-dlp, and static ffmpeg
RUN apk add --no-cache \
      curl \
      xz \
      python3 \
      py3-pip \
      ca-certificates \
    && pip3 install --no-cache-dir yt-dlp \
    && mkdir -p /tmp/ffmpeg \
    && curl -L "https://johnvansickle.com/ffmpeg/releases/ffmpeg-release-amd64-static.tar.xz" \
         -o /tmp/ffmpeg.tar.xz \
    && tar -xJf /tmp/ffmpeg.tar.xz -C /tmp/ffmpeg \
    && cp /tmp/ffmpeg/ffmpeg-*/ffmpeg /usr/local/bin/ffmpeg \
    && cp /tmp/ffmpeg/ffmpeg-*/ffprobe /usr/local/bin/ffprobe \
    && chmod +x /usr/local/bin/ffmpeg /usr/local/bin/ffprobe \
    && rm -rf /tmp/ffmpeg /tmp/ffmpeg.tar.xz

# 1b) Symlink yt-dlp so our code can call it at runtime
RUN mkdir -p /app/bin \
 && ln -sf "$(which yt-dlp)" /usr/local/bin/yt-dlp \
 && ln -sf "$(which yt-dlp)" /app/bin/yt-dlp \
 && ln -sf "$(which yt-dlp)" /usr/local/bin/ytdlp

# 1c) Make sure our /app/bin is first in PATH
ENV PATH="/usr/local/bin:/app/bin:$PATH"

WORKDIR /app

# 1d) Prepare a temp dir for youtube-downloader
RUN mkdir -p /tmp/youtube-downloader/temp \
 && chmod 777 /tmp/youtube-downloader/temp

# 1e) Copy lockfile + package.json, install dependencies via npm
#     (npm ci uses less peak RAM than pnpm for large Next.js projects)
COPY package.json package-lock.json ./
RUN npm ci

# 1f) Copy the rest of the source code and run the Next.js build
COPY . .
RUN npm run build


#########################################
# 2) RUNTIME STAGE – lean production
#########################################
FROM node:18-alpine

WORKDIR /app

# 2a) Copy only the built output + runtime dependencies
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# 2b) Copy ffmpeg, ffprobe, and yt-dlp binaries into the final image
COPY --from=builder /usr/local/bin/ffmpeg /usr/local/bin/ffmpeg
COPY --from=builder /usr/local/bin/ffprobe /usr/local/bin/ffprobe
COPY --from=builder /usr/local/bin/yt-dlp /usr/local/bin/yt-dlp
COPY --from=builder /app/bin/yt-dlp /app/bin/yt-dlp

# If you have any additional runtime folders (for example `/app/lib`), copy them too:
# COPY --from=builder /app/lib ./lib

ENV NODE_ENV=production
EXPOSE 3000

# Finally, start the Next.js app
CMD ["npm", "start"]
