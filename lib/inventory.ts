import { InventoryStatus, Prisma } from "@prisma/client";

export const EXPIRING_SOON_DAYS = 7;

const packageTypeLabels = {
  BULK: "\u6563\u88c5",
  PACKAGED: "\u5305\u88c5"
} as const;

type PackageTypeValue = keyof typeof packageTypeLabels;

function normalizeImagePath(value: string | null | undefined) {
  if (!value) {
    return null;
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }

  if (/^(https?:|data:|blob:)/i.test(trimmed)) {
    return trimmed;
  }

  if (trimmed.startsWith("/api/uploads/")) {
    return trimmed;
  }

  if (trimmed.startsWith("/uploads/")) {
    return trimmed;
  }

  if (trimmed.startsWith("/")) {
    return trimmed;
  }

  return `/uploads/${trimmed.replace(/^\.?\/+/, "")}`;
}

function toStringArray(value: Prisma.JsonValue | null | undefined) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter((item): item is string => typeof item === "string")
    .map((item) => normalizeImagePath(item))
    .filter((item): item is string => Boolean(item));
}

export function startOfToday() {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  return date;
}

export function endOfToday() {
  const date = startOfToday();
  date.setDate(date.getDate() + 1);
  return date;
}

export function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

export function toNumber(value: Prisma.Decimal | number | string | null | undefined) {
  if (value == null) {
    return 0;
  }

  if (typeof value === "number") {
    return value;
  }

  if (typeof value === "string") {
    return Number(value);
  }

  return value.toNumber();
}

function toOptionalNumber(value: Prisma.Decimal | number | string | null | undefined) {
  if (value == null) {
    return null;
  }

  return toNumber(value);
}

export function computeInventoryStatus(params: {
  quantity: number;
  lowStockThreshold: number;
  expiryDate: Date;
  inboundDate?: Date;
  now?: Date;
}) {
  const now = params.now ?? new Date();
  const expiringDate = addDays(now, EXPIRING_SOON_DAYS);

  if (params.quantity <= 0) {
    return InventoryStatus.OUT_OF_STOCK;
  }

  if (params.expiryDate <= expiringDate) {
    return InventoryStatus.EXPIRING;
  }

  if (params.quantity <= params.lowStockThreshold) {
    return InventoryStatus.LOW_STOCK;
  }

  if (params.inboundDate && addDays(params.inboundDate, 3) >= now) {
    return InventoryStatus.FRESH;
  }

  return InventoryStatus.NORMAL;
}

export function serializeFruitItem(item: {
  id: string;
  name: string;
  category: string;
  batchNo: string;
  origin: string;
  quantity: Prisma.Decimal | number;
  unit: string;
  warehouseLocation: string;
  inboundDate: Date;
  expiryDate: Date;
  lowStockThreshold: Prisma.Decimal | number;
  status: InventoryStatus;
  createdAt: Date;
  updatedAt: Date;
  brand?: string | null;
  packageType?: PackageTypeValue | null;
  variety?: string | null;
  storageTemp?: string | null;
  foodLicense?: string | null;
  mainImage?: string | null;
  mainImages?: Prisma.JsonValue | null;
  detailImages?: Prisma.JsonValue | null;
  detailContent?: string | null;
  unitSpec?: string | null;
  netWeight?: Prisma.Decimal | number | null;
  price?: Prisma.Decimal | number | null;
  showOnHome?: boolean | null;
}) {
  const quantity = toNumber(item.quantity);
  const lowStockThreshold = toNumber(item.lowStockThreshold);
  const packageType = item.packageType ?? "BULK";
  const mainImages = toStringArray(item.mainImages);
  const mainImage = normalizeImagePath(item.mainImage) ?? mainImages[0] ?? null;

  return {
    ...item,
    brand: item.brand ?? null,
    packageType,
    variety: item.variety ?? null,
    storageTemp: item.storageTemp ?? null,
    foodLicense: item.foodLicense ?? null,
    mainImage,
    mainImages: mainImages.length > 0 ? mainImages : mainImage ? [mainImage] : [],
    detailImages: toStringArray(item.detailImages),
    detailContent: item.detailContent ?? null,
    unitSpec: item.unitSpec ?? null,
    netWeight: toOptionalNumber(item.netWeight),
    price: toOptionalNumber(item.price),
    showOnHome: Boolean(item.showOnHome),
    quantity,
    lowStockThreshold,
    packageTypeLabel: packageTypeLabels[packageType],
    inboundDate: item.inboundDate.toISOString(),
    expiryDate: item.expiryDate.toISOString(),
    createdAt: item.createdAt.toISOString(),
    updatedAt: item.updatedAt.toISOString(),
    isLowStock: quantity <= lowStockThreshold,
    isExpiringSoon: item.expiryDate <= addDays(new Date(), EXPIRING_SOON_DAYS)
  };
}