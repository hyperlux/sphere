This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

<<<<<<< HEAD
First, run the development server:

=======
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
>>>>>>> Lucky
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
