
export function slashesToSemicolons(inputWithSlashes: string) {
  return inputWithSlashes.replace(/\//g, ';');
}

export function semicolonsToSlashes(inputWithSemiColons: string) {
  return inputWithSemiColons.replace(/;/g, '/');
}
