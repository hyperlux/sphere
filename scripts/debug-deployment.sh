#!/bin/bash

# Make script exit on any error
set -e

echo "=== Debugging Deployment Issues ==="

# Function to check container logs
check_container_logs() {
    local container=$1
    echo "=== Last 50 lines of $container logs ==="
    docker logs --tail 50 $container 2>&1
    echo "==============================="
}

# Function to check health status
check_health_status() {
    local container=$1
    local health_status=$(docker inspect --format='{{.State.Health.Status}}' $container 2>/dev/null)
    echo "Health Status: $health_status"
    echo "=== Last 5 health checks ==="
    docker inspect --format='{{range .State.Health.Log}}{{.Output}}{{end}}' $container 2>/dev/null
    echo "==============================="
}

echo "1. Checking Traefik Status..."
if docker ps | grep -q traefik; then
    echo "✅ Traefik is running"
    check_container_logs traefik
else
    echo "❌ Traefik is not running"
fi

echo -e "\n2. Checking Production Container..."
if docker ps | grep -q "auronet-main"; then
    echo "✅ Production container exists"
    check_container_logs $(docker ps -q --filter name=auronet-main)
    check_health_status $(docker ps -q --filter name=auronet-main)
else
    echo "❌ Production container not found"
fi

echo -e "\n3. Checking Staging Container..."
if docker ps | grep -q "auronet-develop"; then
    echo "✅ Staging container exists"
    check_container_logs $(docker ps -q --filter name=auronet-develop)
    check_health_status $(docker ps -q --filter name=auronet-develop)
else
    echo "❌ Staging container not found"
fi

echo -e "\n4. Checking SSL Certificates..."
if [ -f "/opt/auronet/traefik/certs/acme.json" ]; then
    echo "✅ SSL certificate file exists"
    echo "Certificate file permissions:"
    ls -l /opt/auronet/traefik/certs/acme.json
    echo "Certificate file size:"
    du -h /opt/auronet/traefik/certs/acme.json
else
    echo "❌ SSL certificate file not found"
fi

echo -e "\n5. Testing Domain Connectivity..."
echo "Testing production domain (auroville.social):"
curl -I -k https://auroville.social

echo -e "\nTesting staging domain (staging.auroville.social):"
curl -I -k https://staging.auroville.social

echo -e "\n6. Checking Docker Networks..."
echo "Web network details:"
docker network inspect web

echo -e "\n=== Debug Complete ==="
echo "Run this script on the server to get detailed debugging information"
