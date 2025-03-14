#!/bin/bash
# Auronet Deployment Script for Ubuntu Server
# This script automates the deployment of Auronet to a fresh Ubuntu server
# with Docker and connects it to auroville.social domain

# Exit on error
set -e

# Text colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Print section header
section() {
  echo -e "\n${GREEN}==== $1 ====${NC}\n"
}

# Print error and exit
error() {
  echo -e "\n${RED}ERROR: $1${NC}\n"
  exit 1
}

# Print warning
warning() {
  echo -e "${YELLOW}WARNING: $1${NC}"
}

# Confirm to proceed
confirm() {
  read -p "Continue? (y/n) " -n 1 -r
  echo
  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    exit 0
  fi
}

# Check if script is run as root
if [ "$(id -u)" -ne 0 ]; then
  error "This script must be run as root. Try 'sudo bash $0'"
fi

# Configuration variables - edit these before running
DOMAIN="auroville.social"
EMAIL="your-email@example.com" # For SSL certificate
APP_DIR="/opt/auronet"
GITHUB_REPO="https://github.com/yourusername/auronet.git" # Replace with your actual repo URL
SERVER_IP=$(hostname -I | awk '{print $1}')

# Get user confirmation for configuration
section "Configuration"
echo "Domain: $DOMAIN"
echo "Email: $EMAIL"
echo "App Directory: $APP_DIR"
echo "GitHub Repository: $GITHUB_REPO"
echo "Server IP: $SERVER_IP"
echo
echo "Please make sure these settings are correct before continuing."
echo "You'll be prompted to enter Supabase credentials later."
confirm

# Update system
section "Updating System Packages"
apt-get update
apt-get upgrade -y

# Install essential tools
section "Installing Essential Tools"
apt-get install -y \
  apt-transport-https \
  ca-certificates \
  curl \
  gnupg \
  lsb-release \
  git \
  nano \
  ufw

# Set up firewall
section "Configuring Firewall"
ufw allow ssh
ufw allow http
ufw allow https
ufw --force enable

# Install Docker
section "Installing Docker"
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null
apt-get update
apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# Test Docker
docker run hello-world || error "Docker installation failed"
echo "Docker installed successfully!"

# Install Docker Compose
section "Installing Docker Compose"
mkdir -p ~/.docker/cli-plugins/
curl -SL https://github.com/docker/compose/releases/download/v2.24.0/docker-compose-linux-x86_64 -o ~/.docker/cli-plugins/docker-compose
chmod +x ~/.docker/cli-plugins/docker-compose
docker compose version || error "Docker Compose installation failed"
echo "Docker Compose installed successfully!"

# Clone repository
section "Cloning Auronet Repository"
mkdir -p $APP_DIR
git clone $GITHUB_REPO $APP_DIR || error "Failed to clone repository"
cd $APP_DIR

# Set up environment variables
section "Setting Up Environment Variables"
cat > .env << EOF
# Production Environment Variables
NODE_ENV=production

# Supabase Configuration
# You will need to replace these values with your actual Supabase credentials
DATABASE_URL=postgres://postgres:postgres@db.yoursupabase.co:5432/postgres
NEXT_PUBLIC_SUPABASE_URL=https://yourprojectid.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Additional configuration if needed
# APP_URL=https://$DOMAIN
EOF

echo "Environment variables template created."
echo "Please edit the .env file with your actual Supabase credentials:"
echo "nano $APP_DIR/.env"
warning "You must update these values before building the Docker image!"
confirm

# Install Nginx
section "Installing Nginx"
apt-get install -y nginx

# Configure Nginx as reverse proxy
section "Configuring Nginx as Reverse Proxy"
cat > /etc/nginx/sites-available/$DOMAIN << EOF
server {
    listen 80;
    server_name $DOMAIN www.$DOMAIN;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

# Enable the site
ln -sf /etc/nginx/sites-available/$DOMAIN /etc/nginx/sites-enabled/
nginx -t || error "Nginx configuration test failed"
systemctl restart nginx

# Install Certbot for SSL
section "Installing Certbot for SSL"
apt-get install -y certbot python3-certbot-nginx

# Set up SSL
section "Setting Up SSL with Let's Encrypt"
echo "Before running Certbot, make sure your domain ($DOMAIN) is pointed to this server's IP ($SERVER_IP)."
echo "DNS propagation might take some time. You can check with: nslookup $DOMAIN"
echo "Would you like to proceed with SSL certificate setup now?"
confirm

certbot --nginx -d $DOMAIN -d www.$DOMAIN --non-interactive --agree-tos -m $EMAIL || warning "SSL setup failed. You can run 'certbot --nginx' manually later."

# Build and deploy with Docker Compose
section "Building and Deploying with Docker Compose"
cd $APP_DIR
docker compose build --no-cache
docker compose up -d

# Show deployment info
section "Deployment Information"
echo "Auronet has been deployed!"
echo "Website: https://$DOMAIN"
echo
echo "To view logs: docker compose logs -f"
echo "To restart: docker compose restart"
echo "To update: git pull && docker compose down && docker compose build --no-cache && docker compose up -d"
echo
echo "Important files:"
echo "- Application files: $APP_DIR"
echo "- Nginx configuration: /etc/nginx/sites-available/$DOMAIN"
echo "- Environment variables: $APP_DIR/.env"
echo
echo "Next steps:"
echo "1. Update DNS records for $DOMAIN to point to $SERVER_IP"
echo "2. Ensure your Supabase credentials in .env are correct"
echo "3. Set up automatic backups if needed"
echo
echo -e "${GREEN}Deployment completed successfully!${NC}"
