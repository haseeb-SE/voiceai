# syntax=docker/dockerfile:1.4
################################################################################
### STAGE 1: Builder (heavy tooling + build)
FROM node:18-alpine AS builder
WORKDIR /app

# 1) Install pnpm & cache the store between builds
RUN --mount=type=cache,id=pnpm-store,target=/root/.local/share/pnpm/store \
    npm install -g pnpm@10.12.1

# 2) Copy only lockfiles & install deps
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --ignore-scripts

# 3) Pull in your runtime binaries: yt-dlp, ffmpeg, chromium
RUN apk add --no-cache curl xz python3 py3-pip ca-certificates chromium \
 && \
 # download the latest GitHub binary of yt-dlp
 curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp \
   -o /usr/local/bin/yt-dlp \
 && chmod +x /usr/local/bin/yt-dlp \
 && ln -s /usr/local/bin/yt-dlp /usr/local/bin/ytdlp \
 && \
 # download & install FFmpeg
 curl -L https://johnvansickle.com/ffmpeg/releases/ffmpeg-release-amd64-static.tar.xz \
   -o /tmp/ffmpeg.tar.xz \
 && tar -xJf /tmp/ffmpeg.tar.xz -C /tmp \
 && cp /tmp/ffmpeg-*/ffmpeg /usr/local/bin/ \
 && cp /tmp/ffmpeg-*/ffprobe /usr/local/bin/ \
 && chmod +x /usr/local/bin/ffmpeg /usr/local/bin/ffprobe \
 && rm -rf /tmp/ffmpeg*

# 4) Copy source & build your app
COPY . .
RUN pnpm build

################################################################################
### STAGE 2: Runtime (slim, only what you need to run)
FROM node:18-alpine
WORKDIR /app

# copy build output + binaries
COPY --from=builder /app/dist         ./dist
COPY --from=builder /usr/local/bin/yt-dlp  /usr/local/bin/
COPY --from=builder /usr/local/bin/ffmpeg  /usr/local/bin/
COPY --from=builder /usr/local/bin/ffprobe /usr/local/bin/
COPY --from=builder /usr/bin/chromium-browser /usr/bin/

# install production deps only
COPY --from=builder /app/package.json ./
RUN npm install -g pnpm@10.12.1 \
 && pnpm install --prod --frozen-lockfile

ENV NODE_ENV=production
CMD ["pnpm","start"]
