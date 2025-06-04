# Use smaller alpine image to reduce footprint
FROM node:18-alpine AS builder

# Install only necessary system dependencies
RUN apk add --no-cache \
      curl \
      xz \
      python3 \
      yt-dlp \
      ca-certificates

# Create a dedicated temp directory to avoid filling up root
WORKDIR /tmp/build

# Download FFmpeg with proper cleanup
RUN mkdir -p /tmp/ffmpeg \
    && curl -L "https://johnvansickle.com/ffmpeg/releases/ffmpeg-release-amd64-static.tar.xz" \
         -o /tmp/ffmpeg.tar.xz \
    && tar -xJf /tmp/ffmpeg.tar.xz -C /tmp/ffmpeg \
    && mkdir -p /usr/local/bin \
    && cp /tmp/ffmpeg/ffmpeg-*/ffmpeg /usr/local/bin/ffmpeg \
    && cp /tmp/ffmpeg/ffmpeg-*/ffprobe /usr/local/bin/ffprobe \
    && chmod +x /usr/local/bin/ffmpeg /usr/local/bin/ffprobe \
    && rm -rf /tmp/ffmpeg /tmp/ffmpeg.tar.xz

# Set up yt-dlp
RUN mkdir -p /app/bin \
    && ln -sf "$(which yt-dlp)" /usr/local/bin/yt-dlp \
    && ln -sf "$(which yt-dlp)" /app/bin/yt-dlp

# Set up the PATH
ENV PATH="/usr/local/bin:/app/bin:$PATH"

# Set up the working directory
WORKDIR /app

# Create download directory
RUN mkdir -p /tmp/youtube-downloader/temp \
    && chmod 777 /tmp/youtube-downloader/temp

# Install production dependencies only
COPY package.json package-lock.json ./
RUN npm ci --only=production \
    && npm cache clean --force

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Create a smaller production image
FROM node:18-alpine AS production

WORKDIR /app

# Copy built files from builder
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Copy binaries
COPY --from=builder /usr/local/bin/ffmpeg /usr/local/bin/ffmpeg
COPY --from=builder /usr/local/bin/ffprobe /usr/local/bin/ffprobe
COPY --from=builder /usr/local/bin/yt-dlp /usr/local/bin/yt-dlp
COPY --from=builder /app/bin/yt-dlp /app/bin/yt-dlp

# Create temp directory
RUN mkdir -p /tmp/youtube-downloader/temp \
    && chmod 777 /tmp/youtube-downloader/temp

# Set environment variables
ENV NODE_ENV=production
ENV PATH="/usr/local/bin:/app/bin:$PATH"
ENV DATABASE_URL="postgresql://neondb_owner:npg_j3Fftup2RJIA@ep-broad-dream-a4jw9cwh-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require"

EXPOSE 3000

CMD ["npm", "start"]