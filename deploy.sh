#!/bin/bash
set -e

APP_NAME="ytmp4"
DOCKER_IMAGE="ytmp4-app"
PORT=3000

echo "🛠️  Starting deployment..."

# 1) Pull latest code
echo "🔄 Pulling latest code from GitHub..."
git pull origin main

# 2) Build Docker image (no cache + pull base)
echo "🐳 Rebuilding Docker image (no-cache + pulling base image)..."
sudo docker build \
   \
  --pull \
  -t "$DOCKER_IMAGE" \
  .

# 3) Stop & remove old container (if any)
echo "🧹 Stopping old container (if any)..."
sudo docker stop "$APP_NAME" 2>/dev/null || true
sudo docker rm   "$APP_NAME" 2>/dev/null || true

# 4) Run new container
echo "🚀 Starting new container..."
sudo docker run -d \
  --restart always \
  -p "$PORT":3000 \
  --name "$APP_NAME" \
  "$DOCKER_IMAGE"

# 5) Cleanup unused Docker objects
echo "🧼 Cleaning up unused Docker resources..."
sudo docker container prune -f
sudo docker image prune     -f
sudo docker network prune   -f

echo "✅ Deployment complete. App is live at http://185.247.226.177:$PORT"
