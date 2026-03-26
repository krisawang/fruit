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
  dashboard: "\u4eea\u8868\u76d8",
  inventory: "\u5e93\u5b58\u7ba1\u7406",
  inbound: "\u5165\u5e93\u7ba1\u7406",
  outbound: "\u51fa\u5e93\u7ba1\u7406",
  loss: "\u635f\u8017\u767b\u8bb0",
  batches: "\u6279\u6b21\u4fdd\u8d28\u671f",
  reports: "\u62a5\u8868\u4e2d\u5fc3",
  users: "\u7528\u6237\u4e0e\u6743\u9650"
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
