FROM node:8
WORKDIR /app

COPY packages/website-backend/dist/src website-backend/dist/src
COPY packages/website-frontend/ website-frontend/
COPY packages/website-backend/package.json website-backend/
COPY packages/website-contract/ website-contract/
COPY packages/data-access data-access/

WORKDIR website-backend
RUN npm i --production

EXPOSE 1337
ENTRYPOINT [ "node", "dist/src/index.js" ]
