import { hkdf as hkdfCallback } from 'node:crypto';
import { promisify } from 'node:util';

import type { JWEContentEncryptionAlgorithm, JWEKeyManagementAlgorithm, JWTPayload } from 'jose';
import { EncryptJWT, jwtDecrypt } from 'jose';

const hkdf = promisify(hkdfCallback);

const KEY_LENGTH = 32;

/**
 * @param secret The secret to derive from, `JWT_SECRET` in practice.
 * @param purpose Names what the key is for, e.g. `'auth-token'`.
 */
export async function deriveKey(secret: string, purpose: string): Promise<Uint8Array> {
  return new Uint8Array(await hkdf('sha256', secret, '', purpose, KEY_LENGTH));
}

const KEY_MANAGEMENT_ALGORITHM: JWEKeyManagementAlgorithm = 'dir';
const CONTENT_ENCRYPTION_ALGORITHM: JWEContentEncryptionAlgorithm = 'A256GCM';
/** The purpose the encryption key is derived for. */
const KEY_INFO = 'auth-token';

const ISSUER = 'stryker';
const AUDIENCE = 'stryker';
const EXPIRATION_TIME = '30m';

/**
 * Creates and reads the authentication tokens handed out to the frontend.
 *
 * These are encrypted JWTs (JWE, RFC 7516) rather than signed ones, because they carry the user's
 * GitHub access token.
 *
 * @note This module deliberately isn't re-exported from the package index, it relies on
 * `node:crypto` and would end up in the frontend bundle.
 */
export class AuthTokenCodec {
  readonly #key: Promise<Uint8Array>;

  /**
   * @param secret The secret to derive the encryption key from, `JWT_SECRET` in practice. A key is
   * derived rather than used as-is, because the same secret also signs the OAuth session cookie.
   */
  constructor(secret: string) {
    this.#key = deriveKey(secret, KEY_INFO);
  }

  public async create(claims: JWTPayload): Promise<string> {
    return new EncryptJWT(claims)
      .setProtectedHeader({ alg: KEY_MANAGEMENT_ALGORITHM, enc: CONTENT_ENCRYPTION_ALGORITHM })
      .setIssuedAt()
      .setIssuer(ISSUER)
      .setAudience(AUDIENCE)
      .setExpirationTime(EXPIRATION_TIME)
      .encrypt(await this.#key);
  }

  public async read<T>(token: string): Promise<T> {
    const { payload } = await jwtDecrypt(token, await this.#key, {
      issuer: ISSUER,
      audience: AUDIENCE,
      keyManagementAlgorithms: [KEY_MANAGEMENT_ALGORITHM],
      contentEncryptionAlgorithms: [CONTENT_ENCRYPTION_ALGORITHM],
    });
    return payload as T;
  }
}
