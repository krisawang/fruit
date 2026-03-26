export type InventoryStatus = "Fresh" | "Normal" | "Low Stock" | "Expiring";

export type InventoryItem = {
  id: string;
  name: string;
  category: string;
  batchNo: string;
  origin: string;
  quantity: number;
  unit: string;
  warehouseLocation: string;
  inboundDate: string;
  expiryDate: string;
  status: InventoryStatus;
};

export type TransactionRecord = {
  id: string;
  fruitName: string;
  batchNo: string;
  quantity: number;
  unit: string;
  operator: string;
  date: string;
  note: string;
};

export type DashboardStats = {
  totalInventory: number;
  todayInbound: number;
  todayOutbound: number;
  expiringSoon: number;
  lowStock: number;
  todayLoss: number;
};

export const dashboardStats: DashboardStats = {
  totalInventory: 28640,
  todayInbound: 3250,
  todayOutbound: 2180,
  expiringSoon: 1480,
  lowStock: 6,
  todayLoss: 92
};

export const inventoryItems: InventoryItem[] = [
  {
    id: "FRU-001",
    name: "红富士苹果",
    category: "苹果",
    batchNo: "AP20260318A",
    origin: "山东烟台",
    quantity: 4200,
    unit: "kg",
    warehouseLocation: "A-01-03",
    inboundDate: "2026-03-18",
    expiryDate: "2026-04-12",
    status: "Fresh"
  },
  {
    id: "FRU-002",
    name: "库尔勒香梨",
    category: "梨",
    batchNo: "PR20260320B",
    origin: "新疆库尔勒",
    quantity: 1600,
    unit: "kg",
    warehouseLocation: "A-02-02",
    inboundDate: "2026-03-20",
    expiryDate: "2026-03-30",
    status: "Expiring"
  },
  {
    id: "FRU-003",
    name: "都乐香蕉",
    category: "香蕉",
    batchNo: "BN20260321C",
    origin: "菲律宾",
    quantity: 980,
    unit: "kg",
    warehouseLocation: "B-01-01",
    inboundDate: "2026-03-21",
    expiryDate: "2026-03-27",
    status: "Low Stock"
  },
  {
    id: "FRU-004",
    name: "智利车厘子",
    category: "车厘子",
    batchNo: "CH20260316A",
    origin: "智利",
    quantity: 2350,
    unit: "box",
    warehouseLocation: "C-03-01",
    inboundDate: "2026-03-16",
    expiryDate: "2026-03-29",
    status: "Normal"
  },
  {
    id: "FRU-005",
    name: "麒麟西瓜",
    category: "西瓜",
    batchNo: "WM20260322D",
    origin: "海南",
    quantity: 520,
    unit: "pcs",
    warehouseLocation: "D-01-02",
    inboundDate: "2026-03-22",
    expiryDate: "2026-03-28",
    status: "Low Stock"
  },
  {
    id: "FRU-006",
    name: "金煌芒果",
    category: "芒果",
    batchNo: "MG20260319E",
    origin: "广西百色",
    quantity: 3300,
    unit: "kg",
    warehouseLocation: "B-02-04",
    inboundDate: "2026-03-19",
    expiryDate: "2026-04-02",
    status: "Fresh"
  }
];

export const inboundRecords: TransactionRecord[] = [
  {
    id: "IN-001",
    fruitName: "赣南脐橙",
    batchNo: "OR20260323A",
    quantity: 1200,
    unit: "kg",
    operator: "王倩",
    date: "2026-03-23 09:10",
    note: "早班到货"
  },
  {
    id: "IN-002",
    fruitName: "红心火龙果",
    batchNo: "PT20260323B",
    quantity: 680,
    unit: "box",
    operator: "李彬",
    date: "2026-03-23 11:35",
    note: "冷链入库"
  },
  {
    id: "IN-003",
    fruitName: "金煌芒果",
    batchNo: "MG20260323C",
    quantity: 1370,
    unit: "kg",
    operator: "陈雨",
    date: "2026-03-23 14:20",
    note: "补充库存"
  }
];

export const outboundRecords: TransactionRecord[] = [
  {
    id: "OUT-001",
    fruitName: "红富士苹果",
    batchNo: "AP20260318A",
    quantity: 860,
    unit: "kg",
    operator: "赵凯",
    date: "2026-03-23 08:45",
    note: "商超配送"
  },
  {
    id: "OUT-002",
    fruitName: "智利车厘子",
    batchNo: "CH20260316A",
    quantity: 240,
    unit: "box",
    operator: "徐浩",
    date: "2026-03-23 13:00",
    note: "门店调拨"
  },
  {
    id: "OUT-003",
    fruitName: "都乐香蕉",
    batchNo: "BN20260321C",
    quantity: 390,
    unit: "kg",
    operator: "赵凯",
    date: "2026-03-23 15:50",
    note: "电商订单"
  }
];

export const lossRecords: TransactionRecord[] = [
  {
    id: "LS-001",
    fruitName: "都乐香蕉",
    batchNo: "BN20260321C",
    quantity: 32,
    unit: "kg",
    operator: "周蓉",
    date: "2026-03-23 10:15",
    note: "表皮损伤"
  },
  {
    id: "LS-002",
    fruitName: "麒麟西瓜",
    batchNo: "WM20260322D",
    quantity: 11,
    unit: "pcs",
    operator: "周蓉",
    date: "2026-03-23 12:40",
    note: "搬运破损"
  },
  {
    id: "LS-003",
    fruitName: "库尔勒香梨",
    batchNo: "PR20260320B",
    quantity: 49,
    unit: "kg",
    operator: "王倩",
    date: "2026-03-23 16:10",
    note: "临期处理"
  }
];

export const reportRows = [
  { label: "库存周转率", value: "2.8 次/月", trend: "+0.3" },
  { label: "平均损耗率", value: "1.9%", trend: "-0.2%" },
  { label: "临期批次占比", value: "8.4%", trend: "+1.1%" },
  { label: "出库及时率", value: "96.2%", trend: "+0.8%" }
];
