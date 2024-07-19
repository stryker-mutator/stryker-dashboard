import env from "./envs";

// When developing, we re-route all requests to the backend.
// In production, the backend hosts the frontend.
// In this situation we can simply leave the URL as it is.
export function getBaseUrl() {
  return env.DEV ? 'http://localhost:1337' : window.location.origin;
}

export const baseUrl = getBaseUrl();
