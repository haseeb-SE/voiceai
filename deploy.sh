#!/bin/bash

APP_NAME="ytmp4"
DOCKER_IMAGE="ytmp4-app"
PORT=3000

echo "🛠️  Starting deployment..."

# 1) Pull latest code
echo "🔄 Pulling latest code from GitHub..."
git pull origin main || { echo "❌ Git pull failed"; exit 1; }

# 2) Build Docker image (you can optionally pass --memory if needed)
echo "🐳 Rebuilding Docker image..."
sudo docker build -t $DOCKER_IMAGE . || { echo "❌ Docker build failed"; exit 1; }

# 3) Stop & remove old container
echo "🧹 Stopping old container (if any)..."
sudo docker stop $APP_NAME 2>/dev/null
sudo docker rm $APP_NAME 2>/dev/null

# 4) Run new container
echo "🚀 Starting new container..."
sudo docker run -d --restart always -p $PORT:3000 --name $APP_NAME $DOCKER_IMAGE \
  || { echo "❌ Docker run failed"; exit 1; }

echo "✅ Deployment complete. App is live at http://<your-host>:$PORT"
