FROM node:14
ARG version=latest

RUN mkdir /app
WORKDIR /app
RUN npm init --yes
RUN npm install @stryker-mutator/dashboard-backend@$version
EXPOSE 1337
ENTRYPOINT [ "npx", "dashboard-backend" ]
