FROM node:10 as builder
ARG version=latest

RUN mkdir /app
WORKDIR /app
RUN npm init --yes
RUN npm install @stryker-mutator/dashboard-backend@$version
EXPOSE 1337
ENTRYPOINT [ "npx", "dashboard-backend" ]
