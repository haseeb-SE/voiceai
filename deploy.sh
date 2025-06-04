#!/bin/bash

APP_NAME="ytmp4"
DOCKER_IMAGE="ytmp4-app"
PORT=3000

echo "🛠️  Starting deployment..."

# 1) Pull latest code
echo "🔄 Pulling latest code from GitHub..."
git pull origin main || { echo "❌ Git pull failed"; exit 1; }

# 2) Build Docker image
echo "🐳 Rebuilding Docker image..."
sudo docker build -t $DOCKER_IMAGE . || { echo "❌ Docker build failed"; exit 1; }

# 3) Stop & remove old container (if any)
echo "🧹 Stopping old container (if any)..."
sudo docker stop $APP_NAME 2>/dev/null || true
sudo docker rm   $APP_NAME 2>/dev/null || true

# 4) Run new container
echo "🚀 Starting new container..."
sudo docker run -d --restart always -p $PORT:3000 --name $APP_NAME $DOCKER_IMAGE \
  || { echo "❌ Docker run failed"; exit 1; }

# 5) Cleanup unused Docker objects
echo "🧼 Cleaning up unused Docker resources..."
sudo docker container prune -f
sudo docker image prune     -f
sudo docker network prune   -f

echo "✅ Deployment complete. App is live at http://<your-host>:$PORT"
