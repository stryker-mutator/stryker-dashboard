/**
 * Represents a project in the stryker-mutator dashboard
 * A project maps one-to-one with a github repository
 */
export interface Repository {
    /**
     * A GitHub slug, i.e. github.com/username/repo
     */
    slug: string;

    /**
     * URL to domain of repository, e.g. https://www.github.com/
     */
    origin: string;

    /**
     * Username or organisation
     */
    owner: string;

    /**
     * Displayed name of the repository
     */
    name: string;

    /**
     * Checked when stryker-badge is enabled for this repository
     */
    enabled: boolean;
}
