[![Mutation testing badge](https://img.shields.io/endpoint?style=flat&url=https%3A%2F%2Fbadge-api.stryker-mutator.io%2Fgithub.com%2Fstryker-mutator%2Fstryker-dashboard%2Fmaster%3Fmodule%3Dbadge-api)](https://badge-api.stryker-mutator.io/github.com/stryker-mutator/stryker-dashboard/master?module=badge-api)
[![Build Status](https://github.com/stryker-mutator/stryker-dashboard/workflows/CI/badge.svg)](https://github.com/stryker-mutator/stryker-dashboard/actions?workflow=CI)

# Stryker dashboard Badge API

The Badge API azure function that is responsible for delivering the badge structure to shields.io. 

Example of a badge URL: 
https://img.shields.io/endpoint?style=flat&url=https%3A%2F%2Fbadge-api.stryker-mutator.io%2Fgithub.com%2Fstryker-mutator%2Fstryker-dashboard%2Fmaster%3Fmodule%3Dbadge-api

Example of a badge api URL itself:

HTTP GET https://badge-api.stryker-mutator.io/github.com/stryker-mutator/stryker-dashboard/master?module=badge-api

Response: 

```json
{
  "color": "orange",
  "label": "Mutation score",
  "message": "69.4%",
  "schemaVersion": 1
}
```