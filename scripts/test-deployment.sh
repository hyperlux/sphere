#!/bin/bash

# Make script exit on any error
set -e

echo "=== Testing Deployment Status ==="

# Check if docker network exists
echo "Checking docker network..."
if docker network inspect web >/dev/null 2>&1; then
    echo "✅ Web network exists"
else
    echo "❌ Web network not found"
    exit 1
fi

# Check Traefik container
echo -e "\nChecking Traefik status..."
if docker ps | grep -q traefik; then
    echo "✅ Traefik container is running"
else
    echo "❌ Traefik container not found"
    echo "Checking Traefik logs..."
    docker logs traefik
    exit 1
fi

# Check certificate file
echo -e "\nChecking SSL certificate status..."
if [ -f "./traefik/certs/acme.json" ]; then
    if [ -s "./traefik/certs/acme.json" ]; then
        echo "✅ acme.json exists and is not empty"
    else
        echo "❌ acme.json exists but is empty"
    fi
else
    echo "❌ acme.json not found"
fi

# Check staging container
echo -e "\nChecking staging container status..."
if docker ps | grep -q "auronet-staging"; then
    echo "✅ Staging container is running"
    
    # Check health status
    HEALTH_STATUS=$(docker inspect --format='{{.State.Health.Status}}' $(docker ps -q --filter name=auronet-staging))
    echo "Health status: $HEALTH_STATUS"
    
    # Get container logs if not healthy
    if [ "$HEALTH_STATUS" != "healthy" ]; then
        echo "❌ Container is not healthy. Last health check logs:"
        docker inspect --format='{{json .State.Health}}' $(docker ps -q --filter name=auronet-staging) | python -m json.tool
    fi
else
    echo "❌ Staging container not found"
fi

# Test domains
echo -e "\nTesting domain connectivity..."
echo "Testing staging.auroville.social..."
curl -I -k https://staging.auroville.social
echo -e "\nChecking Traefik routing..."
docker exec traefik traefik service ls
echo -e "\nChecking container logs..."
docker logs auronet-staging --tail 20

echo -e "\n=== Test Complete ==="
