# Docker Setup for Auronet

This document provides instructions for running the Auronet application using Docker, both locally and on a production Ubuntu server with the domain auroville.social.

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)

## Configuration

The Docker setup uses environment variables defined in the `.env` file. This file contains:

- Next.js environment variables
- Supabase connection details
- SMTP configuration for email functionality

## Running the Application

### Starting the Application

To start the application and all its services:

```bash
docker-compose up -d
```

This command starts the following services:
- Next.js web application
- Supabase PostgreSQL database
- Supabase API (PostgREST)
- Supabase Auth (GoTrue)
- Supabase Storage
- Supabase Edge Functions

The web application will be available at http://localhost:3000 when running locally, or at https://auroville.social when deployed to production.

### Viewing Logs

To view logs from all services:

```bash
docker-compose logs -f
```

To view logs from a specific service:

```bash
docker-compose logs -f web  # For the Next.js application
docker-compose logs -f supabase-db  # For the PostgreSQL database
```

### Stopping the Application

To stop all services:

```bash
docker-compose down
```

To stop all services and remove volumes (this will delete all data):

```bash
docker-compose down -v
```

## Development Workflow

### Rebuilding the Application

If you make changes to the application code, you need to rebuild the Docker image:

```bash
docker-compose build web
docker-compose up -d web
```

### Accessing the Database

The PostgreSQL database is exposed on port 5432. You can connect to it using any PostgreSQL client with the following credentials:

- Host: localhost
- Port: 5432
- Username: postgres
- Password: postgres
- Database: postgres

## Troubleshooting

### Container Fails to Start

If a container fails to start, check the logs:

```bash
docker-compose logs <service-name>
```

### Database Connection Issues

If the web application cannot connect to the database, ensure that the database container is running and that the environment variables are correctly set.

### Email Sending Issues

If emails are not being sent, check the SMTP configuration in the `.env` file and ensure that the SMTP server is accessible from the Docker network.

## Deploying to Production (Ubuntu Server)

To deploy this application to a production Ubuntu server with the domain auroville.social:

### Server Setup

1. Install Docker and Docker Compose on your Ubuntu server:

```bash
# Update package lists
sudo apt update

# Install required packages
sudo apt install -y apt-transport-https ca-certificates curl software-properties-common

# Add Docker's official GPG key
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -

# Add Docker repository
sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"

# Update package lists again
sudo apt update

# Install Docker
sudo apt install -y docker-ce

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/v2.24.6/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Add your user to the docker group to run Docker without sudo
sudo usermod -aG docker $USER
```

2. Clone the repository to your server:

```bash
git clone https://your-repository-url.git
cd auronet
```

3. Set up SSL with Let's Encrypt for HTTPS:

```bash
# Install Certbot
sudo apt install -y certbot

# Get SSL certificate
sudo certbot certonly --standalone -d auroville.social -d www.auroville.social
```

4. Create a reverse proxy configuration (using Nginx):

```bash
# Install Nginx
sudo apt install -y nginx

# Create Nginx configuration
sudo nano /etc/nginx/sites-available/auroville.social
```

Add the following configuration:

```
server {
    listen 80;
    server_name auroville.social www.auroville.social;
    
    # Redirect HTTP to HTTPS
    location / {
        return 301 https://$host$request_uri;
    }
}

server {
    listen 443 ssl;
    server_name auroville.social www.auroville.social;
    
    ssl_certificate /etc/letsencrypt/live/auroville.social/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/auroville.social/privkey.pem;
    
    # SSL configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers on;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
    ssl_session_timeout 1d;
    ssl_session_cache shared:SSL:10m;
    ssl_session_tickets off;
    
    # Proxy to Docker container
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Enable the site:

```bash
sudo ln -s /etc/nginx/sites-available/auroville.social /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

5. Update the `.env` file with production values:

```bash
# Make sure GOTRUE_MAILER_SITE_URL is set to https://auroville.social
# Make sure all other URLs are correctly set for production
```

6. Start the application:

```bash
docker-compose up -d
```

### Automatic Startup

To ensure the Docker containers start automatically when the server boots:

```bash
# Create a systemd service file
sudo nano /etc/systemd/system/auronet.service
```

Add the following content:

```
[Unit]
Description=Auronet Docker Compose Application
Requires=docker.service
After=docker.service

[Service]
Type=oneshot
RemainAfterExit=yes
WorkingDirectory=/path/to/auronet
ExecStart=/usr/local/bin/docker-compose up -d
ExecStop=/usr/local/bin/docker-compose down

[Install]
WantedBy=multi-user.target
```

Enable and start the service:

```bash
sudo systemctl enable auronet.service
sudo systemctl start auronet.service
```

### Backup Strategy

Set up regular backups of the PostgreSQL database:

```bash
# Create a backup script
nano /path/to/auronet/backup.sh
```

Add the following content:

```bash
#!/bin/bash
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_DIR="/path/to/backups"
mkdir -p $BACKUP_DIR

# Backup PostgreSQL database
docker exec auronet_supabase-db_1 pg_dump -U postgres postgres > $BACKUP_DIR/postgres_$TIMESTAMP.sql

# Compress the backup
gzip $BACKUP_DIR/postgres_$TIMESTAMP.sql

# Remove backups older than 30 days
find $BACKUP_DIR -name "postgres_*.sql.gz" -type f -mtime +30 -delete
```

Make the script executable and set up a cron job:

```bash
chmod +x /path/to/auronet/backup.sh
crontab -e
```

Add the following line to run the backup daily at 2 AM:

```
0 2 * * * /path/to/auronet/backup.sh
```
