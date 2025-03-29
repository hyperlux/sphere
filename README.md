# AuroNet - Auroville's Digital Community Platform

AuroNet is a digital platform designed to foster collaboration and community engagement within Auroville. It provides a centralized space for community events, resource sharing, and collaborative discussions.

## Features
test
### Community Spaces
- Create and join community spaces
- Share posts and updates within spaces
- Manage space membership and roles
- Search and filter spaces

### Events
- Create and manage community events
- RSVP functionality with attendance tracking
- Event categories and filtering
- Calendar view of upcoming events

### Resources!
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

3. Copy the environment file and update with your Supabase credentials:
   ```bash
   cp .env.example .env
   ```

4. Initialize the database:
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

### Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

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

### Deployment Process
Automated deployment via GitHub Actions:
- Push to `main` → deploys to production
- Push to `develop` → deploys to staging

[Test Timestamp: 2025-03-25 12:50]

### Deployment Status
- Production: [![Production Status](https://img.shields.io/website?url=https%3A%2F%2Fauroville.social)](https://auroville.social)
- Staging: [![Staging Status](https://img.shields.io/website?url=https%3A%2F%2Fstaging.auroville.social)](https://staging.auroville.social)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
