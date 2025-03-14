# Docker Setup for AuroNet

This document outlines the approach taken to fix the Docker Compose configuration for the AuroNet project.

## The Problem

When running `docker-compose up --build`, the system encountered an error with the Supabase image:

```
Error response from daemon: pull access denied for supabase/supabase, repository does not exist or may require 'docker login'
```

This happened because the `supabase/supabase` image doesn't exist. Supabase doesn't publish a single monolithic Docker image.

## The Solution

After analyzing the project structure, we took the following approach:

### 1. Simplified Docker Compose

We simplified the `docker-compose.yml` to focus solely on the Next.js app:

```yaml
version: '3.9'

services:
  auronet-app:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=${DATABASE_URL}
      - NEXT_PUBLIC_SUPABASE_URL=${NEXT_PUBLIC_SUPABASE_URL}
      - NEXT_PUBLIC_SUPABASE_ANON_KEY=${NEXT_PUBLIC_SUPABASE_ANON_KEY}
      - SUPABASE_SERVICE_ROLE_KEY=${SUPABASE_SERVICE_ROLE_KEY}
    env_file:
      - .env
```

### 2. Fixed Dockerfile

We fixed the Dockerfile package dependency to use `libpng-dev` instead of `png-dev`:

```docker
RUN apk add --no-cache python3 make g++ cairo cairo-dev pango pango-dev jpeg-dev libpng-dev giflib-dev
```

### 3. Hybrid Approach with Supabase CLI

We created two scripts to manage the development environment:

#### setup.sh
- Starts Supabase services using the Supabase CLI
- Applies database schema and seed data
- Builds and starts the Next.js app in Docker

#### teardown.sh
- Properly shuts down all services
- Stops Docker containers
- Stops Supabase services

## Benefits of This Approach

1. **Separation of Concerns**: Using the official Supabase CLI for backend services ensures compatibility and updates.
2. **Simplified Configuration**: No need to manually configure all the individual Supabase services in Docker.
3. **Consistent Development Environment**: Ensures all developers have the same setup experience.
4. **Easy Setup and Teardown**: Single commands to start and stop the entire development environment.

## Usage

To start the development environment:
```bash
./setup.sh
```

To stop the development environment:
```bash
./teardown.sh
