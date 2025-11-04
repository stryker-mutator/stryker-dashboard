FROM node:24-alpine AS base

FROM base AS build

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

COPY . /usr/src/app
WORKDIR /usr/src/app

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

RUN pnpm run build
RUN pnpm backend --node-linker=hoisted deploy --prod /app

FROM base

ENV NODE_ENV=production

WORKDIR /app

COPY --from=build /app/ /app/

HEALTHCHECK CMD ["node", "/app/bin/dashboard-healthcheck.js"]
EXPOSE 1337
ENTRYPOINT [ "node", "--enable-source-maps", "/app/bin/dashboard-backend.js" ]
