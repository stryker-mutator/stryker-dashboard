export function getEnvVariable(variableName: string): string {
  const value = process.env[variableName];
  if (value) {
    return value;
  } else {
    throw new Error(`Missing ${variableName} env variable.`);
  }
}

export function getOptionalEnvVariable(variableName: string, defaultValue = '') {
  return process.env[variableName] ?? defaultValue;
}
