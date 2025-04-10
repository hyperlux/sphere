# AuroNet - Auroville's Digital Community Platform

AuroNet is a digital platform designed to foster collaboration and community engagement within Auroville. It provides a centralized space for community events, resource sharing, and collaborative discussions.

## Requirements

- **Node.js**: >= 18.x recommended
- **npm**: >= 9.x
- **Docker** and **Docker Compose** (for containerized local development and production)
- **Supabase Account** with two projects (staging and production)
- **Supabase CLI** (`npm install -g supabase`) for local backend emulation
- **Git** for version control
- **Traefik** (configured via provided files) for reverse proxy and SSL
- **GitHub Account** with repository secrets configured:
  - `DATABASE_URL`, `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
  - `STAGING_DATABASE_URL`, `STAGING_SUPABASE_URL`, `STAGING_SUPABASE_ANON_KEY`, `STAGING_SUPABASE_SERVICE_ROLE_KEY`
  - `DOCKER_USERNAME`, `DOCKER_PASSWORD`
  - `SSH_HOST`, `SSH_PRIVATE_KEY`

## Features
test
### Community Spaces!
- Create and join community spaces
- Share posts and updates within spaces
- Manage space membership and roles
- Search and filter spaces

### Events
- Create and manage community events
- RSVP functionality with attendance tracking
- Event categories and filtering
- Calendar view of upcoming events

### Resources
- Upload and share community resources
- Categorized document management
- File preview and download
- Search and filter functionality

### Multi-language Support
- English (default)
- Tamil
- French

## Tech Stack

- **Frontend**: Next.js 15, React 18, TailwindCSS
- **Backend**: Supabase (PostgreSQL + Auth)
- **Storage**: Supabase Storage
- **Hosting**: Digital Ocean

## Getting Started

### Option 1: Standard Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/auroville/auronet.git
   cd auronet
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Initialize the database:
   ```bash
   # Run these commands in Supabase SQL editor
   # 1. Create tables and policies
   <path_to_project>/supabase/schema.sql
   # 2. Add sample data
   <path_to_project>/supabase/seed.sql
   ```

5. Run the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) with your browser.

### Option 2: Docker + Supabase CLI Setup

This project supports a streamlined local development using Docker for the Next.js app and Supabase CLI for the backend services.

#### Prerequisites
- Docker and Docker Compose installed
- Supabase CLI installed (`npm install -g supabase`)

#### Setup Process

1. Use the provided setup script to initialize everything with a single command:
   ```bash
   ./setup.sh
   ```

   This script will:
   - Start local Supabase services using the CLI
   - Apply database schema and seed data
   - Build and start the Next.js app in Docker

2. Access the services:
   - Next.js app: [http://localhost:3000](http://localhost:3000)
   - Supabase API: [http://localhost:54321](http://localhost:54321)
   - Supabase Studio: [http://localhost:54323](http://localhost:54323)

#### Shutdown Process

To properly shut down all services:
```bash
./teardown.sh
```

## Project Structure

```
auronet/
├── app/                 # Next.js app directory
│   ├── community/      # Community spaces
│   ├── events/         # Events management
│   ├── resources/      # Resource sharing
│   └── dashboard/      # User dashboard
├── components/         # Reusable React components
├── lib/               # Utilities and configurations
├── public/            # Static assets
└── supabase/          # Database schema and seeds
```

## Configuration

### Security and Environment Variables

⚠️ **IMPORTANT: This is a public repository**
- Never commit sensitive information or environment files (.env) to the repository
- All sensitive configuration must be managed through GitHub repository secrets
- Local development should use environment variables set in your system

### Required Environment Variables
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY
- DATABASE_URL
- SUPABASE_SERVICE_ROLE_KEY

For local development, set these variables in your shell or use your IDE's environment configuration.

### Supabase Setup

1. Create a new Supabase project
2. Enable authentication with email sign-up
3. Run the schema.sql file to create tables
4. Configure storage buckets for resources
5. Set up row-level security policies

## Development

### Running Tests
```bash
npm run test
```

### Building for Production
```bash
npm run build
```

### Deployment
```bash
npm run deploy
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## Support

For support, please contact the AuroNet team or open an issue on GitHub.

## Deployment

### Production Architecture
- Next.js application containerization
- Traefik reverse proxy for SSL and routing
- Automatic Let's Encrypt certificate management
- Multi-environment support (production/staging)

### Access Methods
- Production: https://auroville.social
- Staging: https://staging.auroville.social

### CI/CD Infrastructure

#### Environment Setup
1. **Production Environment**
   - Domain: auroville.social
   - Database: Production Supabase instance
   - Configuration: Uses production GitHub secrets

2. **Staging Environment**
   - Domain: staging.auroville.social
   - Database: Staging Supabase instance
   - Configuration: Uses staging GitHub secrets

#### GitHub Actions Workflow
The deployment process is fully automated using GitHub Actions (`.github/workflows/deploy.yml`):

1. **Trigger Conditions**
   - Production: Push to `main` branch
   - Staging: Push to `develop` branch
   - Pull Requests: Runs tests but doesn't deploy

2. **Pipeline Stages**
   ```yaml
   jobs:
     test-and-build:
       # Build and test the application
       - Run type checking
       - Run linting
       - Build Next.js application
       - Build and push Docker image
     
     deploy:
       # Deploy to appropriate environment
       - Determine deployment environment
       - Update Docker Compose configuration
       - Deploy using Docker Compose
   ```

3. **Environment Variables**
   - **Production Secrets**
     - DATABASE_URL
     - SUPABASE_URL
     - SUPABASE_ANON_KEY
     - SUPABASE_SERVICE_ROLE_KEY

   - **Staging Secrets**
     - STAGING_DATABASE_URL
     - STAGING_SUPABASE_URL
     - STAGING_SUPABASE_ANON_KEY
     - STAGING_SUPABASE_SERVICE_ROLE_KEY

4. **Docker Configuration**
   - `Dockerfile`: Multi-stage build for Next.js application
   - `docker-compose.yml`: Production configuration
   - `docker-compose.staging.yml`: Staging configuration

5. **Local Development**
   ```bash
   # Export required environment variables first
   export NEXT_PUBLIC_SUPABASE_URL=your-url
   export NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key
   export DATABASE_URL=your-db-url
   export SUPABASE_SERVICE_ROLE_KEY=your-key

   # Then run Docker Compose
   docker-compose up  # For production
   # OR
   docker-compose -f docker-compose.staging.yml up  # For staging
   ```

6. **Health Checks**
   - Endpoint: `/api/health`
   - Interval: 10s
   - Timeout: 5s
   - Retries: 5

#### Infrastructure Components

1. **Traefik Reverse Proxy**
   - SSL/TLS termination
   - Automatic Let's Encrypt certificate management
   - HTTP to HTTPS redirection
   - Load balancing
   - Health check monitoring

2. **Docker Networks**
   - External `web` network for Traefik communication
   - Internal container networking

3. **Monitoring**
   - Container health checks
   - Traefik health checks
   - GitHub Actions build status

### Deployment Process!
1. Code is pushed to either `main` or `develop` branch
2. GitHub Actions workflow is triggered
3. Application is built and tested
4. Docker image is built and pushed to registry
5. New image is deployed to appropriate environment
6. Health checks confirm successful deployment

### Deployment Status
- Production: [![Production Status](https://img.shields.io/website?url=https%3A%2F%2Fauroville.social)](https://auroville.social)
- Staging: [![Staging Status](https://img.shields.io/website?url=https%3A%2F%2Fstaging.auroville.social)](https://staging.auroville.social)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
