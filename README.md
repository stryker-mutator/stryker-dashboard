<img src="https://raw.githubusercontent.com/stryker-mutator/stryker-mutator.github.io/develop/static/images/stryker.svg" alt="Stryker logo" style="width: 80px" />

# Stryker dashboard

[![Mutation testing badge](https://img.shields.io/endpoint?style=flat&url=https%3A%2F%2Fbadge-api.stryker-mutator.io%2Fgithub.com%2Fstryker-mutator%2Fstryker-dashboard%2Fmaster)](https://dashboard.stryker-mutator.io/reports/github.com/stryker-mutator/stryker-dashboard/master)
[![Build Status](https://github.com/stryker-mutator/stryker-dashboard/workflows/CI/badge.svg)](https://github.com/stryker-mutator/stryker-dashboard/actions?workflow=CI)
[![Slack Chat](https://img.shields.io/badge/slack-chat-brightgreen.svg?logo=slack)](https://join.slack.com/t/stryker-mutator/shared_invite/enQtOTUyMTYyNTg1NDQ0LTU4ODNmZDlmN2I3MmEyMTVhYjZlYmJkOThlNTY3NTM1M2QxYmM5YTM3ODQxYmJjY2YyYzllM2RkMmM1NjNjZjM)

## Local development

### Requirements

First things first, there's always something before you can start.

To make our life easier, we use [NPM](https://www.npmjs.com/) a lot. Make sure you have it installed.

### Azure Storage

We store our data in [Azure Storage](https://azure.microsoft.com/en-us/free/services/storage/), so you need to be able to do so as well. For local development (Windows, Mac and Linux), you can use [Azurite](https://github.com/Azure/Azurite).

### GitHub OAuth application

[Register](https://github.com/settings/applications/new) a new OAuth application. This will allow users to connect to their GitHub account.

> Depending on what you are doing, use the port `1337` (backend port) or `4200` (frontend port) in the `Authorization callback URL`: `http://localhost:{preferred_port}/auth/github/callback`.

### Build the application

Building the application is easy. First run `npm install && npm run build`, to build the application.

### Configuration

Next, you need to define the following environment variables in a `.env` file. An example file is located in the [packages/website-backend](./packages/website-backend/.env.example) folder.

| Variable                          | Example                       | Explanation                                                                                                                        | Required |
| --------------------------------- | ----------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- | -------- |
| `AZURE_STORAGE_CONNECTION_STRING` | `DefaultEndpointsProtocol...` | Azure-issued String to connect to your Azure Storage.                                                                              | Yes      |
| `GH_BASIC_CLIENT_ID`              | `1234567890abcdef1234`        | GitHub-issued Client ID.                                                                                                           | Yes      |
| `GH_BASIC_SECRET_ID`              | `1234567890...abcdef1`        | GitHub-issued Client Secret.                                                                                                       | Yes      |
| `JWT_SECRET`                      | `u7apm8MrMBe8Fwrx4uMH`        | The secret for the HMAC algorithm that creates the signature of the [JWT](https://tools.ietf.org/html/rfc7519).                    | Yes      |
| `NODE_ENV`                        | `development`                 | Node setting for production environment. Used by us for some SSL settings. Can be either: `production` (default) or `development`. | No       |

### Start the backend

Before running the backend, start Azurite first to emulate Azure storage:

1. `npm run start:azurite` (in the root of the project).

To start the backend, navigate to the `website-backend` package first:

2. `cd packages/website-backend`.

After doing this, simply run the backend by running the following command:

3. `npm run start` or `npm run start:watch` (to automatically refresh the backend when making changes).

The backend should now be available at [http://localhost:1337](http://localhost:1337).

### (Optional) Start the frontend

> Note: it is expected that the backend is running.

To start the front-end, navigate to the `website-frontend` package first:

1. `cd packages/website-frontend`.

After doing this, simply run the frontend by running the following command:

2. `npm run watch`

The frontend should now be availabe at [http://localhost:4200](http://localhost:4200).

### (Optional) Start storybook

We use [Lit](https://lit.dev/) for most of our components. These components are defined in the `stryker-elements` package. To develop these components, we use Storybook.

To run Storybook, navigate to the `packages/stryker-elements` first:

1. `cd packages/stryker-elements`.

Before running Storybook, run Vite first:

2. `npm run build:watch`.

To run storybook, use the following command:

3. `npm run start`.

### (Optional) Running End to End tests

See [`e2e/README.md`](./packages/e2e/README.md).

## Contributing

See [`CONTRIBUTING.md`](./CONTRIBUTING.md).
