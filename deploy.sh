#!/usr/bin/env bash
set -euo pipefail

APP_NAME="ytmp4"
DOCKER_IMAGE="ytmp4-app"
PORT=3000

echo "🛠️  Starting deployment..."

# Step 1: Pull latest code
echo "🔄 Pulling latest code from GitHub..."
git pull origin main

# Step 2: Build Docker image
echo "🐳 Rebuilding Docker image..."
sudo docker build -t "$DOCKER_IMAGE" .

# Step 3: Stop and remove old container (if it exists)
echo "🧹 Stopping old container (if any)..."
if sudo docker ps -q --filter "name=^/${APP_NAME}$" | grep -q .; then
  sudo docker stop "$APP_NAME"
  sudo docker rm "$APP_NAME"
fi

# Step 4: Run new container
echo "🚀 Starting new container..."
sudo docker run -d \
  --restart always \
  -p "$PORT:3000" \
  --name "$APP_NAME" \
  "$DOCKER_IMAGE"

# Step 5: Cleanup dangling images/containers/networks to free space
echo "🧼 Cleaning up unused Docker resources..."
# Remove stopped containers
sudo docker container prune -f

# Remove dangling images (untagged)
sudo docker image prune -f

# Remove unused networks
sudo docker network prune -f

# Optionally, remove unused volumes (uncomment if you wish to prune volumes too)
# sudo docker volume prune -f

echo "✅ Deployment complete. App is live at http://185.247.226.177:${PORT} (or your domain)."
