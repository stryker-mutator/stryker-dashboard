export const requiredEnvVar = (name: string): string => {
    const value = process.env[name];
    if (!value) {
        throw new Error(`Environment variable ${name} not set.`);
    } else {
        return value;
    }
}

const config = {
    githubClientId: requiredEnvVar('GH_BASIC_CLIENT_ID'),
    githubSecret: requiredEnvVar('GH_BASIC_SECRET_ID'),
    jwtSecret: requiredEnvVar('JWT_SECRET'),
    port: parseInt(requiredEnvVar('PORT'), 10),
}

export default config;