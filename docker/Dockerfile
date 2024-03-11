FROM node:20.11.1-alpine
ARG version=latest
ENV NODE_ENV production
USER node

WORKDIR /app
RUN npm init --yes
RUN npm install @stryker-mutator/dashboard-backend@$version

HEALTHCHECK CMD npx dashboard-healthcheck
EXPOSE 1337
ENTRYPOINT [ "npx", "dashboard-backend" ]
