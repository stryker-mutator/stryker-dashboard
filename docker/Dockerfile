FROM node:10 as builder
ARG version=latest

RUN mkdir /build
ADD --chown=node . /build
RUN chown -R node /build
USER node
WORKDIR /build
RUN npm init --yes
RUN npm install @stryker-mutator/dashboard-backend@$version

FROM node:10
WORKDIR /app

COPY --from=builder /build .

WORKDIR /app

EXPOSE 1337
ENTRYPOINT [ "node", "node_modules/\@stryker-mutator/dashboard-backend/dist/src/index.js" ]
