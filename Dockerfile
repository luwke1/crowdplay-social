# build stage
FROM node:18-alpine AS builder
WORKDIR /app

# build arguments for public environment variables
ARG NEXT_PUBLIC_SUPABASE_URL
ARG NEXT_PUBLIC_SUPABASE_ANON_KEY

# Set them as environment variables for the build process
ENV NEXT_PUBLIC_SUPABASE_URL=${NEXT_PUBLIC_SUPABASE_URL}
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=${NEXT_PUBLIC_SUPABASE_ANON_KEY}

# Install dependencies leveraging cache
COPY package*.json ./
RUN npm ci

# Copy source code and build the app
COPY . .
RUN npm run build

# 2. Production stage
FROM node:18-alpine AS runner
WORKDIR /app

# Create and use a non-root user for security
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001
USER nextjs

# Copy only necessary artifacts from the build stage
COPY --from=builder /app/public ./public
# Copy standalone output
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Expose and set the application port
EXPOSE 3000
ENV PORT=3000

# Start the app
CMD ["node", "server.js"]