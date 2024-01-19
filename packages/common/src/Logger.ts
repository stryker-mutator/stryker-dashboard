export interface Logger {
  log(obj: object): void;
  debug(obj: object): void;
  warn(obj: object): void;
  error(obj: object): void;
}
