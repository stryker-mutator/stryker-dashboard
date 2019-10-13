export function getEnvVariable(variableName: string): string {
  const value = process.env[variableName];
  if (value) {
    return value;
  } else {
    throw new Error(`Missing ${variableName} env variable.`);
  }
}
