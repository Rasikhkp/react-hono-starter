export type PermissionInfo = {
  id: string;
  name: string;
  resource: string;
};

export type RoleInfo = {
  id: string;
  name: string;
};

export type User = {
  id: string;
  name: string;
  email: string;
  isActive: boolean;
  isEmailVerified: boolean;
  googleSub?: string | null;
  hasPassword?: boolean;
  avatar: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  roles: RoleInfo[];
  permissions: PermissionInfo[];
};

export type CreateUser = {
  name: string;
  email: string;
  password: string;
  isActive: boolean;
  isEmailVerified: boolean;
  roleIds: string[];
};

export type EditUser = {
  id: string;
  name: string;
  email: string;
  password?: string;
  isActive: boolean;
  isEmailVerified: boolean;
  roleIds: string[];
};
