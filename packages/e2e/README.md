# E2E testing guide for Stryker Dashboard

A few steps are needed to run end to end tests for Stryker Dashboard. This guide is meant for running these tests locally.

## Before running the tests

There a few things necessary for running the tests successfully, these are listed below.

### Setting environment variables

We need to gather a few values for the variables defined in the template [file](./.env.template). 
Most of these are already prefilled for local environments, but the `E2E_JWT_SECRET` and `E2E_ACCESS_TOKEN` are not. 
For the `E2E_JWT_SECRET`, we can fill in any value so long as it equals the value what is put in the environment file in the `website-backend`.

The `E2E_ACCESS_TOKEN` is a bit trickier to get. It normally requires access to our 'dummy' account: [strykermutator-test-account](https://github.com/strykermutator-test-account) (which is what the test defaults to).

If possible, create a new GitHub account to your liking (or use your own) and add the same repositories that our testing accounts has:

1. [hello-world repository](https://github.com/strykermutator-test-account/hello-world).
2. [hello-test repository](https://github.com/strykermutator-test-account/hello-test) (empty repository).

Once you have an account set up, we log into the dashboard with said account. Once logged in, we can grab our AuthToken from Session Storage and put it into the [jwt.io](https://jwt.io/) decoder. In the decoded output, an `accessToken` property is present. This is the value that we are looking for.

Now that all values are covered, we should put them into the following file: `.local.env`. Don't forget to override the username used in the E2E tests: `E2E_GITHUB_USER_NAME`.

### Packages that need to be running

Run both the `website-frontend` and `website-backend` package. Optionally run the `badge-api` package.

## Running E2E tests

To run the E2E tests, use the "Run and Debug" functionality in Visual Studio Code. The configuration that should be run is called "🎭 E2E tests (local)"
