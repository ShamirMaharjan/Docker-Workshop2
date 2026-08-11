#!/bin/bash
set -euo pipefail

# --- settings (same image you pushed in Script 1) ---
USERNAME="shamirmaharjan"
IMAGE="mern-server"
TAG="latest"
FULL_NAME="$USERNAME/$IMAGE:$TAG"
CONTAINER="mern-server"

# --- connection details ---
KEY="docker.pem"
EC2_HOST="ec2-user@35.172.229.109"


echo "Deploying $FULL_NAME to $EC2_HOST ..."

# run all the deploy commands ON the server, over SSH
ssh -o StrictHostKeyChecking=accept-new -i "$KEY" "$EC2_HOST" "
  docker pull $FULL_NAME
  docker stop $CONTAINER 2>/dev/null || true
  docker rm $CONTAINER 2>/dev/null || true
  docker run -d --name $CONTAINER \
    --restart always -p 5000:5000 $FULL_NAME
"

echo "Deployed. App is live on port 5000."