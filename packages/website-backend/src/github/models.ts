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
}

export enum Permission {
    none = 'none',
    admin = 'admin',
    write = 'write',
    read = 'read'
}

export interface UserPermission {
    permission: Permission;
    user: Login;
}