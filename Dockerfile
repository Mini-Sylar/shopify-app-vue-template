FROM node:22-alpine 

ARG SHOPIFY_API_KEY
ARG SHOPIFY_API_SECRET
ARG SCOPES
ARG HOST

ENV SHOPIFY_API_KEY=$SHOPIFY_API_KEY
ENV SHOPIFY_API_SECRET=$SHOPIFY_API_SECRET
ENV SCOPES=$SCOPES
ENV HOST=$HOST
ENV NODE_ENV=production

EXPOSE 8081
WORKDIR /app

# Build server
COPY web/server/package*.json ./
RUN npm ci

COPY web/server ./
RUN npm run typecheck && npm run build

# Build client
COPY web/client/package*.json ./client/
WORKDIR /app/client
RUN npm ci

COPY web/client ./
RUN npm run build

WORKDIR /app
CMD ["node", "dist/index.js"]