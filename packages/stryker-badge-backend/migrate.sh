#!/bin/bash

echo Migrating database schema for $1...
node node_modules/db-migrate/bin/db-migrate --env $1 --verbose up --config database.json