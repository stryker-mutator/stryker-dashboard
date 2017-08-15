# Back end
The back end is implemented using [Express](https://expressjs.com/) and written in [TypeScript](http://www.typescriptlang.org/).
It stores its persistent data in a [PostgreSQL](https://www.postgresql.org/) database.

## Data model
The database has the following tables:
1. **`users`** contains all users that have ever authenticated using their GitHub accounts.
This table contains their access tokens so we can invoke GitHub API's on behalf of the user.
1. **`projects`** contains all GitHub projects for which an API key was generated.
It also stores the hash of generated API keys.
1. **`sessions`** contains session information (designed and managed by the [expressjs/session](https://github.com/expressjs/session) middleware).

## Flows

### Authentication
If an unauthenticated user acceses one of the end points, the back end sends an HTTP response with status 401 (`Unauthorized`).
This should signal the client (most likely our own front end application) to initiate the OAuth 2 flow with GitHub.
After returning, the user should have a _access token_; the back end stores this token (encrypted) in the `users` table.

### Show projects
Using the _access token_ from the `users` table, the back end retrieves [all repositories that are accessible to the user](https://developer.github.com/v3/repos/#list-your-repositories).

### Enable projects
When an authenticated user enables mutation score badges for a project, the back end generates an API key for that project.
The API key is hashed and then stored in the database; the original key is displayed to the user.

As a consequence, if the user loses his key, the only thing he can do is revoke the current key and generate a new one.

### Disable projects
When an authenticated user disables mutation score badges for a project, the back end removes all rows in the `projects` table for that project.

### Regenerate API key
When an authenticated user regenerates the API key for his project, the back end generates a new API key for that project.
The API key is hashed and then stored in the database; the original key is displayed to the user.

### Upload score
When a mutation score is uploaded, the following must be provided:
* user or organization name
* repository name
* branch; if omitted, we assume _master_ 
* score (numeric value between 0 and 100)
* module name (optional) for [Lerna](https://lernajs.io/)-style monorepo's
* API key

The key is matched against the `projects` table.
