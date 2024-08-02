import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import createFetchMock, { FetchMock } from 'vitest-fetch-mock';

import { AuthenticateResponse } from "@stryker-mutator/dashboard-contract";
import { AuthService } from "src/services/auth.service";
import { SessionStorageService } from "src/services/session-storage.service";

describe(AuthService.name, () => {
  let authService: AuthService;
  let mockSessionStorageService: SessionStorageService;
  let fetchMock: FetchMock;

  beforeEach(() => {
    mockSessionStorageService = {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn(),
    };
    authService = new AuthService(mockSessionStorageService);

    fetchMock = createFetchMock(vi);
    fetchMock.enableMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
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
    const mockResponse: AuthenticateResponse = {
      jwt: 'foo'
    };
    
    fetchMock.mockIf('http://localhost:1337/api/auth/test-provider?code=test-code', () => {
      return { status: 200, body: '{ jwt: "foo" }'};
    });

    fetchMock.mockIf('http://localhost:1337/api/user', () => {
      return { status: 200, body: '{ name: "foo", avatarUrl: "bar" }'};
    });

    // Act
    await authService.authenticate(provider, code);

    // Assert
    expect(mockSessionStorageService.setItem).toHaveBeenCalledWith('authToken', 'test-token');
    expect(authService.currentUser).toEqual(mockResponse.jwt);
  });
});
