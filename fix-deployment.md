# Deployment Fix Instructions

## 1. Debug Current State
First, run the debug script to get detailed information about the current deployment state:
```bash
chmod +x scripts/debug-deployment.sh
./scripts/debug-deployment.sh
```

## 2. Adjust Health Check Configuration

Update the docker-compose deployment configuration in GitHub Actions workflow (.github/workflows/deploy.yml) with these adjusted health check settings:

```yaml
healthcheck:
  test: ["CMD", "wget", "--no-verbose", "--tries=1", "--spider", "http://localhost:3000/api/health"]
  interval: 30s      # Increased from 10s
  timeout: 10s       # Increased from 5s
  retries: 3        # Reduced from 5
  start_period: 90s  # Increased from 40s to allow for full Next.js startup
```

Also update the Traefik health check settings:

```yaml
- "traefik.http.services.${{ github.ref_name }}.loadbalancer.healthcheck.interval=30s"
- "traefik.http.services.${{ github.ref_name }}.loadbalancer.healthcheck.timeout=10s"
```

## 3. Implementation Steps

1. Stop current containers:
```bash
cd /opt/auronet
docker-compose -f docker-compose.main.yml down
docker-compose -f docker-compose.develop.yml down
```

2. Clear Traefik's dynamic configuration:
```bash
docker-compose down
rm -f /opt/auronet/traefik/certs/acme.json
touch /opt/auronet/traefik/certs/acme.json
chmod 600 /opt/auronet/traefik/certs/acme.json
```

3. Restart Traefik:
```bash
docker-compose up -d traefik
```

4. Wait 2-3 minutes for SSL certificates to be obtained

5. Deploy the application:
```bash
# For main branch
docker-compose -f docker-compose.main.yml up -d --force-recreate

# For develop branch
docker-compose -f docker-compose.develop.yml up -d --force-recreate
```

## 4. Monitoring

Monitor the deployment:
```bash
# Watch container health
watch -n 5 'docker ps --format "table {{.Names}}\t{{.Status}}"'

# Check logs
docker logs -f auronet-main  # or auronet-develop
```

## Common Issues and Solutions

1. If containers still fail to start:
   - Check if Next.js is building correctly with `docker logs`
   - Verify the container has enough memory (at least 2GB recommended)

2. If SSL certificates fail:
   - Verify DNS records are correctly pointing to the server
   - Check if ports 80 and 443 are accessible
   - Review Traefik logs for certificate acquisition errors

3. For 503 errors after deployment:
   - Wait at least 2 minutes for Next.js to fully initialize
   - Check container logs for any runtime errors
   - Verify the health check endpoint is responding correctly

## Preventing Future Issues

1. Add memory limits to containers:
```yaml
services:
  auronet-${{ github.ref_name }}:
    deploy:
      resources:
        limits:
          memory: 2G
        reservations:
          memory: 1G
```

2. Implement graceful shutdown:
```yaml
services:
  auronet-${{ github.ref_name }}:
    stop_grace_period: 30s
```

3. Add container restart delay:
```yaml
services:
  auronet-${{ github.ref_name }}:
    restart: always
    restart_policy:
      delay: 5s
