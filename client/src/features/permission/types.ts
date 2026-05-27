export type Permission = {
  id: string;
  name: string;
  resource: string;
  description: string | null;
  createdAt: Date | null;
  updatedAt: Date | null;
};

export type CreatePermission = {
  name: string;
  resource: string;
  description: string | null;
};

export type EditPermission = {
  id: string;
  name: string;
  resource: string;
  description: string | null;
};
