# Stage 1: Dependencies and build
FROM node:18-alpine AS deps
WORKDIR /app
RUN apk add --no-cache python3 make g++ cairo cairo-dev pango pango-dev jpeg-dev libpng-dev giflib-dev curl
COPY package*.json ./
RUN npm ci

# Stage 2: Build the app
FROM deps AS builder
ARG NEXT_PUBLIC_SUPABASE_URL
ARG NEXT_PUBLIC_SUPABASE_ANON_KEY
# Provide default fallbacks in case ARGs don't propagate correctly during build
ENV NEXT_PUBLIC_SUPABASE_URL=${NEXT_PUBLIC_SUPABASE_URL:-http://invalid.url/fallback}
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=${NEXT_PUBLIC_SUPABASE_ANON_KEY:-invalid_key_fallback}
COPY . .
# Remove any potentially interfering .env files before build
# Build using ENV variables set from ARG
RUN rm -f .env* && \
    echo "--- Building with ---" && \
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
# Also set in runner stage for consistency, though build-time is key for NEXT_PUBLIC_
ENV NEXT_PUBLIC_SUPABASE_URL=${NEXT_PUBLIC_SUPABASE_URL:-http://invalid.url/fallback}
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=${NEXT_PUBLIC_SUPABASE_ANON_KEY:-invalid_key_fallback}
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
