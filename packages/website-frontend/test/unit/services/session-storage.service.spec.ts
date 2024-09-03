import { SessionStorageService } from '../../../src/services/session-storage.service';

describe(SessionStorageService.name, () => {
  let sut: SessionStorageService;

  beforeEach(() => {
    sut = new SessionStorageService();
    vi.restoreAllMocks();
  });

  it('should set an item in session storage', () => {
    // Arrange
    const key = 'foo';
    const value = 'bar';

    // Act
    sut.setItem(key, value);

    // Assert
    expect(window.sessionStorage.getItem(key)).to.eq(value);
  });

  it('should get an item from session storage', () => {
    // Arrange
    const key = 'foo';
    const value = 'bar';

    window.sessionStorage.setItem(key, value);

    // Act
    const result = sut.getItem(key);

    // Assert
    expect(result).toBe(value);
  });

  it('should remove an item from session storage', () => {
    // Arrange
    const key = 'foo';
    const value = 'bar';

    window.sessionStorage.setItem(key, value);

    // Act
    sut.removeItem(key);

    // Assert
    expect(window.sessionStorage.getItem(key)).to.be.null;
  });

  it('should return null if item does not exist in session storage', () => {
    // Arrange
    const key = 'nonexistent';

    // Act
    const result = sut.getItem(key);

    // Assert
    expect(result).toBeNull();
  });
});
