FROM node:20.18.0-alpine AS base
ENV NODE_ENV=production
USER node

WORKDIR /app

# Separate build stage to cache npm install and not include npm cache in the final image
FROM base AS build
ARG version=latest
RUN npm init --yes
RUN --mount=type=cache,id=npm,target=/root/.npm npm install @stryker-mutator/dashboard-backend@$version

FROM base
COPY --from=build /app/ /app/

HEALTHCHECK CMD npx --offline dashboard-healthcheck
EXPOSE 1337
ENTRYPOINT [ "npx", "--offline", "dashboard-backend" ]
