FROM node:22-alpine

# Set build arguments for environment variables
ARG SHOPIFY_API_KEY
ARG SHOPIFY_API_SECRET
ARG SCOPES
ARG HOST

# Set environment variables
ENV SHOPIFY_API_KEY=$SHOPIFY_API_KEY
ENV SHOPIFY_API_SECRET=$SHOPIFY_API_SECRET
ENV SCOPES=$SCOPES
ENV HOST=$HOST
ENV NODE_ENV=production

# Create app directory
WORKDIR /app

# Install server dependencies
COPY web/server/package*.json ./
RUN npm install

# Build server with SWC
COPY web/server ./
# Use npx to ensure TypeScript is found for the typecheck command
RUN npx tsc --noEmit && npm run build

# Build client
COPY web/client/package*.json ./client/
WORKDIR /app/client
RUN npm install

COPY web/client ./
RUN npm run build

# Cleanup to reduce image size
WORKDIR /app
RUN npm prune --production

# Expose the port the app runs on
EXPOSE 8081

# Start the server using the SWC-compiled output
CMD ["node", "dist/index.js"]