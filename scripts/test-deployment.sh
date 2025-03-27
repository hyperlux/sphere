#!/bin/bash

# Create directory for test deployment
DEPLOY_DIR="test-deployment"
mkdir -p $DEPLOY_DIR

# Function to cleanup on exit
cleanup() {
    echo "Cleaning up..."
    docker-compose -f $DEPLOY_DIR/docker-compose.test.yml down 2>/dev/null
    rm -rf $DEPLOY_DIR
}
trap cleanup EXIT

# Copy necessary files
cp docker-compose.yml $DEPLOY_DIR/docker-compose.test.yml
cp .env $DEPLOY_DIR/.env 2>/dev/null || :

# Navigate to test directory
cd $DEPLOY_DIR

# Test different scenarios
echo "Testing deployment scenarios..."

# 1. Test basic deployment
echo "1. Testing basic deployment..."
docker-compose -f docker-compose.test.yml up -d

# Wait for services to start
echo "Waiting for services to start..."
sleep 10

# 2. Test HTTP access
echo -e "\n2. Testing HTTP access..."
curl -v http://localhost

# 3. Test HTTPS access (requires local SSL setup)
echo -e "\n3. Testing HTTPS access..."
curl -vk https://localhost

# 4. Test environment variables
echo -e "\n4. Testing environment variables..."
docker-compose -f docker-compose.test.yml exec -T auronet-app env | grep -E "NEXT_PUBLIC_|DATABASE_URL"

# 5. Test container health
echo -e "\n5. Testing container health..."
docker-compose -f docker-compose.test.yml ps

# 6. Test logs
echo -e "\n6. Container logs:"
docker-compose -f docker-compose.test.yml logs

# Cleanup happens automatically via trap

echo -e "\nTests completed."
