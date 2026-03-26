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

export const visiblePermissionKeys = ["dashboard", "inventory", "inbound", "outbound", "reports", "users"] as const;

export type PermissionKey = (typeof permissionKeys)[number];
export type VisiblePermissionKey = (typeof visiblePermissionKeys)[number];
export type PermissionMap = Record<PermissionKey, boolean>;

export const permissionLabels: Record<PermissionKey, string> = {
  dashboard: "仪表盘",
  inventory: "库存管理",
  inbound: "入库管理",
  outbound: "出库管理",
  loss: "损耗登记",
  batches: "批次保质期",
  reports: "报表中心",
  users: "用户与权限"
};

export const defaultMemberPermissions: PermissionMap = {
  dashboard: true,
  inventory: true,
  inbound: false,
  outbound: false,
  loss: false,
  batches: false,
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