#!/bin/bash
set -e

# Verify health endpoint
echo "Verifying health endpoint..."
HEALTH_CHECK_URL="http://localhost:3000/api/health"
if ! docker-compose -f docker-compose.$1.yml exec auronet-$1 wget -q --spider --timeout=10 $HEALTH_CHECK_URL; then
  echo "Error: Health check failed"
  docker-compose -f docker-compose.$1.yml logs auronet-$1
  exit 1
fi

# Verify Traefik routing
echo "Verifying Traefik routing..."
if ! docker exec traefik traefik healthcheck --ping; then
  echo "Error: Traefik health check failed"
  docker logs traefik
  exit 1
fi

# Verify domain accessibility
echo "Verifying domain accessibility..."
if ! curl -I --retry 3 --retry-delay 5 --max-time 10 https://$2/api/health; then
  echo "Error: Failed to access domain $2"
  exit 1
fi

echo "Deployment verification successful for $2"
