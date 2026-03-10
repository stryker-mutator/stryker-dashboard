import { RestError } from '@azure/storage-blob';

/**
 * Helper to create a storage error, similar to the one Azure returns, complete with details errorCode
 */
export class StorageError extends RestError {
  public readonly message: string;
  constructor(message: string) {
    super(message);
    this.message = message;
    this.details = { errorCode: message };
  }
}
