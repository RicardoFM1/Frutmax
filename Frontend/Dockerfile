FROM node:20-alpine

WORKDIR /app

COPY package.json pnpm-lock.yaml* package-lock.json* yarn.lock* ./

RUN if [ -f pnpm-lock.yaml ]; then \
      npm install -g pnpm && pnpm install; \
    elif [ -f yarn.lock ]; then \
      yarn install; \
    else \
      npm install --legacy-peer-deps; \
    fi

COPY app/ ./app/
COPY components/ ./components/
COPY hooks/ ./hooks/
COPY lib/ ./lib/
COPY public/ ./public/
COPY next.config.mjs tsconfig.json tailwind.config.ts postcss.config.mjs components.json ./
COPY instrumentation.ts sentry.client.config.ts sentry.server.config.ts sentry.edge.config.ts ./

EXPOSE 3000

ENV HOSTNAME=0.0.0.0

CMD ["npm", "run", "dev"]
