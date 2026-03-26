import { prisma } from "@/lib/prisma";
import { ok, fail } from "@/lib/api";
import { computeInventoryStatus, serializeFruitItem, toNumber } from "@/lib/inventory";
import { getSessionUser } from "@/lib/session";
import { ApiError, assertOptionalDate, assertOptionalString, assertPositiveNumber, assertString } from "@/lib/validation";

export async function POST(request: Request) {
  try {
    const session = await getSessionUser();
    if (!session) {
      throw new ApiError(401, "Unauthorized");
    }

    const body = await request.json();
    const batchNo = assertString(body.batchNo, "batchNo");
    const quantity = assertPositiveNumber(body.quantity, "quantity");
    const occurredAt = assertOptionalDate(body.occurredAt) ?? new Date();
    const note = assertOptionalString(body.note);

    const result = await prisma.$transaction(async (tx) => {
      const fruitItem = await tx.fruitItem.findUnique({ where: { batchNo } });
      if (!fruitItem) {
        throw new ApiError(404, "Fruit item not found");
      }

      const currentQuantity = toNumber(fruitItem.quantity);
      if (currentQuantity < quantity) {
        throw new ApiError(400, "Insufficient inventory for outbound");
      }

      const nextQuantity = currentQuantity - quantity;
      const nextStatus = computeInventoryStatus({
        quantity: nextQuantity,
        lowStockThreshold: toNumber(fruitItem.lowStockThreshold),
        expiryDate: fruitItem.expiryDate,
        inboundDate: fruitItem.inboundDate
      });

      const updated = await tx.fruitItem.update({
        where: { id: fruitItem.id },
        data: {
          quantity: nextQuantity,
          status: nextStatus
        }
      });

      await tx.stockMovement.create({
        data: {
          fruitItemId: fruitItem.id,
          userId: session.userId,
          type: "OUTBOUND",
          quantity,
          note,
          occurredAt
        }
      });

      return updated;
    });

    return ok(serializeFruitItem(result));
  } catch (error) {
    return fail(error);
  }
}