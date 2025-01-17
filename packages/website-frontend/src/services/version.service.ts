import { authService } from './auth.service';

export class VersionService {
  public async versions(slug: string): Promise<string[]> {
    const response = await fetch(`/api/version/${slug}`, {
      headers: { Authorization: `Bearer ${authService.currentBearerToken}` },
    });
    return response.json() as Promise<string[]>;
  }
}

export const versionService = new VersionService();
