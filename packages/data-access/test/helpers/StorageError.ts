import { RestError } from '@azure/storage-blob';

/**
 * Helper to create a storage error, similar to the one Azure returns, complete with details errorCode
 */
export class StorageError extends RestError {
  constructor(public readonly message: string) {
    super(message);
    this.details = { errorCode: message };
  }
}
