# The app for the Stryker mutation score badge

## Work in progress!

This repository represents a work in progress.

A Node.js application that

- [ ] GitHub Authentication Received (via OAuth2)
- [ ] requests a list of projects from that user and shows
- [ ] can save for which projects a badge has to be displayed
- [ ] generates a key for each project and shows it to the user
- [ ] has an endpoint for receiving coverage data per user / repo. Verifies that the data is provided with the above key. If yes, score scores in database.
- [ ] an endpoint to retrieve the most recent score for a given user / repo, returning a Shields.IO badge
- [ ] I want to choose a database for a moment, depending on where and how we will deploy. Personal preference would be PostgreSQL.
- [ ] a React + TypeScript application for turning on your Stryker badge and showing your api key
- [ ] Also works with lerna-style monorepo's (with a sub-package name/label to identify the package)
- [ ] Nice to have: make app generic so it could be used for other scores
