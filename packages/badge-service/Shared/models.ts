export interface ApiKeyEntity {
    partitionKey: {
        _: string
    }
    rowKey: {
        _: string 
    };
    repoSlug: {
        _: string
    };
    timeStamp: Date;
}

export interface MutationScoreEntity {
    partitionKey: string;
    rowKey: string;
    branch: string;
    mutationScore: {
        _: number
    };
    reportData: string;
}

export enum Color {
    Red = 'red',
    Orange = 'orange',
    Green = 'green'
}
