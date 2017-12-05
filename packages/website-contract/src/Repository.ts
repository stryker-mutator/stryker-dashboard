
/**
 * Represents a project in the stryker-mutator dashboard
 * A project maps one-to-one with a github repository
 */
export interface Repository {
    slug: string;
    origin: string;
    owner: string;
    name: string;
    enabled: boolean;
}
