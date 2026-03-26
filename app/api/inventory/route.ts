import { InventoryStatus, Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { ok, fail } from "@/lib/api";
import { addDays, computeInventoryStatus, serializeFruitItem } from "@/lib/inventory";
import { requireApiUser } from "@/lib/session";
import {
  ApiError,
  assertDate,
  assertEnumValue,
  assertNonNegativeNumber,
  assertOptionalNumber,
  assertOptionalString,
  assertOptionalStringArray,
  assertString
} from "@/lib/validation";

export const dynamic = "force-dynamic";

const packageTypeValues = ["BULK", "PACKAGED"] as const;

export async function GET(request: Request) {
  try {
    await requireApiUser("inventory");

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search")?.trim();
    const status = searchParams.get("status")?.trim() as InventoryStatus | null;
    const lowStockOnly = searchParams.get("lowStock") === "true";
    const expiringWithinDays = Number(searchParams.get("expiringWithinDays") || "0");

    const where: Record<string, unknown> = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { brand: { contains: search, mode: "insensitive" } },
        { category: { contains: search, mode: "insensitive" } },
        { batchNo: { contains: search, mode: "insensitive" } },
        { origin: { contains: search, mode: "insensitive" } },
        { variety: { contains: search, mode: "insensitive" } }
      ];
    }

    if (status && Object.values(InventoryStatus).includes(status)) {
      where.status = status;
    }

    if (lowStockOnly) {
      where.status = { in: [InventoryStatus.LOW_STOCK, InventoryStatus.OUT_OF_STOCK] };
    }

    if (expiringWithinDays > 0) {
      where.expiryDate = {
        lte: addDays(new Date(), expiringWithinDays)
      };
    }

    const items = await prisma.fruitItem.findMany({
      where,
      orderBy: [{ expiryDate: "asc" }, { updatedAt: "desc" }]
    });

    return ok(items.map(serializeFruitItem));
  } catch (error) {
    return fail(error);
  }
}

export async function PATCH(request: Request) {
  try {
    await requireApiUser("inventory");

    const body = await request.json();
    const id = assertString(body.id, "id");
    const batchNo = assertString(body.batchNo, "batchNo");
    const name = assertString(body.name, "name");
    const category = assertString(body.category, "category");
    const origin = assertString(body.origin, "origin");
    const unit = assertString(body.unit, "unit");
    const warehouseLocation = assertString(body.warehouseLocation, "warehouseLocation");
    const quantity = assertNonNegativeNumber(body.quantity, "quantity");
    const inboundDate = assertDate(body.inboundDate, "inboundDate");
    const expiryDate = assertDate(body.expiryDate, "expiryDate");
    const lowStockThreshold = assertNonNegativeNumber(body.lowStockThreshold, "lowStockThreshold");
    const brand = assertOptionalString(body.brand);
    const packageType = assertEnumValue(body.packageType, "packageType", packageTypeValues);
    const variety = assertOptionalString(body.variety);
    const storageTemp = assertOptionalString(body.storageTemp);
    const foodLicense = assertOptionalString(body.foodLicense);
    const mainImage = assertOptionalString(body.mainImage);
    const detailImages = assertOptionalStringArray(body.detailImages, "detailImages");
    const detailContent = assertOptionalString(body.detailContent);
    const unitSpec = assertOptionalString(body.unitSpec);
    const netWeight = assertOptionalNumber(body.netWeight, "netWeight");
    const price = assertOptionalNumber(body.price, "price");

    if (expiryDate <= inboundDate) {
      throw new ApiError(400, "expiryDate must be later than inboundDate");
    }

    const existing = await prisma.fruitItem.findUnique({ where: { id } });
    if (!existing) {
      throw new ApiError(404, "Fruit item not found");
    }

    const status = computeInventoryStatus({
      quantity,
      lowStockThreshold,
      expiryDate,
      inboundDate
    });

    const updated = await prisma.fruitItem.update({
      where: { id },
      data: {
        name,
        brand,
        category,
        batchNo,
        origin,
        packageType,
        variety,
        storageTemp,
        foodLicense,
        mainImage,
        detailImages: detailImages === null ? Prisma.JsonNull : detailImages,
        detailContent,
        quantity,
        unit,
        unitSpec,
        netWeight,
        price,
        warehouseLocation,
        inboundDate,
        expiryDate,
        lowStockThreshold,
        status
      }
    });

    return ok(serializeFruitItem(updated));
  } catch (error) {
    return fail(error);
  }
}
