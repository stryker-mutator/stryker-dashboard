import { beforeEach, it, describe, expect, vi } from 'vitest';

import { Login } from '@stryker-mutator/dashboard-contract';
import '@stryker-mutator/stryker-elements';

import { CustomElementFixture } from '../../helpers/custom-element-fixture';
import { RepositoriesPage } from '../../../src/pages/repositories.page';
import { locationService } from '../../../src/services/location.service';
import { organizationsService } from '../../../src/services/organizations.service';
import { repositoriesService } from '../../../src/services/repositories.service';
import { userService } from '../../../src/services/user.service';

describe(RepositoriesPage.name, () => {
  let sut: CustomElementFixture<RepositoriesPage>;

  beforeEach(async () => {
    locationService.getLocation = vi.fn(() => ({ pathname: '/repos/user' } as Location));
    sut = new CustomElementFixture('stryker-dashboard-repositories-page', { autoConnect: false });
  });

  afterEach(() => {
    vi.restoreAllMocks();
    sut.dispose();
  });

  it('should be of the correct instance', async () => {
    expect(sut.element).to.be.instanceOf(RepositoriesPage);
  });

  describe('loader', () => {
    it('should be loading when fetch calls are not complete yet', async () => {
      // Arrange
      userService.getRepositories = () => new Promise(() => ([]));
      userService.organizations = () => new Promise(() => ([]));
  
      // Act
      sut.connect();
      await sut.whenStable();
  
      // Assert
      const loader = sut.element.shadowRoot?.querySelector('sme-loader');
      expect(loader?.getAttribute('doneWithLoading')).to.be.null;
    });

    it('should be done loading when fetch calls are complete', async () => {
      // Arrange
      userService.getRepositories = vi.fn(() => Promise.resolve([]));
      userService.organizations = vi.fn(() => Promise.resolve([]));
  
      // Act
      sut.connect();
      await sut.whenStable();
  
      // Assert
      const loader = sut.element.shadowRoot?.querySelector('sme-loader');
      // The property exists but has no value (boolean property)
      expect(loader?.getAttribute('doneWithLoading')).to.eq('');
    });
  });

  describe('dropdown', () => {
    let organizations: Login[];

    beforeEach(() => {
      organizations = [{ name: 'foo', avatarUrl: 'foo' }, { name: 'bar',  avatarUrl: 'bar' }];
    });

    it('should have the correct options', async () => {
      // Arrange
      userService.getRepositories = vi.fn(() => Promise.resolve([]));
      userService.organizations = vi.fn(() => Promise.resolve(organizations));
  
      // Act
      sut.connect();
      await sut.whenStable();
      // Allow it to render the options
      await sut.whenStable();
  
      // Assert
      const dropdown = sut.element.shadowRoot?.querySelector('sme-dropdown');
      expect(dropdown?.shadowRoot?.querySelectorAll('select > option').length).to.eq(3);
    });

    it('should get new repositories when the dropdown changes', async () => {
      // Arrange
      userService.getRepositories = vi.fn(() => Promise.resolve([]));
      userService.organizations = vi.fn(() => Promise.resolve(organizations));
      organizationsService.getRepositories = vi.fn(() => Promise.resolve([]));
  
      // Act
      sut.connect();
      await sut.whenStable();
      await sut.whenStable();

      const dropdown = sut.element.shadowRoot?.querySelector('sme-dropdown');
      dropdown?.dispatchEvent(new CustomEvent('dropdownChanged', { detail: { value: 'foo' } }));
      await sut.whenStable();

      // Assert
      expect(organizationsService.getRepositories).toHaveBeenCalledWith('foo');
    });
  });

  describe('repositories', () => {
    beforeEach(() => {
      userService.getRepositories = vi.fn(() => Promise.resolve([
        { name: 'foo1', slug: 'foo1/bar/baz/1', defaultBranch: 'main', enabled: true, owner: 'baz', origin: 'foo' },
        { name: 'foo2', slug: 'foo2/bar/baz/2', defaultBranch: 'main', enabled: false, owner: 'baz', origin: 'foo' },
      ]));
      userService.organizations = vi.fn(() => Promise.resolve([]));
    });

    it('should show the repositories correctly', async () => {
      // Act
      sut.connect();
      await sut.whenStable();
      await sut.whenStable();
  
      // Assert
      const loader = sut.element.shadowRoot?.querySelector('sme-loader');
      const enabledRepositories = loader?.querySelectorAll('sme-list#enabled-repositories > sme-toggle-repository');
      const disabledRepositories = loader?.querySelectorAll('sme-list#disabled-repositories > sme-toggle-repository');

      expect(enabledRepositories?.length).to.eq(2);
      expect(enabledRepositories![0].getAttribute('hidden')).to.be.null;
      expect(enabledRepositories![1].getAttribute('hidden')).to.eq('');
      expect(disabledRepositories?.length).to.eq(2);
      expect(disabledRepositories![0].getAttribute('hidden')).to.eq('');
      expect(disabledRepositories![1].getAttribute('hidden')).to.be.null;
    });

    it('should show no repositories when there are none', async () => {
      // Arrange
      userService.getRepositories = vi.fn(() => Promise.resolve([]));
      userService.organizations = vi.fn(() => Promise.resolve([]));

      // Act
      sut.connect();
      await sut.whenStable();
      await sut.whenStable();
      
      // Assert
      const loader = sut.element.shadowRoot?.querySelector('sme-loader');
      const noEnabledRepositoriesNotification = loader?.querySelector('sme-notify#no-enabled-repositories');
      const noRepositoriesToEnableNotification = loader?.querySelector('sme-notify#no-repositories-to-enable');

      expect(noEnabledRepositoriesNotification?.getAttribute('type')).to.eq('info');
      expect(noEnabledRepositoriesNotification?.textContent).to.eq('There are no enabled repositories. You can enable them below.');
      expect(noRepositoriesToEnableNotification?.getAttribute('type')).to.eq('info');
      expect(noRepositoriesToEnableNotification?.textContent).to.eq('You don\'t have any repositories to enable.');
    });

    it('should disable an enabled repository when it is clicked', async () => {
      // Arrange
      repositoriesService.enableRepository = vi.fn(() => Promise.resolve(null));

      // Act
      sut.connect();
      await sut.whenStable();
      await sut.whenStable();

      const loader = sut.element.shadowRoot?.querySelector('sme-loader')!;
      const enabledRepository = loader.querySelector('sme-list#enabled-repositories > sme-toggle-repository:not([hidden])');
      const button = enabledRepository?.shadowRoot?.querySelector('sme-button');
      button?.click();

      await sut.whenStable();

      // Assert
      expect(loader.querySelector('sme-notify#no-enabled-repositories')).to.not.be.null;
      expect(repositoriesService.enableRepository).toHaveBeenCalledWith('foo1/bar/baz/1', false);
    });

    it('should open the modal when a disabled repository is clicked', async () => {
      // Arrange
      repositoriesService.enableRepository = vi.fn(() => Promise.resolve({ enabled: true, apiKey: 'foo-bar-baz' }));

      // Act
      sut.connect();
      await sut.whenStable();
      await sut.whenStable();

      const loader = sut.element.shadowRoot?.querySelector('sme-loader')!;
      const disabledRepository = loader.querySelector('sme-list#disabled-repositories > sme-toggle-repository:not([hidden])');
      const button = disabledRepository?.shadowRoot?.querySelector('sme-button');
      button?.click();

      // Assert
      await sut.waitFor(() => sut.element.shadowRoot?.querySelector('sme-modal') !== null);
      const modal = sut.element.shadowRoot?.querySelector('sme-modal')!;
      const apiKeyCollapsible = modal.querySelector('sme-collapsible#api-key-collapsible')!;
      const badgeCollapsible = modal.querySelector('sme-collapsible#badge-collapsible')!;
      const usageCollapsible = modal.querySelector('sme-collapsible#usage-collapsible')!;

      expect(apiKeyCollapsible.textContent).to.contain('Here\'s your API key: foo-bar-baz');
      expect(badgeCollapsible.querySelector('sme-badge-configurator')).to.not.be.null;
      expect(usageCollapsible.textContent).to.contain('See the Stryker dashboard documentation ↗');
      
      const noEnabledRepositoriesNotification = loader?.querySelector('sme-notify#no-repositories-to-enable');
      expect(noEnabledRepositoriesNotification?.textContent).to.eq('You don\'t have any repositories to enable.');
    });

    it('should open the modal when an enabled repository is clicked', async () => {
      // Act
      sut.connect();
      await sut.whenStable();
      await sut.whenStable();

      const loader = sut.element.shadowRoot?.querySelector('sme-loader')!;
      const disabledRepository = loader.querySelector('sme-list#enabled-repositories > sme-toggle-repository:not([hidden])')!;
      disabledRepository.dispatchEvent(new Event('repositoryClicked'));

      // Assert
      await sut.waitFor(() => sut.element.shadowRoot?.querySelector('sme-modal') !== null);
      const modal = sut.element.shadowRoot?.querySelector('sme-modal')!;
      const apiKeyCollapsible = modal.querySelector('sme-collapsible#no-api-key-collapsible')!;

      expect(apiKeyCollapsible.textContent).to.contain('Your api key should already have been copied. If you need a new one, re-enable this repository.');
    });
  });
});
