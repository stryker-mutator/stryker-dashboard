/**
 * The structure of a shield endpoint response
 * @see https://shields.io/endpoint
 */
export interface Shield {
  schemaVersion: 1;
  label: string;
  message: string;
  color: Color;
  namedLogo: 'stryker';
  logoColor: 'whitesmoke';
}

export enum Color {
  Grey = 'lightgrey',
  Red = 'red',
  Orange = 'orange',
  Green = 'green',
  BrightGreen = 'brightgreen',
}
