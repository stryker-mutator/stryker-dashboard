// When developing, we re-route all requests to the backend.
// In production, the backend hosts the frontend. 
// In this situation we can simply leave the URL as it is.
export const baseUrl = import.meta.env.MODE === 'development' ? 'http://localhost:1337' : '';
