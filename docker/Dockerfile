FROM node:22.13.1-alpine AS base
ENV NODE_ENV=production
USER node

WORKDIR /app

# Separate build stage to cache npm install and not include npm cache in the final image
FROM base AS build
ARG version=latest
RUN npm init --yes && \
  npm pkg set license='Apache-2.0' && \
  npm pkg set version=$version

RUN --mount=type=cache,id=npm,target=/root/.npm npm install @stryker-mutator/dashboard-backend@$version

FROM base
COPY --from=build /app/ /app/

HEALTHCHECK CMD npx --offline dashboard-healthcheck
EXPOSE 1337
ENTRYPOINT [ "npx", "--offline", "dashboard-backend" ]
