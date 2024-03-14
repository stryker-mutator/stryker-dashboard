#!/bin/bash

GH_BASIC_CLIENT_ID="Iv1.a5c1ff5c64d80a93"
GH_BASIC_SECRET_ID="ff8917c4a26bc12e08a28d2debb9b13eb13a3d1e"
PGPASSWORD="pgpw"
JWT_SECRET="123"

DEBUG=*,-express:* \
    NODE_ENV=development \
    PGHOST=localhost \
    PGDATABASE=strykerscore \
    GH_BASIC_CLIENT_ID="3379d559701c154648dd" \
    GH_BASIC_SECRET_ID="836840de4e4ba34eb90743c2d92ba5a6af325fe8" \
    PGPASSWORD="pgpw" \
    JWT_SECRET="123" \
    PGUSER=stryker \
    PORT=1337 \
    node packages/website-backend/bin/dashboard-backend.js
