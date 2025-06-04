#########################################
# 1) BUILD STAGE: install deps & build #
#########################################
FROM node:18-alpine AS builder

# 1a) Install system dependencies, yt-dlp (via apk), and static ffmpeg
RUN apk add --no-cache \
      curl \
      xz \
      python3 \
      yt-dlp \
      ca-certificates \
    && \
    # Download + extract a static FFmpeg build:
    mkdir -p /tmp/ffmpeg \
    && curl -L "https://johnvansickle.com/ffmpeg/releases/ffmpeg-release-amd64-static.tar.xz" \
         -o /tmp/ffmpeg.tar.xz \
    && tar -xJf /tmp/ffmpeg.tar.xz -C /tmp/ffmpeg \
    && cp /tmp/ffmpeg/ffmpeg-*/ffmpeg /usr/local/bin/ffmpeg \
    && cp /tmp/ffmpeg/ffmpeg-*/ffprobe /usr/local/bin/ffprobe \
    && chmod +x /usr/local/bin/ffmpeg /usr/local/bin/ffprobe \
    && rm -rf /tmp/ffmpeg /tmp/ffmpeg.tar.xz

# 1b) Symlink yt-dlp so our app can call it at runtime
RUN mkdir -p /app/bin \
 && ln -sf "$(which yt-dlp)" /usr/local/bin/yt-dlp \
 && ln -sf "$(which yt-dlp)" /app/bin/yt-dlp \
 && ln -sf "$(which yt-dlp)" /usr/local/bin/ytdlp

# 1c) Make sure /app/bin comes first in PATH
ENV PATH="/usr/local/bin:/app/bin:$PATH"

WORKDIR /app

# 1d) Prepare temp dir for youtube-downloader at runtime
RUN mkdir -p /tmp/youtube-downloader/temp \
 && chmod 777 /tmp/youtube-downloader/temp

# 1e) Copy lockfile + package.json; install npm dependencies via npm ci
COPY package.json package-lock.json ./
RUN npm ci

# 1f) Copy source code & build Next.js
COPY . .
RUN npm run build


#########################################
# 2) RUNTIME STAGE: lean production    #
#########################################
FROM node:18-alpine

WORKDIR /app

# 2a) Copy the built Next.js output + runtime dependencies
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# 2b) Copy ffmpeg, ffprobe, and yt-dlp binaries into the final image
COPY --from=builder /usr/local/bin/ffmpeg /usr/local/bin/ffmpeg
COPY --from=builder /usr/local/bin/ffprobe /usr/local/bin/ffprobe
COPY --from=builder /usr/local/bin/yt-dlp /usr/local/bin/yt-dlp
COPY --from=builder /app/bin/yt-dlp /app/bin/yt-dlp

# (If you have any other runtime folders, e.g. /app/lib or /app/tmp, copy as needed)
# COPY --from=builder /app/lib ./lib

ENV NODE_ENV=production
ENV DATABASE_URL="postgresql://neondb_owner:npg_j3Fftup2RJIA@ep-broad-dream-a4jw9cwh-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require"

EXPOSE 3000

# Start Next.js in production mode
CMD ["npm", "start"]
