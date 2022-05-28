import { getEnvVariable } from '../../actions/helpers.action.js';
import axios, { AxiosInstance, AxiosResponse } from 'axios';

export class BadgeApiClient {
  private readonly httpClient: AxiosInstance;

  constructor() {
    this.httpClient = axios.create({
      baseURL: getEnvVariable('E2E_BADGE_API_BASE_URL'),
    });
  }

  public badgeFor(slug: string): Promise<AxiosResponse<Shield>> {
    return this.httpClient.get<Shield>(`/${slug}`);
  }
}

export interface Shield {
  schemaVersion: 1;
  label: string;
  message: string;
  color: Color;
}

export enum Color {
  Grey = 'lightgrey',
  Red = 'red',
  Orange = 'orange',
  Green = 'green',
}
