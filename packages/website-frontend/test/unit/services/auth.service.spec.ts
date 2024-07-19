import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import createFetchMock, { FetchMock } from 'vitest-fetch-mock';

import { AuthenticateResponse } from "@stryker-mutator/dashboard-contract";
import { AuthService } from "../../../src/services/auth.service";
import { SessionStorageService } from "../../../src/services/session-storage.service";

describe(AuthService.name, () => {
  let authService: AuthService;
  let mockSessionStorageService: SessionStorageService;
  let fetchMock: FetchMock;

  beforeEach(() => {
    vi.restoreAllMocks();

    mockSessionStorageService = {
      getItem: vi.fn(() => 'foo-token'),
      setItem: vi.fn(),
      removeItem: vi.fn(),
    };
    authService = new AuthService(mockSessionStorageService);

    fetchMock = createFetchMock(vi);
    fetchMock.enableMocks();
  });

  it('should sign out correctly', () => {
    // Act
    authService.signOut();

    // Assert
    expect(mockSessionStorageService.removeItem).toHaveBeenCalledWith('authToken');
    expect(authService.currentUser).toBeNull();
  });

  it('should return null for currentBearerToken if no token is stored', () => {
    // Arrange
    vi.spyOn(mockSessionStorageService, 'getItem').mockReturnValue(null);

    // Act
    const actual = authService.currentBearerToken;

    // Assert
    expect(actual).toBeNull();
  });

  it('should return the correct token for currentBearerToken if a token is stored', () => {
    // Arrange
    const token = 'test-token';
    vi.spyOn(mockSessionStorageService, 'getItem').mockReturnValue(token);

    // Act
    const actual = authService.currentBearerToken;

    // Assert
    expect(actual).toBe(token);
  });

  it('should return null for currentUser if no user is stored', () => {
    // Act
    const actual = authService.currentUser;

    // Assert
    expect(actual).toBeNull();
  });

  it('should authenticate and store the token correctly', async () => {
    // Arrange
    const provider = 'test-provider';
    const code = 'test-code';

    const mockJwtResponse: AuthenticateResponse = {
      jwt: 'foo'
    };
    const mockUserResponse = {
      name: 'foo',
      avatarUrl: 'bar',
    };

    fetchMock
      .once(JSON.stringify(mockJwtResponse))
      .once(JSON.stringify(mockUserResponse));

    // Act
    await authService.authenticate(provider, code);

    // Assert
    expect(mockSessionStorageService.setItem).toHaveBeenCalledWith('authToken', 'foo');
    expect(authService.currentUser).toEqual(mockUserResponse);
  });
});
