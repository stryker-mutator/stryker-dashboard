import { CustomElementFixture } from '../helpers/custom-element-fixture';
import { StrykerDashboard } from '../../src/app';
import { authService } from '../../src/services/auth.service';
import { locationService } from '../../src/services/location.service';

describe(StrykerDashboard.name, () => {
  let locationMock: Location;
  let sut: CustomElementFixture<StrykerDashboard>;

  beforeEach(() => {
    locationMock = {
      href: 'http://localhost:8080/',
      origin: 'foo-bar',
      reload: () => undefined,
    } as Location;
    locationService.getLocation = vi.fn(() => locationMock);
    sut = new CustomElementFixture('stryker-dashboard', { autoConnect: false });
  });

  afterEach(() => {
    vi.restoreAllMocks();
    sut.dispose();
  });

  it('should be of the correct instance', () => {
    expect(sut.element).to.be.instanceOf(StrykerDashboard);
  });

  it('should render the home page', async () => {
    // Arrange
    authService.getUser = vi.fn(() => Promise.resolve(null));

    // Act
    sut.connect();
    await sut.whenStable();

    // Assert
    const signInButton = sut.element.querySelector('sme-top-bar')?.querySelector('sme-button');
    expect(signInButton).toHaveTextContent('Sign in with GitHub');

    const outlet = sut.element.querySelector('#outlet');
    expect(outlet).toBeInTheDocument();
  });

  it('should render the top-bar differently when the user is logged in', async () => {
    // Arrange
    authService.getUser = vi.fn(() =>
      Promise.resolve({ name: 'John Doe', avatarUrl: 'https://example.com/avatar.png' }),
    );

    // Act
    sut.connect();
    await sut.whenStable();

    // Assert
    const profileButton = sut.element.querySelector('sme-top-bar')?.querySelector('sme-profile-button');
    expect(profileButton?.getAttribute('name')).to.eq('John Doe');
    expect(profileButton?.getAttribute('avatarUrl')).to.eq('https://example.com/avatar.png');
  });

  it('should sign in when sign-in is clicked', async () => {
    // Arrange
    authService.getUser = vi.fn(() => Promise.resolve(null));
    authService.authenticate = vi.fn(() =>
      Promise.resolve({ name: 'John Doe', avatarUrl: 'https://example.com/avatar.png' }),
    );

    // Act
    sut.connect();
    await sut.whenStable();
    const signInButton = sut.element.querySelector('sme-top-bar')?.querySelector('sme-button');
    signInButton?.click();

    await sut.whenStable();

    // Assert
    expect(locationService.getLocation().href).to.eq('foo-bar/api/auth/github');
  });

  it('should sign out when sign-out is clicked', async () => {
    // Arrange
    authService.getUser = vi.fn(() =>
      Promise.resolve({ name: 'John Doe', avatarUrl: 'https://example.com/avatar.png' }),
    );
    authService.signOut = vi.fn();
    locationMock.reload = vi.fn();

    // Act
    sut.connect();
    await sut.whenStable();
    await sut.whenStable();
    const profileButton = sut.element.querySelector('sme-top-bar')?.querySelector('sme-profile-button');
    profileButton?.dispatchEvent(new CustomEvent('sign-out'));
    await sut.whenStable();

    // Assert
    expect(authService.signOut).toHaveBeenCalled();
    expect(locationMock.reload).toHaveBeenCalled();
  });
});
