import { HttpClient as InnerHttpClient } from 'typed-rest-client/HttpClient';
import * as utils from '../utils';
import { isUndefined } from 'util';
import { IncomingHttpHeaders } from 'http';
import { IRequestHandler } from 'typed-rest-client/Interfaces';

export interface Response<T> {
  body: T;
  headers: IncomingHttpHeaders;
}

export default class HttpClient {

  private readonly log = utils.debug(HttpClient.name);
  private client: InnerHttpClient;

  constructor(handlersOrClient: IRequestHandler[] | InnerHttpClient) {
    if (handlersOrClient instanceof InnerHttpClient) {
      this.client = handlersOrClient;
    } else {
      this.client = new InnerHttpClient('Stryker Dashboard API', handlersOrClient);
    }
  }

  async get<T>(fullUrl: string): Promise<Response<T>> {
    this.log(`Performing HTTP GET "${fullUrl}"`);
    const response = await this.client.get(fullUrl);
    const statusCode = response.message.statusCode;
    this.log(`Http GET ${fullUrl} response status: ${statusCode}`);
    if (isUndefined(statusCode)) {
      return Promise.reject(new Error(`Response of ${fullUrl} resulted in http status code undefined`));
    } else {
      const body = await response.readBody();
      if (statusCode >= 200 && statusCode < 300) {
        return { body: JSON.parse(body), headers: response.message.headers };
      } else {
        const error = new Error(`Failed request: (${statusCode}), message: ${body}`);
        error.name = 'InvalidHttpStatusCode';
        return Promise.reject(error);
      }
    }
  }
}