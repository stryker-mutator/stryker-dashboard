FROM node:10 as builder
RUN mkdir /build
ADD --chown=node . /build
RUN chown -R node /build
USER node
WORKDIR /build
RUN npm i
RUN npm run build 

# Now we have compiled the *.ts files, let's prepare website-backend for production
RUN npm run install-production

FROM node:10
WORKDIR /app

COPY --from=builder /build/packages/website-backend website-backend
COPY --from=builder /build/packages/data-access data-access
COPY --from=builder /build/packages/website-contract website-contract
COPY --from=builder /build/packages/website-frontend website-frontend

WORKDIR /app/website-backend

EXPOSE 1337
ENTRYPOINT [ "node", "dist/src/index.js" ]
