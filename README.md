[![Mutation testing badge](https://img.shields.io/endpoint?style=flat&url=https%3A%2F%2Fbadge-api.stryker-mutator.io%2Fgithub.com%2Fstryker-mutator%2Fstryker-dashboard%2Fmaster)](https://dashboard.stryker-mutator.io/reports/github.com/stryker-mutator/stryker-dashboard/master)
[![Build Status](https://github.com/stryker-mutator/stryker-dashboard/workflows/CI/badge.svg)](https://github.com/stryker-mutator/stryker-dashboard/actions?workflow=CI)
[![Slack Chat](https://img.shields.io/badge/slack-chat-brightgreen.svg?logo=slack)](https://join.slack.com/t/stryker-mutator/shared_invite/enQtOTUyMTYyNTg1NDQ0LTU4ODNmZDlmN2I3MmEyMTVhYjZlYmJkOThlNTY3NTM1M2QxYmM5YTM3ODQxYmJjY2YyYzllM2RkMmM1NjNjZjM)

![Stryker](https://raw.githubusercontent.com/stryker-mutator/stryker-mutator.github.io/develop/static/images/stryker.svg)

# The Stryker dashboard

## Local development

### Requirements

First things first, there's always something before you can start.

To make our life easier, we use [NPM](https://www.npmjs.com/) a lot. Make sure you have it installed.

Our application runs in [Docker](https://www.docker.com/). If you don't already use it, now would be the time. Make sure the Docker daemon is up and running.

### Azure Storage

We store our data in [Azure Storage](https://azure.microsoft.com/en-us/free/services/storage/), so you need to be able to do so as well. On Windows, you can use the [Azure Storage Emulator](https://docs.microsoft.com/en-gb/azure/storage/common/storage-use-emulator). For Mac users, we recommend creating a free [Azure account](https://azure.microsoft.com/en-us/free/services/storage/).

### GitHub OAuth application

[Register](https://github.com/settings/applications/new) a new OAuth application. This will allow users to connect to their GitHub account.

> Make sure you set the `Authorization callback URL` to `http://localhost:1337/auth/github/callback` (you can also use your preferred port).

### Build the application

Building the application is easy. First run `npm install && npm run build`, to build the application.

> If you run into problems with building using npm, this is likely caused by our use of `lerna` combined with some of the latest `node` features. A solution is to only use the npm install and build command in the `packages/website-frontend` directory.

### Configuration

Next, you need to define the following environment variables in a Docker [enviroment variables file](https://docs.docker.com/engine/reference/commandline/run/#set-environment-variables--e-env-env-file):

> You can also enter these in the commandline, but we recommend using a separate file because it contains sensitive information.

| Variable                          | Example                       | Explanation                                                                                                                        | Required |
| --------------------------------- | ----------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- | -------- |
| `AZURE_STORAGE_CONNECTION_STRING` | `DefaultEndpointsProtocol...` | Azure-issued String to connect to your Azure Storage.                                                                              | Yes      |
| `GH_BASIC_CLIENT_ID`              | `1234567890abcdef1234`        | GitHub-issued Client ID.                                                                                                           | Yes      |
| `GH_BASIC_SECRET_ID`              | `1234567890...abcdef1`        | GitHub-issued Client Secret.                                                                                                       | Yes      |
| `JWT_SECRET`                      | `u7apm8MrMBe8Fwrx4uMH`        | The secret for the HMAC algorithm that creates the signature of the [JWT](https://tools.ietf.org/html/rfc7519).                    | Yes      |
| `NODE_ENV`                        | `development`                 | Node setting for production environment. Used by us for some SSL settings. Can be either: `production` (default) or `development`. | No       |
| `PORT`                            | `1337`                        | Port on which Stryker Dashboard will listen for connections.                                                                       | No       |

### Start the application

To start the application, you can now simply run `docker run --env-file env.list -p 1337:1337 strykermutator/dashboard`. This will spin-up a Docker container with the image that was build earlier; provide it with your environment variables set in the `env-list` file; and open port 1337 so you can access it on your local machine.

Stryker Dashboard should now be available at [http://localhost:1337](http://localhost:1337).

### (Optional) Front-end development

Building and re-running the Docker image everytime you make a small front-end change is a bit too much work. We use a proxy config file `packages/website-frontend/proxy.config.json`, to redirect requests from the frontend running locally (served by running `npm start`) to the backend running in a Docker container.

## Contributing

Pull requests are welcome!
See the [list of open issues](https://github.com/stryker-mutator/stryker-badge/issues) to get an idea of what you could work on.
Or, if you have an awesome idea, please [create a new issue](https://github.com/stryker-mutator/stryker-badge/issues/new) or [discuss it on Gitter](https://gitter.im/stryker-mutator/stryker).
