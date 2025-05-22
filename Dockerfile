# Use Node.js Alpine base
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install required tools + Python3/pip
RUN apk add --no-cache \
      curl \
      xz \
      python3 \
      py3-pip \
      ca-certificates \
    && pip3 install --no-cache-dir --upgrade yt-dlp

# Create binary directory and symlink yt-dlp into it
RUN mkdir -p /app/bin \
    && ln -s $(which yt-dlp) /usr/local/bin/yt-dlp \
    && ln -s $(which yt-dlp) /app/bin/yt-dlp \
    && ln -s $(which yt-dlp) /usr/local/bin/ytdlp

ENV NODE_ENV=production
ENV DATABASE_URL="postgresql://neondb_owner:…"

# Download and extract FFmpeg static build
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

# Ensure our binaries come first in PATH
ENV PATH="/usr/local/bin:/app/bin:$PATH"

# Prepare temp directory
RUN mkdir -p /tmp/youtube-downloader/temp \
    && chmod 777 /tmp/youtube-downloader/temp

# Install PNPM
RUN npm install -g pnpm@10.10.0

# Copy and install dependencies
COPY package.json pnpm-lock.yaml* ./
RUN pnpm install --no-frozen-lockfile --ignore-scripts

# Copy app source and build
COPY . .
RUN which yt-dlp && which ffmpeg && which ffprobe
RUN pnpm build

# Run
CMD ["pnpm", "start"]
