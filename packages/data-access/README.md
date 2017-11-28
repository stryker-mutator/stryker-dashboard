## Data model

```
    |--------------------|      
    | Project            |      
    |--------------------|      
    | owner: string PK   |      
    | name: string RK    |      
    | enabled: bool      |      
    | apiKeyHash: string |      
    |--------------------|      

    |--------------------|
    | MutationScore      |
    |--------------------|
    | slug: string PK    |
    | branch: string RK  |
    | score: number      |
    |--------------------|


    Legend:
    PK = Partition key
    RK = Row key
```

The data model will be stored in an [Azure table service database](https://docs.microsoft.com/en-us/rest/api/storageservices/Understanding-the-Table-Service-Data-Model?redirectedfrom=MSDN). 
It is a, very scalable, NoSQL database.

A project's owner owner is i.e. github.com/stryker-mutator
A project's name is the short name of the repository, i.e. stryker 
The mutation score's *slug* is a url-friendly version of a (github) repository name, i.e. github.com/stryker-mutator/stryker