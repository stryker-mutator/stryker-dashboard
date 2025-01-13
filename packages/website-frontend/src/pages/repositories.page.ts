import type { Repository } from '@stryker-mutator/dashboard-contract';
import type { ToggleRepository } from '@stryker-mutator/stryker-elements';
import type { PropertyValues } from 'lit';
import { html, LitElement, nothing } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { map } from 'lit/directives/map.js';
import { when } from 'lit/directives/when.js';

import { authService } from '../services/auth.service';
import { historyService } from '../services/history.service';
import { organizationsService } from '../services/organizations.service';
import { repositoriesService } from '../services/repositories.service';
import { userService } from '../services/user.service';

@customElement('stryker-dashboard-repositories-page')
export class RepositoriesPage extends LitElement {
  @state()
  userRepositoryName = '';

  @state()
  repositories: Repository[] = [];

  @state()
  organizations: { name: string; value: string }[] = [];

  @state()
  done = { partOne: false, partTwo: false, repositories: true };

  @state()
  repositoryToToggle: { instance: Repository; apiKey: string | null } | null = null;

  @state()
  modalOpen = false;

  override connectedCallback(): void {
    super.connectedCallback();

    this.userRepositoryName = authService.currentUser!.name;
    this.#reflectOrganizationOrUserInUrl(this.userRepositoryName);

    void userService.getRepositories().then((repositories) => {
      this.repositories = repositories;
      this.done.partOne = true;
    });

    void userService.organizations().then((organizations) => {
      const organizationNames = organizations.map((o) => o.name);
      organizationNames.unshift(this.userRepositoryName);

      this.organizations = organizationNames.map((organization) => ({
        name: organization,
        value: organization,
      }));

      this.done.partTwo = true;
    });
  }

  protected updated(changedProperties: PropertyValues<this>): void {
    if (changedProperties.has('modalOpen') && this.modalOpen) {
      document.dispatchEvent(new CustomEvent('modal-open'));
    }
  }

  override render() {
    return html`
      <sme-spatious-layout>
        <sme-loader useSpinner .loading=${!this.done.partOne && !this.done.partTwo}>
          <sme-dropdown
            @dropdownChanged="${this.#handleDropDownChanged}"
            .options="${this.organizations}"
          ></sme-dropdown>
          <sme-hr></sme-hr>
          <sme-loader useSpinner .loading=${!this.done.repositories}>
            <sme-title>Enabled repositories</sme-title>
            ${when(
              this.#determineIfThereAreEnabledRepositories,
              () => html`<sme-list id="enabled-repositories">${this.#renderEnabledRepostories()}</sme-list>`,
              () =>
                html`<sme-notify id="no-enabled-repositories" type="info"
                  >There are no enabled repositories. You can enable them below.</sme-notify
                >`,
            )}
            <sme-title>Disabled repositories</sme-title>
            ${when(
              this.#determineIfThereAreDisabledRepositories,
              () => html`<sme-list id="disabled-repositories">${this.#renderDisabledRepositories()}</sme-list>`,
              () =>
                html`<sme-notify id="no-repositories-to-enable" type="info"
                  >You don't have any repositories to enable.</sme-notify
                >`,
            )}
          </sme-loader>
        </sme-loader>
      </sme-spatious-layout>
      ${this.#renderRepositoryModal()}
    `;
  }

  #renderEnabledRepostories() {
    return html`${map(this.repositories, (repository) => this.#renderRepository(repository, () => !repository.enabled))}`;
  }

  #renderDisabledRepositories() {
    return html`${map(this.repositories, (repository) => this.#renderRepository(repository, () => repository.enabled))}`;
  }

  #renderRepository(repository: Repository, shouldHide: () => boolean) {
    return html`
      <sme-toggle-repository
        ?hidden="${shouldHide()}"
        @openRepositorySettings="${() => this.#handleRepositoryClick(repository)}"
        @repositoryToggled="${(event: CustomEvent<{ checked: boolean; ref: ToggleRepository }>) =>
          this.#handleRepositoryToggled(event, repository)}"
        .enabled="${repository.enabled}"
        name="${repository.name}"
        slug="${this.#getSlugWithDefaultBranch(repository)}"
      >
      </sme-toggle-repository>
    `;
  }

