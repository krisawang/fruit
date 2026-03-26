import { MovementType } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { ok, fail } from "@/lib/api";
import { addDays, serializeFruitItem, toNumber } from "@/lib/inventory";
import { requireApiUser } from "@/lib/session";

export const dynamic = "force-dynamic";

type MonthlyBucket = {
  month: string;
  inbound: number;
  outbound: number;
  loss: number;
};

function formatMonthKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

export async function GET(request: Request) {
  try {
    await requireApiUser("reports");

    const { searchParams } = new URL(request.url);
    const periodDays = Math.max(1, Number(searchParams.get("periodDays") || "30"));
    const fromDate = addDays(new Date(), -periodDays);
    const expiringDate = addDays(new Date(), 7);
    const monthlyStart = new Date();
    monthlyStart.setDate(1);
    monthlyStart.setMonth(monthlyStart.getMonth() - 5);
    monthlyStart.setHours(0, 0, 0, 0);

    const [inbound, outbound, loss, expiringItems, lowStockItems, dailyInventoryItems, stockMovements, lossRecords] = await Promise.all([
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
      }),
      prisma.fruitItem.findMany({
        orderBy: [{ quantity: "desc" }, { updatedAt: "desc" }]
      }),
      prisma.stockMovement.findMany({
        where: { occurredAt: { gte: monthlyStart } },
        select: { type: true, quantity: true, occurredAt: true }
      }),
      prisma.lossRecord.findMany({
        where: { occurredAt: { gte: monthlyStart } },
        select: { quantity: true, occurredAt: true }
      })
    ]);

    const monthlyMap = new Map<string, MonthlyBucket>();
    for (let index = 0; index < 6; index += 1) {
      const date = new Date(monthlyStart);
      date.setMonth(monthlyStart.getMonth() + index);
      const month = formatMonthKey(date);
      monthlyMap.set(month, { month, inbound: 0, outbound: 0, loss: 0 });
    }

    for (const record of stockMovements) {
      const month = formatMonthKey(record.occurredAt);
      const bucket = monthlyMap.get(month);
      if (!bucket) continue;
      if (record.type === MovementType.INBOUND) bucket.inbound += toNumber(record.quantity);
      if (record.type === MovementType.OUTBOUND) bucket.outbound += toNumber(record.quantity);
    }

    for (const record of lossRecords) {
      const month = formatMonthKey(record.occurredAt);
      const bucket = monthlyMap.get(month);
      if (!bucket) continue;
      bucket.loss += toNumber(record.quantity);
    }

    const dailyInventory = dailyInventoryItems.map((item) => {
      const serialized = serializeFruitItem(item);
      const inventoryValue = serialized.price == null ? null : Number((serialized.quantity * serialized.price).toFixed(2));
      return {
        ...serialized,
        inventoryValue
      };
    });

    const monthlyChanges = Array.from(monthlyMap.values()).map((item) => ({
      ...item,
      netChange: Number((item.inbound - item.outbound - item.loss).toFixed(2))
    }));

    return ok({
      periodDays,
      inboundTotal: toNumber(inbound._sum.quantity),
      outboundTotal: toNumber(outbound._sum.quantity),
      lossTotal: toNumber(loss._sum.quantity),
      inboundCount: inbound._count.id,
      outboundCount: outbound._count.id,
      lossCount: loss._count.id,
      expiringItems: expiringItems.map(serializeFruitItem),
      lowStockItems: lowStockItems.map(serializeFruitItem),
      dailyInventory,
      monthlyChanges
    });
  } catch (error) {
    return fail(error);
  }
}