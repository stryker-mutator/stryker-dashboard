export interface Logger {
  info(obj: object): void;
  debug(obj: object): void;
  warn(obj: object): void;
  error(obj: object): void;
}
