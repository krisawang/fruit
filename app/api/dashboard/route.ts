import { InventoryStatus, MovementType } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { ok, fail } from "@/lib/api";
import { addDays, endOfToday, startOfToday, toNumber } from "@/lib/inventory";
import { requireApiUser } from "@/lib/session";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await requireApiUser("dashboard");

    const todayStart = startOfToday();
    const todayEnd = endOfToday();
    const expiringDate = addDays(new Date(), 7);

    const [inventorySum, inboundToday, outboundToday, lossToday, expiringCount, lowStockCount] = await Promise.all([
      prisma.fruitItem.aggregate({ _sum: { quantity: true } }),
      prisma.stockMovement.aggregate({
        where: { type: MovementType.INBOUND, occurredAt: { gte: todayStart, lt: todayEnd } },
        _sum: { quantity: true }
      }),
      prisma.stockMovement.aggregate({
        where: { type: MovementType.OUTBOUND, occurredAt: { gte: todayStart, lt: todayEnd } },
        _sum: { quantity: true }
      }),
      prisma.lossRecord.aggregate({
        where: { occurredAt: { gte: todayStart, lt: todayEnd } },
        _sum: { quantity: true }
      }),
      prisma.fruitItem.count({ where: { expiryDate: { lte: expiringDate }, quantity: { gt: 0 } } }),
      prisma.fruitItem.count({ where: { status: { in: [InventoryStatus.LOW_STOCK, InventoryStatus.OUT_OF_STOCK] } } })
    ]);

    return ok({
      totalInventory: toNumber(inventorySum._sum.quantity),
      todayInbound: toNumber(inboundToday._sum.quantity),
      todayOutbound: toNumber(outboundToday._sum.quantity),
      expiringSoon: expiringCount,
      lowStock: lowStockCount,
      todayLoss: toNumber(lossToday._sum.quantity)
    });
  } catch (error) {
    return fail(error);
  }
}
