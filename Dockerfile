# Stage 1: Dependencies and build
FROM node:18-alpine AS deps
WORKDIR /app
RUN apk add --no-cache python3 make g++ cairo cairo-dev pango pango-dev jpeg-dev libpng-dev giflib-dev curl
COPY package*.json ./
RUN npm ci

# Stage 2: Build the app
FROM deps AS builder
# Declare build arguments for public keys
ARG NEXT_PUBLIC_SUPABASE_URL
ARG NEXT_PUBLIC_SUPABASE_ANON_KEY
# Declare build arguments for server keys (needed for build step)
ARG SUPABASE_URL
ARG SUPABASE_SERVICE_ROLE_KEY
# Set environment variables for the build stage
ENV NEXT_PUBLIC_SUPABASE_URL=${NEXT_PUBLIC_SUPABASE_URL}
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=${NEXT_PUBLIC_SUPABASE_ANON_KEY}
ENV SUPABASE_URL=${SUPABASE_URL}
ENV SUPABASE_SERVICE_ROLE_KEY=${SUPABASE_SERVICE_ROLE_KEY}
COPY . .
RUN echo "--- Building with ---" && \
    echo "NEXT_PUBLIC_SUPABASE_URL: ${NEXT_PUBLIC_SUPABASE_URL}" && \
    echo "NEXT_PUBLIC_SUPABASE_ANON_KEY: ${NEXT_PUBLIC_SUPABASE_ANON_KEY}" && \
    echo "---------------------" && \
    npm run build

# Stage 3: Production image
FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV production
ARG NEXT_PUBLIC_SUPABASE_URL
ARG NEXT_PUBLIC_SUPABASE_ANON_KEY
ENV NEXT_PUBLIC_SUPABASE_URL=${NEXT_PUBLIC_SUPABASE_URL}
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=${NEXT_PUBLIC_SUPABASE_ANON_KEY}
RUN apk add --no-cache python3 make g++ cairo cairo-dev pango pango-dev jpeg-dev libpng-dev giflib-dev curl

# Copy app directory first
COPY --from=builder /app/app ./app
COPY --from=builder /app/components ./components
COPY --from=builder /app/lib ./lib
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/package.json ./
COPY --from=builder /app/package-lock.json ./
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3000

# Start Next.js
CMD ["npm", "start"]
