export function constructApiUri(
  slug: string,
  queryParams: { module: string | undefined; realTime: string | undefined }
) {
  const base = `/api/reports/${slug}`;
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(queryParams)) {
    if (value !== undefined && value !== null) {
      params.append(key, value);
    }
  }
  const queryString = params.toString();
  return queryString.length > 0 ? `${base}?${params.toString()}` : base;
}
