# Docker Setup for AuroNet

This project uses Docker to manage the Next.js app and Supabase services.

## Prerequisites
- Docker Desktop installed
- Docker Compose v2+

## Setup Instructions

### 1. Build and Run the Docker setup
```bash
docker-compose up -d --build
```

This will:
- Build the Next.js app image
- Run Supabase services (PostgreSQL, Auth, Realtime, Storage)
- Map ports:
  - App: http://localhost:3000
  - Supabase Studio: http://localhost:54323
  - Supabase API: http://localhost:54321

### 2. Stop and Remove Containers
```bash
docker-compose down
```

### Environment Variable Configuration
- Copy `.env.example` to `.env` and set:
  ```env
  SUPABASE_ANON_KEY=[your_supabase anon key]
  ```

- For Supabase auth configurations:
  - Update `supabase/docker/auth.env` with your SMTP settings

### Build and Run in Production
```bash
docker-compose -f docker-compose.yml -f supabase/docker-compose.override.yml up -d --build
```

## Development Workflow
- Make code changes, then run `docker-compose up --build` to recompile
- Access the app at http://localhost:3000
