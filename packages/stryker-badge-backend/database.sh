#!/bin/bash

docker pull postgres:9.6.4-alpine
PGPASSWORD="${PGPASSWORD:?Need to set PGPASSWORD non-empty}"
docker run \
    --name strykerscore \
    -e POSTGRES_USER=stryker \
    -e POSTGRES_PASSWORD=${PGPASSWORD} \
    -e POSTGRES_DB=strykerscore \
    -p 5432:5432 \
    -d \
    postgres:9.6.4-alpine
