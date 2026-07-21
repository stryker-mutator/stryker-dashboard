FROM dhi.io/node:26-alpine-dev AS build

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN npm install -g corepack && corepack enable

WORKDIR /usr/src/app

COPY pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm fetch

COPY . .
RUN pnpm install --offline --frozen-lockfile
RUN pnpm run build
RUN pnpm backend --node-linker=hoisted --config.inject-workspace-packages=true deploy --prod /app

FROM dhi.io/node:26-alpine

ENV NODE_ENV=production

WORKDIR /app

COPY --from=build /app/ /app/

HEALTHCHECK CMD ["node", "/app/bin/healthcheck.js"]
EXPOSE 1337
ENTRYPOINT [ "node", "--enable-source-maps", "/app/bin/dashboard-backend.js" ]
