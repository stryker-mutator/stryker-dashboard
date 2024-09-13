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

If you need to add a report quickly to the report, please use the following link:

https://stryker-mutator.io/docs/General/dashboard/#send-a-report-via-curl

An example report can be found [here](./test/unit/testResources/simple-report.json).
