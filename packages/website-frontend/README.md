[![Mutation testing badge](https://img.shields.io/endpoint?style=flat&url=https%3A%2F%2Fbadge-api.stryker-mutator.io%2Fgithub.com%2Fstryker-mutator%2Fstryker-dashboard%2Fmaster%3Fmodule%3Dwebsite-frontend)](https://badge-api.stryker-mutator.io/github.com/stryker-mutator/stryker-dashboard/master?module=website-frontend)
[![Build Status](https://github.com/stryker-mutator/stryker-dashboard/workflows/CI/badge.svg)](https://github.com/stryker-mutator/stryker-dashboard/actions?workflow=CI)

# Stryker dashboard frontend

This project uses [Lit](https://lit.dev/).

## Development server

Run `npm start` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Build

Run `npm run build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running tests

Run `npm run test` to execute the tests via [Vitest](https://vitest.dev/) and [Playwright](https://playwright.dev/).

## Adding a report to the dashboard

If you need to add a report quickly to the report, here is a simple CURL command that uploads one:

```curl

curl -X PUT \
  http://localhost:1337/api/reports/github.com/{ORG}/{REPOSITORY}/{VERSION} \
  -H 'Content-Type: application/json' \
  -H 'X-Api-Key: {API_KEY}' \
  -d '{
  "mutationScore": 50,
  "thresholds": {
    "high": 80,
    "low": 60
  },
  "projectRoot": "/src/project",
  "files": {
    "test.js": {
      "language": "javascript",
      "source": "\"use strict\";\nfunction add(a, b) {\n  return a + b;\n}",
      "mutants": [
        {
          "id": "3",
          "location": {
            "start": {
              "column": 1,
              "line": 1
            },
            "end": {
              "column": 13,
              "line": 1
            }
          },
          "replacement": "\"\"",
          "mutatorName": "String Literal",
          "status": "Survived"
        },
        {
          "id": "1",
          "mutatorName": "Arithmetic Operator",
          "replacement": "-",
          "location": {
            "start": {
              "line": 3,
              "column": 12
            },
            "end": {
              "line": 3,
              "column": 13
            }
          },
          "status": "Survived"
        },
        {
          "id": "2",
          "mutatorName": "Block Statement",
          "replacement": "{}",
          "location": {
            "start": {
              "line": 2,
              "column": 20
            },
            "end": {
              "line": 4,
              "column": 1
            }
          },
          "status": "Killed"
        }
      ]
    }
  }
}'

```
