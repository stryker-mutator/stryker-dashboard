import { getBaseUrl } from "src/contract/constants";
import { describe, expect, it } from "vitest";

describe("constants", () => {

  it('should get the correct URL if it is run in development mode', () => {
    // Arrange
    import.meta.env.MODE = 'development';

    // Act & Assert
    expect(getBaseUrl()).to.eq('http://localhost:1337')
    
  });

  it('should get the correct URL if it is run in production mode', () => {
    // Arrange
    import.meta.env.MODE = 'production';

    // Act & Assert
    expect(getBaseUrl()).to.eq('')
  });

});

