/**
 * Represents a project in the stryker-mutator dashboard.
 * A project maps one-to-one with a github repository.
 */
export interface Repository {
  /**
   * A GitHub slug, i.e. `github/:owner/:name`, e.g. `github/stryker-mutator/stryker-badge`.
   */
  slug: string;

  /**
   * URL to domain of repository, e.g. `https://www.github.com/`.
   */
  origin: string;

  /**
   * Username or organisation, e.g. `stryker-mutator`.
   */
  owner: string;

  /**
   * Displayed name of the repository, e.g. `stryker-badge`.
   */
  name: string;

  /**
   * Checked when stryker-badge is enabled for this repository.
   */
  enabled: boolean;
}
