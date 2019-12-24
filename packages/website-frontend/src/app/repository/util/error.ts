export function reportError({ message, error }: { message?: string, error?: Error }) {
  const userMessage = message ||
    'Something went wrong. Please check your internet connection. Try refreshing your page before trying again.';
  console.error(error);
  alert(userMessage);
}
