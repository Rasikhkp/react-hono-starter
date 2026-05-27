export type Permission = {
  id: string;
  name: string;
  resource: string;
  description: string | null;
  createdAt: Date | null;
  updatedAt: Date | null;
};

export type Role = {
  id: string;
  name: string;
  description: string | null;
  createdAt: Date | null;
  updatedAt: Date | null;
  permissions: Permission[];
};

export type CreateRole = {
  name: string;
  description: string | null;
  permissionIds?: string[];
};

export type EditRole = {
  id: string;
  name: string;
  description: string | null;
  permissionIds?: string[];
};
