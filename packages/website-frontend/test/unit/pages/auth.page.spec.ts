import '@stryker-mutator/stryker-elements';

import type { Router } from '@lit-labs/router';
import type { Login } from '@stryker-mutator/dashboard-contract';
import type { MockedObject } from 'vitest';

import { AuthPage } from '../../../src/pages/auth.page.ts';
import { authService } from '../../../src/services/auth.service.ts';
import { locationService } from '../../../src/services/location.service.ts';
import { CustomElementFixture } from '../../helpers/custom-element-fixture.ts';

vi.mock('../../src/services/auth.service');

describe(AuthPage.name, () => {
  let sut: CustomElementFixture<AuthPage>;

  beforeEach(() => {
    sut = new CustomElementFixture('stryker-dashboard-auth-page', { autoConnect: false });
    sut.element.router = {
      goto: vi.fn((path: string) => {
        locationService.getLocation().href = path;
      }),
    } as unknown as Router;
  });

  afterEach(() => {
    vi.restoreAllMocks();
    sut.dispose();
  });

  it('should be of the correct instance', () => {
    expect(sut.element).to.be.instanceOf(AuthPage);
  });

  function stubLocation() {
    const mockLocation = {
      toString: () => 'http://localhost:8080/auth?code=123&state=abc',
      href: '',
    } as Location;
    locationService.getLocation = vi.fn(() => mockLocation);
    return mockLocation;
  }

  it('should redirect to /repos/user after authentication', async () => {
    // Arrange
    stubLocation();
    authService.getUser = vi.fn(() => Promise.resolve({ name: 'user' } as unknown as Login));
    authService.authenticate = vi.fn(() => Promise.resolve(undefined as unknown as Login));

    // Act
    sut.connect();
    await sut.whenStable();

    // Assert
    expect(locationService.getLocation().href).to.eq('/repos/user');
    const [provider, authorizationResponse] = (authService as MockedObject<typeof authService>).authenticate.mock
      .calls[0];
    expect(authService.authenticate).toHaveBeenCalledOnce();
    expect(provider).to.eq('github');
    expect(authorizationResponse.toString()).to.eq('code=123&state=abc');
    expect(sut.element.shadowRoot?.querySelector('sme-spatious-layout')?.querySelector('sme-notify')).toHaveTextContent(
      'Authenticating, hold on for a moment...',
    );
  });

  it('should show an error and offer to sign in again when authentication fails', async () => {
    // Arrange
    const mockLocation = stubLocation();
    authService.authenticate = vi.fn(() => Promise.reject(new Error('Authentication failed (401 Unauthorized)')));

    // Act
    sut.connect();
    await sut.waitFor(() => sut.element.failed);
    await sut.whenStable();

    // Assert
    expect(mockLocation.href).to.eq('');
    const notify = sut.element.shadowRoot?.querySelector('sme-notify');
    expect(notify?.getAttribute('type')).to.eq('error');
    expect(notify).toHaveTextContent('Signing in failed.');
    expect(notify?.querySelector('a')?.getAttribute('href')).to.eq('/api/auth/github');
  });
});
