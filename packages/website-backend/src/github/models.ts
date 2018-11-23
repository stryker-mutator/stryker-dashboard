export interface Authentication {
    accessToken: string;
    displayName: string;
    id: number;
    username: string;
}

export interface Login {
    login: string;
    avatar_url: string;
    url: string;
}

export interface Repository {
    id: number;
    full_name: string;
    owner: Login;
    name: string;
    url: string;
    description: string;
    permissions: RepositoryPermissions;
}

export interface RepositoryPermissions {
    admin: boolean;
    push: boolean;
    pull: boolean;
}