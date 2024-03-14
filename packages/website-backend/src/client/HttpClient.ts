import debug from 'debug';
import { Injectable } from '@nestjs/common';

export interface Response<T> {
  body: T;
  headers: Headers;
}

@Injectable()
export default class HttpClient {
  private readonly log = debug(HttpClient.name);

  public async fetchJson<T>(
    fullUrl: string,
    requestInit?: RequestInit,
  ): Promise<Response<T>> {
    this.log(`Performing HTTP GET "${fullUrl}"`);
    const response = await fetch(fullUrl, requestInit);
    if (response.ok) {
      return {
        headers: response.headers,
        body: (await response.json()) as T,
      };
    } else {
      const { status } = response;
      this.log(`Http GET ${fullUrl} response status: ${status}`);
      const error = new Error(
        `Failed request: (${status}), message: ${await response.text()}`,
      );
      error.name = 'InvalidHttpStatusCode';
      return Promise.reject(error);
    }
  }
}
