# Contributing to Stryker Dashboard

This is the contribution guide for Stryker Dashboard. Great to have you here! Here are a few ways you can help make this project better.

## Reporting bugs

Did you find a bug? Please [create](https://github.com/stryker-mutator/stryker-dashboard/issues/new) an issue so we can talk about it!

## Adding new features

New features are welcome! Either as requests or proposals.

1. Please create an issue first, so we know what to expect from you.
2. Create a fork on your GitHub account.
3. Make the changes or additions in your fork.
4. Please create or edit unit tests or integration tests.
5. Run the tests and verify they pass.
6. Update documentation.
7. [Create](https://github.com/stryker-mutator/stryker-dashboard/compare) a Pull Request.

## Running the Stryker Dashboard locally

Please check out the [README.md](https://github.com/stryker-mutator/stryker-dashboard/blob/master/README.md) to help you getting started with running the dasbhoard locally.

## Working on existing issues

Do you want to contribute to the Stryker Dashboard, but don't know where to start?

Rest assured, we have prepared a few issues for this purpose. Most of the issues labeled with [`good-first-issue`](https://github.com/stryker-mutator/stryker-dashboard/labels/good-first-issue) are suited to be picked up by pretty much anyone!

If you are still not sure where to start or if you need help implementing anything, please reach out to us on [Slack](https://join.slack.com/t/stryker-mutator/shared_invite/enQtOTUyMTYyNTg1NDQ0LTU4ODNmZDlmN2I3MmEyMTVhYjZlYmJkOThlNTY3NTM1M2QxYmM5YTM3ODQxYmJjY2YyYzllM2RkMmM1NjNjZjM) or simply comment on the issue that you would like to work on.

## Releasing

To release a new version of the Stryker Dashboard, please follow these steps:

- Set your `GH_TOKEN` environment variable to a GitHub token that has access to the repository. You can use the github CLI: `export GH_TOKEN=$(gh auth token)`
- Run `npx lerna version`, check the changes and confirm the version bump. This will create a new version and push the changes to the repository.
- This will trigger a GitHub action that will publish and deploy the new version of the Stryker Dashboard.

## Community

Do you want to help? Great! These are a few things you can do:

- Evangelize mutation testing. Mutation testing is still relatively new, please help us get the word out there!
- Share your stories in blog posts an on social media. Please inform us about it! Did you use Stryker? Your feedback is very valuable to us. Good and bad! Please contact us on [X](https://twitter.com/stryker_mutator) or [Slack](https://join.slack.com/t/stryker-mutator/shared_invite/enQtOTUyMTYyNTg1NDQ0LTU4ODNmZDlmN2I3MmEyMTVhYjZlYmJkOThlNTY3NTM1M2QxYmM5YTM3ODQxYmJjY2YyYzllM2RkMmM1NjNjZjM) and let us know what you think.
