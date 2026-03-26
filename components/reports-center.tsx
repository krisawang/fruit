"use client";

import { useEffect, useMemo, useState } from "react";
import { DataTable, SectionCard, StatCard } from "@/components/ui-shell";

type ReportItem = {
  id: string;
  name: string;
  brand: string | null;
  batchNo: string;
  origin: string;
  quantity: number;
  unit: string;
  price: number | null;
  inventoryValue: number | null;
  expiryDate: string;
  status: string;
};

type MonthlyChange = {
  month: string;
  inbound: number;
  outbound: number;
  loss: number;
  netChange: number;
};

type SummaryResponse = {
  periodDays: number;
  inboundTotal: number;
  outboundTotal: number;
  lossTotal: number;
  inboundCount: number;
  outboundCount: number;
  lossCount: number;
  dailyInventory: ReportItem[];
  monthlyChanges: MonthlyChange[];
  expiringItems: Array<{ id: string; name: string; batchNo: string; expiryDate: string; quantity: number; unit: string }>;
  lowStockItems: Array<{ id: string; name: string; batchNo: string; quantity: number; unit: string; status: string }>;
};

type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
};

const currencyFormatter = new Intl.NumberFormat("zh-CN", { style: "currency", currency: "CNY" });

function formatDate(value: string) {
  return value.slice(0, 10);
}

