#!/bin/bash

echo "🚀 Starting YouTube cookie refresh..."

# Step 1: Run the fetch script to refresh cookies
node /home/adminuser/ytmp4/scripts/fetch-youtube-cookies.js

# Step 2: Copy updated cookies into the container
sudo docker cp /tmp/youtube-downloader/cookies/youtube.com_cookies.txt $(sudo docker ps -qf "name=ytmp4"):/tmp/youtube-downloader/cookies/

echo "✅ Cookies refreshed and copied to container."
