
export function encodeKey(inputWithSlashes: string) {
  return inputWithSlashes.replace(/\//g, ';');
}

export function decodeKey(inputWithSemiColons: string) {
  return inputWithSemiColons.replace(/;/g, '/');
}
