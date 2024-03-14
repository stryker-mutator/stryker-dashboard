export function constructApiUri(
  location: string,
  slug: string,
  queryParams: { module: string | undefined; realTime: string | undefined },
) {
  const url = new URL(`${location}/api/reports/${slug}`);
  for (const [key, value] of Object.entries(queryParams)) {
    if (value !== undefined && value !== null) {
      url.searchParams.append(key, value);
    }
  }

  return url.toString();
}
