[![Mutation testing badge](https://img.shields.io/endpoint?style=flat&url=https%3A%2F%2Fbadge-api.stryker-mutator.io%2Fgithub.com%2Fstryker-mutator%2Fstryker-dashboard%2Fmaster%3Fmodule%3Ddata-access)](https://badge-api.stryker-mutator.io/github.com/stryker-mutator/stryker-dashboard/master?module=data-access)
[![Build Status](https://github.com/stryker-mutator/stryker-dashboard/workflows/CI/badge.svg)](https://github.com/stryker-mutator/stryker-dashboard/actions?workflow=CI)

# Stryker dashboard data model

## Table storage

```
    |--------------------|
    |      Project       |
    |--------------------|
    | owner: string PK   |
    | name: string RK    |
    | enabled: bool      |
    | apiKeyHash: string |
    |--------------------|

    |-----------------------------------|
    |       MutationTestingReport       |
    |-----------------------------------|
    | projectName;version: string PK    |
    | module: string RK                 |
    | mutationScore: number             |
    |-----------------------------------|

    projectName = `${owner};${name}`

    Legend:
    PK = Partition key
    RK = Row key
```

This data model will be stored in an [Azure table service database](https://docs.microsoft.com/en-us/rest/api/storageservices/Understanding-the-Table-Service-Data-Model?redirectedfrom=MSDN).
It is a, very scalable, NoSQL database.

Some notes:

- A `Project`'s `owner` is i.e. `'github.com/stryker-mutator'`
- A `Project`'s `name` is the short name of the repository, i.e. `'stryker'`
- The `MutationTestingReport`'s `projectName` and `version` form the Partition Key. This is te full project name including the branch name (usually) i.e. `'github.com/stryker-mutator/stryker/master'`

## Blob storage

The mutation testing report json data is stored in Azure blob storage. The name of the blobs are `projectName`/`version`/`module`.
