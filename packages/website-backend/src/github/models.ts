export interface Authentication {
  accessToken: string;
  displayName: string | null;
  id: string;
  username: string;
}

export interface Login {
  login: string;
  avatar_url: string;
  url: string;
}

export interface User extends Login {
  id: number;
  name: string | null;
}

export interface Repository {
  id: number;
  full_name: string;
  owner: Login;
  name: string;
  url: string;
  description: string;
  permissions: RepositoryPermissions;
  default_branch: string;
}

export interface RepositoryPermissions {
  admin: boolean;
  push: boolean;
  pull: boolean;
}
