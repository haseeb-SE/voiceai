############################
# 1) BUILD STAGE
############################
FROM node:18-bullseye-slim AS builder

# 1a) System deps + yt-dlp + ffmpeg
RUN apt-get update -qq \
 && apt-get install -y --no-install-recommends \
      curl \
      xz-utils \
      python3 \
      python3-pip \
      ca-certificates \
 && pip3 install --no-cache-dir --upgrade yt-dlp \
 && rm -rf /var/lib/apt/lists/*

# Symlink yt-dlp into /app/bin
RUN mkdir -p /app/bin \
 && ln -sf "$(which yt-dlp)" /usr/local/bin/yt-dlp \
 && ln -sf "$(which yt-dlp)" /app/bin/yt-dlp \
 && ln -sf "$(which yt-dlp)" /usr/local/bin/ytdlp

# Download static ffmpeg & ffprobe
RUN curl -L "https://johnvansickle.com/ffmpeg/releases/ffmpeg-release-amd64-static.tar.xz" \
      -o /tmp/ffmpeg.tar.xz \
 && mkdir -p /tmp/ffmpeg \
 && tar -xJf /tmp/ffmpeg.tar.xz -C /tmp/ffmpeg \
 && cp /tmp/ffmpeg/ffmpeg-*/ffmpeg /usr/local/bin/ffmpeg \
 && cp /tmp/ffmpeg/ffmpeg-*/ffprobe /usr/local/bin/ffprobe \
 && chmod +x /usr/local/bin/ffmpeg /usr/local/bin/ffprobe \
 && ln -sf /usr/local/bin/ffmpeg /app/bin/ffmpeg \
 && ln -sf /usr/local/bin/ffprobe /app/bin/ffprobe \
 && rm -rf /tmp/ffmpeg /tmp/ffmpeg.tar.xz

ENV PATH="/usr/local/bin:/app/bin:$PATH"
WORKDIR /app

# Prepare temp folder for downloads
RUN mkdir -p /tmp/youtube-downloader/temp \
 && chmod 777 /tmp/youtube-downloader/temp

# 1b) Copy lockfile & package.json, install with npm
COPY package.json package-lock.json ./
RUN npm ci

# 1c) Copy source & build
COPY . .
RUN npm run build


############################
# 2) RUNTIME STAGE
############################
FROM node:18-bullseye-slim
WORKDIR /app

# Copy only the “built” bits from builder
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Copy binaries from builder
COPY --from=builder /usr/local/bin/ffmpeg /usr/local/bin/ffmpeg
COPY --from=builder /usr/local/bin/ffprobe /usr/local/bin/ffprobe
COPY --from=builder /usr/local/bin/yt-dlp /usr/local/bin/yt-dlp
COPY --from=builder /app/bin/yt-dlp /app/bin/yt-dlp

# If you have any other runtime folders (e.g. lib/), copy them too:
COPY --from=builder /app/lib ./lib

ENV NODE_ENV=production
EXPOSE 3000
CMD ["npm", "start"]
