import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { ok, fail } from "@/lib/api";
import { computeInventoryStatus, serializeFruitItem, toNumber } from "@/lib/inventory";
import { requireApiUser } from "@/lib/session";
import {
  ApiError,
  assertDate,
  assertOptionalDate,
  assertOptionalEnumValue,
  assertOptionalNumber,
  assertOptionalString,
  assertOptionalStringArray,
  assertPositiveNumber,
  assertString
} from "@/lib/validation";

const packageTypeValues = ["BULK", "PACKAGED"] as const;

export async function POST(request: Request) {
  try {
    const session = await requireApiUser("inbound");
    const body = await request.json();
    const hasField = (field: string) => Object.prototype.hasOwnProperty.call(body, field);

    const batchNo = assertString(body.batchNo, "batchNo");
    const name = assertString(body.name, "name");
    const category = assertString(body.category, "category");
    const origin = assertString(body.origin, "origin");
    const unit = assertString(body.unit, "unit");
    const warehouseLocation = assertString(body.warehouseLocation, "warehouseLocation");
    const quantity = assertPositiveNumber(body.quantity, "quantity");
    const inboundDate = assertDate(body.inboundDate, "inboundDate");
    const expiryDate = assertDate(body.expiryDate, "expiryDate");
    const lowStockThreshold = body.lowStockThreshold == null ? 100 : assertPositiveNumber(body.lowStockThreshold, "lowStockThreshold");
    const occurredAt = assertOptionalDate(body.occurredAt) ?? new Date();
    const note = assertOptionalString(body.note);

    const brand = assertOptionalString(body.brand);
    const packageType = assertOptionalEnumValue(body.packageType, "packageType", packageTypeValues);
    const variety = assertOptionalString(body.variety);
    const storageTemp = assertOptionalString(body.storageTemp);
    const foodLicense = assertOptionalString(body.foodLicense);
    const mainImage = assertOptionalString(body.mainImage);
    const detailImages = assertOptionalStringArray(body.detailImages, "detailImages");
    const detailImagesInput = detailImages === null ? Prisma.JsonNull : detailImages;
    const detailContent = assertOptionalString(body.detailContent);
    const unitSpec = assertOptionalString(body.unitSpec);
    const netWeight = assertOptionalNumber(body.netWeight, "netWeight");
    const price = assertOptionalNumber(body.price, "price");

    if (expiryDate <= inboundDate) {
      throw new ApiError(400, "expiryDate must be later than inboundDate");
    }

    const result = await prisma.$transaction(async (tx) => {
      const existing = await tx.fruitItem.findUnique({ where: { batchNo } });
      const nextQuantity = (existing ? toNumber(existing.quantity) : 0) + quantity;
      const nextStatus = computeInventoryStatus({
        quantity: nextQuantity,
        lowStockThreshold: existing ? toNumber(existing.lowStockThreshold) : lowStockThreshold,
        expiryDate,
        inboundDate
      });

      const optionalUpdateData = {
        ...(hasField("brand") ? { brand } : {}),
        ...(hasField("packageType") ? { packageType: packageType ?? "BULK" } : {}),
        ...(hasField("variety") ? { variety } : {}),
        ...(hasField("storageTemp") ? { storageTemp } : {}),
        ...(hasField("foodLicense") ? { foodLicense } : {}),
        ...(hasField("mainImage") ? { mainImage } : {}),
        ...(hasField("detailImages") ? { detailImages: detailImagesInput } : {}),
        ...(hasField("detailContent") ? { detailContent } : {}),
        ...(hasField("unitSpec") ? { unitSpec } : {}),
        ...(hasField("netWeight") ? { netWeight } : {}),
        ...(hasField("price") ? { price } : {})
      };

      const fruitItem = existing
        ? await tx.fruitItem.update({
            where: { id: existing.id },
            data: {
              name,
              category,
              origin,
              unit,
              warehouseLocation,
              inboundDate,
              expiryDate,
              quantity: nextQuantity,
              lowStockThreshold,
              status: nextStatus,
              ...optionalUpdateData
            }
          })
        : await tx.fruitItem.create({
            data: {
              name,
              brand,
              category,
              batchNo,
              origin,
              packageType: packageType ?? "BULK",
              variety,
              storageTemp,
              foodLicense,
              mainImage,
              detailImages: detailImagesInput,
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
              status: nextStatus
            }
          });

      await tx.stockMovement.create({
        data: {
          fruitItemId: fruitItem.id,
          userId: session.id,
          type: "INBOUND",
          quantity,
          note,
          occurredAt
        }
      });

      return fruitItem;
    });

    return ok(serializeFruitItem(result), { status: 201 });
  } catch (error) {
    return fail(error);
  }
}
