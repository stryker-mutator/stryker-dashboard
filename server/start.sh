#!/bin/bash

GH_BASIC_CLIENT_ID="${GH_BASIC_CLIENT_ID:?Need to set GH_BASIC_CLIENT_ID non-empty}"
GH_BASIC_SECRET_ID="${GH_BASIC_SECRET_ID:?Need to set GH_BASIC_SECRET_ID non-empty}"
PGPASSWORD="${PGPASSWORD:?Need to set PGPASSWORD non-empty}"
SECRET="${SECRET:?Need to set SECRET non-empty}"

DEBUG=*,-express:* \
    NODE_ENV=development \
    PGHOST=localhost \
    PGDATABASE=strykerscore \
    PGUSER=stryker \
    PORT=1337 \
    node dist/index.js
