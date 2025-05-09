FROM node:22-alpine

# Set build arguments for environment variables
ARG SHOPIFY_API_KEY
ARG SHOPIFY_API_SECRET
ARG SCOPES
ARG HOST

# Set runtime environment variables (NODE_ENV is set later for build vs. runtime)
ENV SHOPIFY_API_KEY=$SHOPIFY_API_KEY
ENV SHOPIFY_API_SECRET=$SHOPIFY_API_SECRET
ENV SCOPES=$SCOPES
ENV HOST=$HOST
# Do not set NODE_ENV=production here yet, so devDependencies are installed for build

# Create app directory (this will be the server's root)
WORKDIR /app

# --- Server Build ---
# Copy server package files
COPY web/server/package*.json ./
RUN npm install
COPY web/server ./
RUN npm run build

# --- Client Build ---
# Set working directory for client
WORKDIR /app/client

# Copy client package files
COPY web/client/package*.json ./
# Install all client dependencies, including devDependencies needed for the build
RUN npm install

# Copy the rest of the client source code
COPY web/client ./
# Run the client's build script
RUN npm run build

# --- Finalization ---
# Go back to the server's root directory
WORKDIR /app

# Remove devDependencies from the server's node_modules to reduce image size
# This command only affects the current WORKDIR's node_modules
RUN npm prune --omit=dev

# Now, set NODE_ENV to production for the runtime environment
ENV NODE_ENV=production

# Expose the port the app runs on
EXPOSE 8081

# Start the server using the SWC-compiled output
CMD ["node", "dist/src/index.js"]