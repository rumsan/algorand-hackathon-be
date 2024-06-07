ARG VARIANT=node:20-alpine

FROM ${VARIANT} AS base
RUN apk add --no-cache libc6-compat bash git

# Install dependencies only when needed
FROM base AS builder
WORKDIR /opt/app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
# Generate Prisma client
RUN npx prisma generate
RUN npm run build

FROM base AS deps
WORKDIR /opt/app
COPY package.json package-lock.json ./
RUN npm install --omit=dev

# Final Image
FROM base AS runner
USER node
WORKDIR /usr/src/app
COPY --chown=node:node --from=builder /opt/app/dist ./src/
COPY --chown=node:node --from=deps /opt/app/node_modules ./node_modules/
COPY --chown=node:node --from=builder /opt/app/node_modules/.prisma/client ./node_modules/.prisma/client
COPY --chown=node:node --from=builder /opt/app/package.json ./package.json
COPY --chown=node:node --from=builder /opt/app/prisma ./prisma/
CMD [ "node", "src/main.js" ]