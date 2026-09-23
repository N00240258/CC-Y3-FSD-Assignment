# A production-style image for the API — same two-stage layout as the
# support desk case study's Dockerfile, minus the Prisma-specific steps
# (there's no database client to generate yet). Built once and reused by
# both the `api` and `worker` services in docker-compose.yml — they run the
# same image, just with a different command.

# ---- deps: install dependencies ------------------------------------------
FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# ---- production: the image actually shipped ------------------------------
FROM node:22-alpine AS production
WORKDIR /app
ENV NODE_ENV=production

COPY package.json package-lock.json ./
COPY --from=deps /app/node_modules ./node_modules
RUN npm prune --omit=dev

COPY src ./src

# The official node image already ships a non-root `node` user — no need to
# create one.
USER node

EXPOSE 3000

# The `api` service in docker-compose.yml runs this image as-is; the
# `worker` service overrides `command` to run src/worker.js instead — same
# image, same node_modules, different entry point.
CMD ["node", "src/server.js"]
