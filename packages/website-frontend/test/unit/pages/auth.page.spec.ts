import { Login } from '@stryker-mutator/dashboard-contract';
import '@stryker-mutator/stryker-elements';

import { CustomElementFixture } from '../../helpers/custom-element-fixture';
import { AuthPage } from '../../../src/pages/auth.page';
import { authService } from '../../../src/services/auth.service';
import { locationService } from '../../../src/services/location.service';

describe(AuthPage.name, () => {
  let sut: CustomElementFixture<AuthPage>;

  beforeEach(() => {
    sut = new CustomElementFixture('stryker-dashboard-auth-page', { autoConnect: false });

    vi.mock('../../src/services/auth.service');
  });

  afterEach(() => {
    vi.restoreAllMocks();
    sut.dispose();
  });

  it('should be of the correct instance', async () => {
    expect(sut.element).to.be.instanceOf(AuthPage);
  });

  it('should redirect to /repos/user after authentication', async () => {
    // Arrange
    const mockLocation = {
      toString: () => 'http://localhost:8080/auth?code=123',
      href: '',
    } as Location;
    locationService.getLocation = vi.fn(() => mockLocation);
    authService.getUser = vi.fn(() => Promise.resolve({ name: 'user' } as unknown as Login));
    authService.authenticate = vi.fn(() => Promise.resolve(undefined as unknown as Login));

    // Act
    sut.connect();
    await sut.whenStable();

    // Assert
    expect(locationService.getLocation().href).to.eq('/repos/user');
    expect(authService.authenticate).toHaveBeenCalledWith('github', '123');
    expect(
      sut.element.shadowRoot?.querySelector('sme-spatious-layout')?.querySelector('sme-notify')?.textContent,
    ).to.eq('Authenticating, hold on for a moment...');
  });
});
