#!/bin/bash

APP_NAME="ytmp4"
DOCKER_IMAGE="ytmp4-app"
PORT=3000

echo "🛠️  Starting deployment..."

# Clean up system resources before building
echo "🧹 Cleaning up system resources..."
# Remove unused Docker resources
sudo docker system prune -af --volumes
# Clean package manager cache
sudo apt-get clean || true
# Clear system cache
sudo sync && sudo echo 3 | sudo tee /proc/sys/vm/drop_caches || true
# Remove temporary files
sudo rm -rf /tmp/* /var/tmp/* || true

# Pull latest code
echo "🔄 Pulling latest code from GitHub..."
git pull origin main || { echo "❌ Git pull failed"; exit 1; }

# Build Docker image with limited resources
echo "🐳 Rebuilding Docker image..."
sudo docker build --no-cache --memory=900m --memory-swap=900m -t $DOCKER_IMAGE . || { 
  echo "❌ Docker build failed"
  echo "🔍 Checking disk space..."
  df -h
  echo "🔍 Checking Docker disk usage..."
  sudo docker system df
  exit 1
}

# Stop & remove old container
echo "🧹 Stopping old container (if any)..."
sudo docker stop $APP_NAME 2>/dev/null || true
sudo docker rm $APP_NAME 2>/dev/null || true

# Run new container with resource limits
echo "🚀 Starting new container..."
sudo docker run -d --restart always \
  --memory=800m --memory-swap=800m \
  -p $PORT:3000 --name $APP_NAME $DOCKER_IMAGE \
  || { echo "❌ Docker run failed"; exit 1; }

# Final cleanup
echo "🧼 Final cleanup of unused Docker resources..."
sudo docker system prune -af --volumes

echo "✅ Deployment complete. App is live at http://<your-host>:$PORT"
echo "📊 Resource usage:"
sudo docker stats --no-stream $APP_NAME