  #renderRepositoryModal() {
    if (!this.modalOpen) {
      return nothing;
    }

    return html`
      <sme-modal
        title="Configuring ${this.repositoryToToggle?.instance.name}"
        @modal-close="${this.#handleModalClosed}"
      >
        ${when(
          this.repositoryToToggle?.apiKey === null,
          () => html`
            <sme-collapsible id="no-api-key-collapsible" title="API Key" opened>
              <sme-notify type="info"
                >Your api key should already have been copied. If you need a new one, re-enable this
                repository.</sme-notify
              >
            </sme-collapsible>
          `,
          () => html`
            <sme-collapsible id="api-key-collapsible" title="API Key" opened>
              <sme-text
                >Here's your API key:<sme-copy-text id="copy-key"
                  >${this.repositoryToToggle?.apiKey}</sme-copy-text
                ></sme-text
              >
              <sme-text>
                This is your key. It is unique and special made for "${this.repositoryToToggle?.instance.slug}". This is
                the last time we'll be showing it to you (although you can create new ones at any time).
              </sme-text>
            </sme-collapsible>
          `,
        )}
        <sme-collapsible id="badge-collapsible" title="Badge">
          <sme-badge-configurator
            projectName="${ifDefined(this.repositoryToToggle?.instance.slug)}"
          ></sme-badge-configurator>
        </sme-collapsible>
        <sme-collapsible id="usage-collapsible" title="Usage">
          <sme-text>
            See the
            <sme-link href="https://stryker-mutator.io/docs/General/dashboard/" inline unStyled>
              <b><u>Stryker dashboard documentation ↗</u></b>
            </sme-link>
            for an explanation on how you can configure the dashboard reporter or use cURL to send your report to the
            dashboard.
          </sme-text>
        </sme-collapsible>
      </sme-modal>
    `;
  }

  #getSlugWithDefaultBranch(repository: Repository): string {
    return `${repository.slug}/${repository.defaultBranch}`;
  }

  async #handleRepositoryToggled(
    event: CustomEvent<{ checked: boolean; ref: ToggleRepository }>,
    repository: Repository,
  ) {
    const response = await repositoriesService.enableRepository(repository.slug, event.detail.checked);
    event.detail.ref.isToggling = false;
    repository.enabled = response === null ? false : true;
    if (repository.enabled) {
      this.#openModal(repository, response!.apiKey);
    }

    this.repositories = [...this.repositories];
  }

  get #determineIfThereAreDisabledRepositories() {
    return this.repositories.some((r) => !r.enabled);
  }

  get #determineIfThereAreEnabledRepositories() {
    return this.repositories.some((r) => r.enabled);
  }

  async #handleDropDownChanged(event: CustomEvent<{ value: string }>) {
    this.done = { ...this.done, repositories: false };
    if (event.detail.value === this.userRepositoryName) {
      this.repositories = await userService.getRepositories();
    } else {
      this.repositories = await organizationsService.getRepositories(event.detail.value);
    }

    this.#reflectOrganizationOrUserInUrl(event.detail.value);
    this.done = { ...this.done, repositories: true };
  }

  #handleRepositoryClick(repository: Repository) {
    if (!repository.enabled) {
      return;
    }

    this.#openModal(repository);
  }

  #openModal(repository: Repository, apiKey: string | null = null) {
    this.modalOpen = true;
    this.repositoryToToggle = { instance: repository, apiKey };
  }

  #handleModalClosed() {
    // Reset the state of the modal
    this.repositoryToToggle = null;
    this.modalOpen = false;
  }

  #reflectOrganizationOrUserInUrl(orgOrUser: string) {
    historyService.getHistory().pushState({}, '', `/repos/${orgOrUser}`);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'stryker-dashboard-repositories-page': RepositoriesPage;
  }
}