export function ReportsCenter() {
  const [periodDays, setPeriodDays] = useState("30");
  const [data, setData] = useState<SummaryResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function loadReports(days = periodDays) {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/reports/summary?periodDays=${encodeURIComponent(days)}`, { credentials: "include", cache: "no-store" });
      const payload = (await response.json()) as ApiResponse<SummaryResponse>;
      if (!response.ok || !payload.success || !payload.data) {
        throw new Error(payload.error || "\u62a5\u8868\u6570\u636e\u52a0\u8f7d\u5931\u8d25");
      }
      setData(payload.data);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "\u62a5\u8868\u6570\u636e\u52a0\u8f7d\u5931\u8d25");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadReports(periodDays);
  }, []);

  const inventoryRows = useMemo(
    () =>
      (data?.dailyInventory || []).map((item) => [
        item.name,
        item.brand || "-",
        item.origin,
        item.batchNo,
        `${item.quantity} ${item.unit}`,
        item.price == null ? "-" : currencyFormatter.format(item.price),
        item.inventoryValue == null ? "-" : currencyFormatter.format(item.inventoryValue),
        formatDate(item.expiryDate),
        item.status
      ]),
    [data]
  );

  const monthlyRows = useMemo(
    () =>
      (data?.monthlyChanges || []).map((item) => [item.month, `${item.inbound} kg`, `${item.outbound} kg`, `${item.loss} kg`, `${item.netChange} kg`]),
    [data]
  );

  return (
    <div className="space-y-6">
      <SectionCard
        title={"\u62a5\u8868\u7b5b\u9009\u4e0e\u5bfc\u51fa"}
        extra={
          <div className="flex flex-wrap items-center gap-3">
            <select value={periodDays} onChange={(event) => setPeriodDays(event.target.value)} className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400">
              <option value="7">{"\u8fd1 7 \u5929"}</option>
              <option value="30">{"\u8fd1 30 \u5929"}</option>
              <option value="90">{"\u8fd1 90 \u5929"}</option>
            </select>
            <button type="button" onClick={() => void loadReports(periodDays)} className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50">{"\u5237\u65b0\u62a5\u8868"}</button>
            <a href="/api/reports/export?type=daily-inventory" className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800">{"\u5bfc\u51fa\u65e5\u5e93\u5b58 Excel"}</a>
            <a href="/api/reports/export?type=monthly-change" className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">{"\u5bfc\u51fa\u6708\u5e93\u5b58\u53d8\u5316 Excel"}</a>
          </div>
        }
      >
        <p className="text-sm text-slate-500">{"\u5bfc\u51fa\u7684\u6587\u4ef6\u4e3a Excel \u53ef\u76f4\u63a5\u6253\u5f00\u7684\u8868\u683c\uff0c\u9002\u5408\u8fd0\u8425\u7559\u6863\u548c\u4e8c\u6b21\u5206\u6790\u3002"}</p>
      </SectionCard>

      {error ? <p className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-600">{error}</p> : null}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label={"\u5468\u671f\u5185\u5165\u5e93"} value={`${data?.inboundTotal ?? 0} kg`} hint={`\u5165\u5e93\u7b14\u6570\uff1a${data?.inboundCount ?? 0}`} />
        <StatCard label={"\u5468\u671f\u5185\u51fa\u5e93"} value={`${data?.outboundTotal ?? 0} kg`} hint={`\u51fa\u5e93\u7b14\u6570\uff1a${data?.outboundCount ?? 0}`} />
        <StatCard label={"\u5468\u671f\u5185\u635f\u8017"} value={`${data?.lossTotal ?? 0} kg`} hint={`\u635f\u8017\u7b14\u6570\uff1a${data?.lossCount ?? 0}`} />
        <StatCard label={"\u5728\u5e93\u5546\u54c1\u6570"} value={`${data?.dailyInventory.length ?? 0} \u9879`} hint={"\u6309\u5f53\u524d\u5e93\u5b58\u6e05\u5355\u7edf\u8ba1"} />
      </div>

      <SectionCard title={"\u65e5\u5e93\u5b58\u62a5\u8868"}>
        {loading ? <div className="rounded-xl border border-dashed border-slate-200 px-6 py-12 text-center text-sm text-slate-500">{"\u62a5\u8868\u52a0\u8f7d\u4e2d..."}</div> : <DataTable columns={["\u5546\u54c1", "\u54c1\u724c", "\u4ea7\u5730", "\u6279\u6b21", "\u5e93\u5b58", "\u4ef7\u683c", "\u5e93\u5b58\u91d1\u989d", "\u4fdd\u8d28\u671f", "\u72b6\u6001"]} rows={inventoryRows} />}
      </SectionCard>

      <SectionCard title={"\u6708\u5e93\u5b58\u53d8\u5316\u62a5\u8868"}>
        {loading ? <div className="rounded-xl border border-dashed border-slate-200 px-6 py-12 text-center text-sm text-slate-500">{"\u62a5\u8868\u52a0\u8f7d\u4e2d..."}</div> : <DataTable columns={["\u6708\u4efd", "\u5165\u5e93", "\u51fa\u5e93", "\u635f\u8017", "\u51c0\u53d8\u5316"]} rows={monthlyRows} />}
      </SectionCard>

      <div className="grid gap-6 xl:grid-cols-2">
        <SectionCard title={"\u4e34\u671f\u6279\u6b21"}>
          {loading ? <div className="rounded-xl border border-dashed border-slate-200 px-6 py-10 text-center text-sm text-slate-500">{"\u62a5\u8868\u52a0\u8f7d\u4e2d..."}</div> : <DataTable columns={["\u5546\u54c1", "\u6279\u6b21", "\u5e93\u5b58", "\u4fdd\u8d28\u671f"]} rows={(data?.expiringItems || []).map((item) => [item.name, item.batchNo, `${item.quantity} ${item.unit}`, formatDate(item.expiryDate)])} />}
        </SectionCard>
        <SectionCard title={"\u4f4e\u5e93\u5b58\u9884\u8b66"}>
          {loading ? <div className="rounded-xl border border-dashed border-slate-200 px-6 py-10 text-center text-sm text-slate-500">{"\u62a5\u8868\u52a0\u8f7d\u4e2d..."}</div> : <DataTable columns={["\u5546\u54c1", "\u6279\u6b21", "\u5e93\u5b58", "\u72b6\u6001"]} rows={(data?.lowStockItems || []).map((item) => [item.name, item.batchNo, `${item.quantity} ${item.unit}`, item.status])} />}
        </SectionCard>
      </div>
    </div>
  );
}