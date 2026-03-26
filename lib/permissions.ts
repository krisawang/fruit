export const permissionKeys = [
  "dashboard",
  "inventory",
  "inbound",
  "outbound",
  "loss",
  "batches",
  "reports",
  "users"
] as const;

export type PermissionKey = (typeof permissionKeys)[number];
export type PermissionMap = Record<PermissionKey, boolean>;

export const permissionLabels: Record<PermissionKey, string> = {
  dashboard: "�Ǳ���",
  inventory: "������",
  inbound: "������",
  outbound: "�������",
  loss: "��ĵǼ�",
  batches: "���α�����",
  reports: "��������",
  users: "�û���Ȩ��"
};

export const defaultMemberPermissions: PermissionMap = {
  dashboard: true,
  inventory: true,
  inbound: false,
  outbound: false,
  loss: false,
  batches: true,
  reports: false,
  users: false
};

export const fullPermissions: PermissionMap = {
  dashboard: true,
  inventory: true,
  inbound: true,
  outbound: true,
  loss: true,
  batches: true,
  reports: true,
  users: true
};
