
/**
 * Represents a project in the stryker-mutator dashboard
 * A project maps one-to-one with a github repository
 */
export interface Project {
    repositorySlug: string;
    owner: string;
    name: string;
    enabled: boolean;
}
