import '@stryker-mutator/stryker-elements';

import type { Login } from '@stryker-mutator/dashboard-contract';
import { userEvent } from '@vitest/browser/context';

import { RepositoriesPage } from '../../../src/pages/repositories.page';
import { authService } from '../../../src/services/auth.service';
import { organizationsService } from '../../../src/services/organizations.service';
import { repositoriesService } from '../../../src/services/repositories.service';
import { userService } from '../../../src/services/user.service';
import { CustomElementFixture } from '../../helpers/custom-element-fixture';

describe(RepositoriesPage.name, () => {
  let sut: CustomElementFixture<RepositoriesPage>;

  beforeEach(() => {
    vi.spyOn(authService, 'currentUser', 'get').mockReturnValue({
      avatarUrl: 'foo',
      name: 'mockUser',
    });
    sut = new CustomElementFixture('stryker-dashboard-repositories-page', { autoConnect: false });
  });

  afterEach(() => {
    vi.restoreAllMocks();
    sut.dispose();
  });

  it('should be of the correct instance', () => {
    expect(sut.element).to.be.instanceOf(RepositoriesPage);
  });

  describe('loader', () => {
    it('should be loading when fetch calls are not complete yet', async () => {
      // Arrange
      userService.getRepositories = () => new Promise(() => []);
      userService.organizations = () => new Promise(() => []);

      // Act
      sut.connect();
      await sut.whenStable();

      // Assert
      const loader = sut.element.shadowRoot?.querySelector('sme-loader');
      expect(loader?.getAttribute('doneWithLoading')).to.be.null;
      expect(window.location.pathname).to.eq('/repos/mockUser');
    });

    it('should be done loading when fetch calls are complete', async () => {
      // Arrange
      userService.getRepositories = vi.fn().mockResolvedValue([]);
      userService.organizations = vi.fn().mockResolvedValue([]);

      // Act
      sut.connect();
      await sutDone();

      // Assert
      const loader = sut.element.shadowRoot?.querySelector('sme-loader');
      expect(loader).not.toHaveAttribute('loading', '');
    });
  });

  describe('dropdown', () => {
    let organizations: Login[];

    beforeEach(() => {
      organizations = [
        { name: 'foo', avatarUrl: 'foo' },
        { name: 'bar', avatarUrl: 'bar' },
      ];
    });

    it('should have the correct options', async () => {
      // Arrange
      userService.getRepositories = vi.fn().mockResolvedValue([]);
      userService.organizations = vi.fn().mockResolvedValue(organizations);

      // Act
      sut.connect();
      await sutDone();

      // Assert
      const dropdown = sut.element.shadowRoot?.querySelector('sme-dropdown');
      expect(dropdown?.shadowRoot?.querySelectorAll('select > option')).toHaveLength(3);
    });

    it('should get new repositories when the dropdown changes', async () => {
      // Arrange
      userService.getRepositories = vi.fn().mockResolvedValue([]);
      userService.organizations = vi.fn().mockResolvedValue(organizations);
      organizationsService.getRepositories = vi.fn().mockResolvedValue([]);

      // Act
      sut.connect();
      await sutDone();

      const dropdown = sut.element.shadowRoot?.querySelector('sme-dropdown');
      dropdown?.dispatchEvent(new CustomEvent('dropdownChanged', { detail: { value: 'foo' } }));
      await sutDone();

      // Assert
      expect(organizationsService.getRepositories).toHaveBeenCalledWith('foo');
      expect(window.location.pathname).to.eq('/repos/foo');
    });
  });

  describe('repositories', () => {
    beforeEach(() => {
      userService.getRepositories = vi.fn().mockResolvedValue([
        {
          name: 'foo1',
          slug: 'foo1/bar/baz/1',
          defaultBranch: 'main',
          enabled: true,
          owner: 'baz',
          origin: 'foo',
        },
        {
          name: 'foo2',
          slug: 'foo2/bar/baz/2',
          defaultBranch: 'main',
          enabled: false,
          owner: 'baz',
          origin: 'foo',
        },
      ]);
      userService.organizations = vi.fn().mockResolvedValue([]);
    });

    it('should show the repositories correctly', async () => {
      // Act
      sut.connect();
      await sutDone();

      // Assert
      const loader = sut.element.shadowRoot?.querySelector('sme-loader');
      const enabledRepositories = loader?.querySelectorAll('sme-list#enabled-repositories > sme-toggle-repository');
      const disabledRepositories = loader?.querySelectorAll('sme-list#disabled-repositories > sme-toggle-repository');

      expect(enabledRepositories).toHaveLength(2);
      expect(enabledRepositories![0].getAttribute('hidden')).to.be.null;
      expect(enabledRepositories![1].getAttribute('hidden')).to.eq('');
      expect(disabledRepositories).toHaveLength(2);
      expect(disabledRepositories![0].getAttribute('hidden')).to.eq('');
      expect(disabledRepositories![1].getAttribute('hidden')).to.be.null;
    });

    it('should show no repositories when there are none', async () => {
      // Arrange
      userService.getRepositories = vi.fn().mockResolvedValue([]);
      userService.organizations = vi.fn().mockResolvedValue([]);

      // Act
      sut.connect();
      await sutDone();

      // Assert
      const loader = sut.element.shadowRoot?.querySelector('sme-loader');
      const noEnabledRepositoriesNotification = loader?.querySelector('sme-notify#no-enabled-repositories');
      const noRepositoriesToEnableNotification = loader?.querySelector('sme-notify#no-repositories-to-enable');

      expect(noEnabledRepositoriesNotification).toHaveAttribute('type', 'info');
      expect(noEnabledRepositoriesNotification).toHaveTextContent(
        'There are no enabled repositories. You can enable them below.',
      );
      expect(noRepositoriesToEnableNotification).toHaveAttribute('type', 'info');
      expect(noRepositoriesToEnableNotification).toHaveTextContent("You don't have any repositories to enable.");
    });

    it('should disable an enabled repository when it is clicked', async () => {
      // Arrange
      repositoriesService.enableRepository = vi.fn().mockResolvedValue(null);

      // Act
      sut.connect();
      await sutDone();

      const loader = sut.element.shadowRoot!.querySelector('sme-loader')!;
      const enabledRepository = loader.querySelector(
        'sme-list#enabled-repositories > sme-toggle-repository:not([hidden])',
      );
      const button = enabledRepository?.shadowRoot?.querySelectorAll('button')[1];
      await userEvent.click(button!);

      await sutDone();

      // Assert
      await expect.element(loader.querySelector('sme-notify#no-enabled-repositories')!).toBeVisible();
      expect(repositoriesService.enableRepository).toHaveBeenCalledWith('foo1/bar/baz/1', false);
    });

    it('should open the modal when a disabled repository is clicked', async () => {
      // Arrange
      repositoriesService.enableRepository = vi.fn().mockResolvedValue({ enabled: true, apiKey: 'foo-bar-baz' });

      // Act
      sut.connect();
      await sutDone();

      const loader = sut.element.shadowRoot!.querySelector('sme-loader')!;
      const disabledRepository = loader.querySelector(
        'sme-list#disabled-repositories > sme-toggle-repository:not([hidden])',
      );
      const button = disabledRepository?.shadowRoot?.querySelector('button');
      await userEvent.click(button!);

      // Assert
      const modal = sut.element.shadowRoot!.querySelector('sme-modal')!;
      await expect.element(modal).toBeInTheDocument();
      const apiKeyCollapsible = modal.querySelector('sme-collapsible#api-key-collapsible')!;
      const badgeCollapsible = modal.querySelector('sme-collapsible#badge-collapsible')!;
      const usageCollapsible = modal.querySelector('sme-collapsible#usage-collapsible')!;

      await expect.element(apiKeyCollapsible).toHaveTextContent("Here's your API key:foo-bar-baz");
      await expect.element(badgeCollapsible.querySelector('sme-badge-configurator')!).toBeVisible();
      await expect.element(usageCollapsible).toHaveTextContent('See the Stryker dashboard documentation ↗');

      const noEnabledRepositoriesNotification = loader?.querySelector('sme-notify#no-repositories-to-enable');
      expect(noEnabledRepositoriesNotification).toHaveTextContent("You don't have any repositories to enable.");
    });

    it('should open the modal when an configure repository button is clicked', async () => {
      // Act
      sut.connect();
      await sutDone();

      const loader = sut.element.shadowRoot!.querySelector('sme-loader')!;
      const disabledRepository = loader.querySelector(
        'sme-list#enabled-repositories > sme-toggle-repository:not([hidden])',
      )!;
      const configureButton = disabledRepository.shadowRoot!.querySelector('button') as HTMLElement;
      await userEvent.click(configureButton);

      // Assert
      const modal = sut.element.shadowRoot!.querySelector('sme-modal')!;
      await expect.element(modal).toBeInTheDocument();
      const apiKeyCollapsible = modal.querySelector('sme-collapsible#no-api-key-collapsible')!;

      expect(apiKeyCollapsible).toHaveTextContent(
        'Your api key should already have been copied. If you need a new one, re-enable this repository.',
      );
    });
  });

  /**
   * Wait until all fetch calls are done and the element is stable
   */
  const sutDone = async () => {
    while (!(sut.element.done.partOne && sut.element.done.partTwo && sut.element.done.repositories)) {
      await sut.whenStable();
    }
    await sut.whenStable();
  };
});
