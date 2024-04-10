import { getEnvVariable } from '../../actions/helpers.action.js';

export class BadgeApiClient {
  private baseURL: URL;
  constructor() {
    this.baseURL = new URL(getEnvVariable('E2E_BADGE_API_BASE_URL'));
  }

  public async badgeFor(slug: string): Promise<Shield> {
    return (await fetch(new URL(`/${slug}`, this.baseURL))).json() as Promise<Shield>;
  }
}

export interface Shield {
  schemaVersion: 1;
  label: string;
  message: string;
  color: Color;
  namedLogo: 'stryker';
  logoColor: Color;
}

export enum Color {
  Grey = 'lightgrey',
  Red = 'red',
  Orange = 'orange',
  Green = 'green',
  BrightGreen = 'brightgreen',
  WhiteSmoke = 'whitesmoke',
}
