import { expect } from 'chai';

import { AuthTokenCodec } from '../../src/crypto.js';

interface TestClaims {
  accessToken: string;
  username: string;
}

describe(AuthTokenCodec.name, () => {
  const secret = 'u7apm8MrMBe8Fwrx4uMH';
  const claims: TestClaims = { accessToken: 'gho_the_access_token', username: 'dummy' };
  let sut: AuthTokenCodec;

  beforeEach(() => {
    sut = new AuthTokenCodec(secret);
  });

  it('should read back the claims it created', async () => {
    const token = await sut.create({ ...claims });

    expect(await sut.read<TestClaims>(token)).contains(claims);
  });

  it('should read back a token created by another instance with the same secret', async () => {
    const token = await sut.create({ ...claims });

    expect(await new AuthTokenCodec(secret).read<TestClaims>(token)).contains(claims);
  });

  it('should stamp the issuer, audience and an expiration time', async () => {
    const token = await sut.create({ ...claims });

    const payload = await sut.read<{ iss: string; aud: string; exp: number; iat: number }>(token);
    expect(payload.iss).eq('stryker');
    expect(payload.aud).eq('stryker');
    expect(payload.exp - payload.iat).eq(30 * 60);
  });

  it('should not leak the claims', async () => {
    const token = await sut.create({ ...claims });

    for (const part of token.split('.')) {
      expect(Buffer.from(part, 'base64url').toString('utf8')).not.contain('gho_the_access_token');
      expect(Buffer.from(part, 'base64url').toString('utf8')).not.contain('dummy');
    }
  });

  it('should produce a different token every time', async () => {
    expect(await sut.create({ ...claims })).not.eq(await sut.create({ ...claims }));
  });

  it('should reject a token that is not encrypted at all', async () => {
    await expect(sut.read('not.a.token')).rejectedWith('Invalid Compact JWE');
  });

  it('should reject a token created with a different secret', async () => {
    const token = await new AuthTokenCodec('a different secret').create({ ...claims });

    await expect(sut.read(token)).rejectedWith('decryption operation failed');
  });
});
