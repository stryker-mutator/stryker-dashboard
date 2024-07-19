import { SessionStorageService } from "../../../src/services/session-storage.service";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

describe(SessionStorageService.name, () => {
  let sut: SessionStorageService;
  let sessionStorageMock: Storage;

  beforeEach(() => {
    sut = new SessionStorageService();
    sessionStorageMock = {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
      key: vi.fn(),
      length: 0
    };

    vi.restoreAllMocks();
    vi.spyOn(window, 'sessionStorage', 'get').mockReturnValue(sessionStorageMock);
  });

  it('should set an item in session storage', () => {
    // Arrange
    const key = 'foo';
    const value = 'bar';

    // Act
    sut.setItem(key, value);

    // Assert
    expect(sessionStorageMock.setItem).toHaveBeenCalledWith(key, value);
  });

  it('should get an item from session storage', () => {
    // Arrange
    const key = 'foo';
    const value = 'bar';
    sessionStorageMock.getItem = vi.fn(() => value);

    // Act
    const result = sut.getItem(key);

    // Assert
    expect(sessionStorageMock.getItem).toHaveBeenCalledWith(key);
    expect(result).toBe(value);
  });

  it('should remove an item from session storage', () => {
    // Arrange
    const key = 'foo';

    // Act
    sut.removeItem(key);

    // Assert
    expect(sessionStorageMock.removeItem).toHaveBeenCalledWith(key);
  });

  it('should return null if item does not exist in session storage', () => {
    // Arrange
    const key = 'nonexistent';
    sessionStorageMock.getItem = vi.fn(() => null);

    // Act
    const result = sut.getItem(key);

    // Assert
    expect(sessionStorageMock.getItem).toHaveBeenCalledWith(key);
    expect(result).toBeNull();
  });
});
