# Stage 1: Dependencies and build
FROM node:18-alpine AS deps
WORKDIR /app
RUN apk add --no-cache python3 make g++ cairo cairo-dev pango pango-dev jpeg-dev libpng-dev giflib-dev
COPY package*.json ./
RUN npm ci

# Stage 2: Build the app
FROM deps AS builder
ARG NEXT_PUBLIC_SUPABASE_URL
ARG NEXT_PUBLIC_SUPABASE_ANON_KEY
ENV NEXT_PUBLIC_SUPABASE_URL=${NEXT_PUBLIC_SUPABASE_URL}
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=${NEXT_PUBLIC_SUPABASE_ANON_KEY}
COPY . .
RUN npm run build

# Stage 3: Production image
FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV production
ARG NEXT_PUBLIC_SUPABASE_URL
ARG NEXT_PUBLIC_SUPABASE_ANON_KEY
ENV NEXT_PUBLIC_SUPABASE_URL=${NEXT_PUBLIC_SUPABASE_URL}
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=${NEXT_PUBLIC_SUPABASE_ANON_KEY}
RUN apk add --no-cache python3 make g++ cairo cairo-dev pango pango-dev jpeg-dev libpng-dev giflib-dev
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public public
COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/package.json ./
COPY --from=builder /app/package-lock.json ./
COPY --from=builder /app/node_modules ./node_modules
EXPOSE 3000
CMD [ "npx", "next", "start" ]
