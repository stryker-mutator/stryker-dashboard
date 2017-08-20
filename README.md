[![Build Status](https://travis-ci.org/stryker-mutator/stryker-badge.svg?branch=master)](https://travis-ci.org/stryker-mutator/stryker-badge)
[![Gitter](https://badges.gitter.im/stryker-mutator/stryker.svg)](https://gitter.im/stryker-mutator/stryker?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge)
[![Dependency Status](https://img.shields.io/david/stryker-mutator/stryker-badge.svg)](https://david-dm.org/stryker-mutator/stryker-badge)
[![devDependency Status](https://img.shields.io/david/dev/stryker-mutator/stryker-badge.svg)](https://david-dm.org/stryker-mutator/stryker-badge#info=devDependencies)

![Stryker](https://github.com/stryker-mutator/stryker/raw/master/stryker-80x80.png)

# The app for the Stryker mutation score badge

## Work in progress!

This repository represents a work in progress.

A Node.js application that

- [ ] Authenticates GitHub users using OAuth2.
- [ ] requests a list of projects from the authenticated user and shows it.
- [ ] saves projects for which a badge has to be displayed.
- [ ] generates a key for each project and shows it to the user.
Ideally, the key will not be stored in plain text in the database.
- [ ] accepts mutation score per user / repo.
The coverage data should uploaded using the above key.
If the correct key is used, store mutation score in database.
- [ ] retrieves the most recent score for a given user / repo, returned as a Shields.IO badge.
- [ ] some kind of database to store projects, keys and scores.
Let's start with PostgreSQL and see how things go.
- [ ] a nice front end app (written in React and TypeScript) for selecting projects, re-generating keys and stuff.

Other points
- [ ] Should also works with lerna-style monorepos (with a sub-package name/label to identify the package).
- [ ] Make app generic so it could be used for other scores.

## Getting started

### Configuration
To start the application, you need to define the following environment variables:

Variable | Example | Explanation
-------- | ------- | -----------
`GH_BASIC_CLIENT_ID`|`1234567890abcdef1234`|GitHub-issued Client ID.
`GH_BASIC_SECRET_ID`|`1234567890...abcdef1`|GitHub-issued Client Secret.
`JWT_SECRET`|`u7apm8MrMBe8Fwrx4uMH`|The secret for the HMAC algorithm that creates the signature of the [JWT](https://tools.ietf.org/html/rfc7519).
`PORT`|`3000`|Port at which the back end will listen for connections.

## Contributing
Pull requests are welcome!
See the [list of open issues](https://github.com/stryker-mutator/stryker-badge/issues) to get an idea of what you could work on.
Of, if you have an awesome idea, please [create a new issue](https://github.com/stryker-mutator/stryker-badge/issues/new) or [discuss it on Gitter](https://gitter.im/stryker-mutator/stryker).
