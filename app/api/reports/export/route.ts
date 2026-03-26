import { MovementType } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { toNumber } from "@/lib/inventory";
import { requireApiUser } from "@/lib/session";

export const dynamic = "force-dynamic";

function formatDate(value: Date) {
  return value.toISOString().slice(0, 10);
}

function formatMonth(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function escapeCell(value: unknown) {
  return String(value ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function buildWorkbook(title: string, columns: string[], rows: Array<Array<string | number>>) {
  const header = columns.map((column) => `<th style="background:#e2e8f0;border:1px solid #cbd5e1;padding:8px;text-align:left;">${escapeCell(column)}</th>`).join("");
  const body = rows
    .map((row) => `<tr>${row.map((cell) => `<td style="border:1px solid #cbd5e1;padding:8px;">${escapeCell(cell)}</td>`).join("")}</tr>`)
    .join("");

  return `<!DOCTYPE html><html><head><meta charset="utf-8" /><title>${escapeCell(title)}</title></head><body><table>${`<caption style="caption-side:top;text-align:left;font-size:20px;font-weight:700;padding:0 0 12px;">${escapeCell(title)}</caption>`}<thead><tr>${header}</tr></thead><tbody>${body}</tbody></table></body></html>`;
}

export async function GET(request: Request) {
  try {
    await requireApiUser("reports");
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type") || "daily-inventory";

    if (type === "daily-inventory") {
      const items = await prisma.fruitItem.findMany({ orderBy: [{ quantity: "desc" }, { updatedAt: "desc" }] });
      const rows = items.map((item) => {
        const quantity = toNumber(item.quantity);
        const price = item.price == null ? "-" : toNumber(item.price).toFixed(2);
        const inventoryValue = item.price == null ? "-" : (quantity * toNumber(item.price)).toFixed(2);
        return [item.name, item.brand || "-", item.origin, item.batchNo, quantity.toFixed(2), item.unit, item.netWeight == null ? "-" : toNumber(item.netWeight).toFixed(2), price, inventoryValue, item.status, formatDate(item.updatedAt)];
      });
      const workbook = buildWorkbook("日库存报表", ["商品", "品牌", "产地", "批次", "库存", "单位", "净重", "价格", "库存金额", "状态", "更新时间"], rows);
      return new Response(`\uFEFF${workbook}`, {
        headers: {
          "Content-Type": "application/vnd.ms-excel; charset=utf-8",
          "Content-Disposition": `attachment; filename*=UTF-8''${encodeURIComponent("日库存报表.xls")}`
        }
      });
    }

    const start = new Date();
    start.setDate(1);
    start.setMonth(start.getMonth() - 5);
    start.setHours(0, 0, 0, 0);
    const [movements, losses] = await Promise.all([
      prisma.stockMovement.findMany({ where: { occurredAt: { gte: start } }, select: { type: true, quantity: true, occurredAt: true } }),
      prisma.lossRecord.findMany({ where: { occurredAt: { gte: start } }, select: { quantity: true, occurredAt: true } })
    ]);

    const monthly = new Map<string, { inbound: number; outbound: number; loss: number }>();
    for (let index = 0; index < 6; index += 1) {
      const date = new Date(start);
      date.setMonth(start.getMonth() + index);
      monthly.set(formatMonth(date), { inbound: 0, outbound: 0, loss: 0 });
    }

    for (const item of movements) {
      const bucket = monthly.get(formatMonth(item.occurredAt));
      if (!bucket) continue;
      if (item.type === MovementType.INBOUND) bucket.inbound += toNumber(item.quantity);
      if (item.type === MovementType.OUTBOUND) bucket.outbound += toNumber(item.quantity);
    }

    for (const item of losses) {
      const bucket = monthly.get(formatMonth(item.occurredAt));
      if (!bucket) continue;
      bucket.loss += toNumber(item.quantity);
    }

    const rows = Array.from(monthly.entries()).map(([month, value]) => [month, value.inbound.toFixed(2), value.outbound.toFixed(2), value.loss.toFixed(2), (value.inbound - value.outbound - value.loss).toFixed(2)]);
    const workbook = buildWorkbook("月库存变化报表", ["月份", "入库", "出库", "损耗", "净变化"], rows);
    return new Response(`\uFEFF${workbook}`, {
      headers: {
        "Content-Type": "application/vnd.ms-excel; charset=utf-8",
        "Content-Disposition": `attachment; filename*=UTF-8''${encodeURIComponent("月库存变化报表.xls")}`
      }
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "导出失败";
    return new Response(message, { status: 500 });
  }
}