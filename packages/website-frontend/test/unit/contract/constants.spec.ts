import { describe, expect, it, vi } from "vitest";

import env from '../../../src/contract/envs';

describe("constants", () => {

  it('should get the correct URL if it is run in development mode', async () => {
    // Act & Assert
    const { getBaseUrl } = await import("../../../src/contract/constants");

    expect(getBaseUrl()).to.eq('http://localhost:1337')
  });

  it('should get the correct URL if it is run in production mode', async () => {
    // Arrange
    vi.spyOn(env, 'DEV', 'get').mockReturnValue(false)

    const { getBaseUrl } = await import("../../../src/contract/constants");


    // Act & Assert
    expect(getBaseUrl()).to.eq('http://localhost:4200')
  });
});
