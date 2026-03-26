import { MovementType } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { ok, fail } from "@/lib/api";
import { addDays, serializeFruitItem, toNumber } from "@/lib/inventory";
import { getSessionUser } from "@/lib/session";
import { ApiError } from "@/lib/validation";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const session = await getSessionUser();
    if (!session) {
      throw new ApiError(401, "Unauthorized");
    }

    const { searchParams } = new URL(request.url);
    const periodDays = Math.max(1, Number(searchParams.get("periodDays") || "30"));
    const fromDate = addDays(new Date(), -periodDays);
    const expiringDate = addDays(new Date(), 7);

    const [inbound, outbound, loss, expiringItems, lowStockItems] = await Promise.all([
      prisma.stockMovement.aggregate({
        where: { type: MovementType.INBOUND, occurredAt: { gte: fromDate } },
        _sum: { quantity: true },
        _count: { id: true }
      }),
      prisma.stockMovement.aggregate({
        where: { type: MovementType.OUTBOUND, occurredAt: { gte: fromDate } },
        _sum: { quantity: true },
        _count: { id: true }
      }),
      prisma.lossRecord.aggregate({
        where: { occurredAt: { gte: fromDate } },
        _sum: { quantity: true },
        _count: { id: true }
      }),
      prisma.fruitItem.findMany({
        where: { expiryDate: { lte: expiringDate }, quantity: { gt: 0 } },
        orderBy: { expiryDate: "asc" },
        take: 10
      }),
      prisma.fruitItem.findMany({
        where: { status: { in: ["LOW_STOCK", "OUT_OF_STOCK"] } },
        orderBy: [{ quantity: "asc" }, { updatedAt: "desc" }],
        take: 10
      })
    ]);

    return ok({
      periodDays,
      inboundTotal: toNumber(inbound._sum.quantity),
      outboundTotal: toNumber(outbound._sum.quantity),
      lossTotal: toNumber(loss._sum.quantity),
      inboundCount: inbound._count.id,
      outboundCount: outbound._count.id,
      lossCount: loss._count.id,
      expiringItems: expiringItems.map(serializeFruitItem),
      lowStockItems: lowStockItems.map(serializeFruitItem)
    });
  } catch (error) {
    return fail(error);
  }
}