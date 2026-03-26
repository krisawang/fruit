"use client";

import { FormEvent, ReactNode, useEffect, useMemo, useState } from "react";
import { DataTable, SectionCard } from "@/components/admin-shell";

type InventoryItem = {
  id: string;
  name: string;
  brand: string | null;
  category: string;
  batchNo: string;
  origin: string;
  packageType: "BULK" | "PACKAGED";
  packageTypeLabel: string;
  variety: string | null;
  storageTemp: string | null;
  foodLicense: string | null;
  mainImage: string | null;
  detailImages: string[];
  detailContent: string | null;
  quantity: number;
  unit: string;
  unitSpec: string | null;
  netWeight: number | null;
  price: number | null;
  warehouseLocation: string;
  inboundDate: string;
  expiryDate: string;
  lowStockThreshold: number;
  status: string;
  createdAt: string;
  updatedAt: string;
};

type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
};

type FormState = {
  id?: string;
  batchNo: string;
  name: string;
  brand: string;
  category: string;
  packageType: "BULK" | "PACKAGED";
  origin: string;
  variety: string;
  storageTemp: string;
  foodLicense: string;
  mainImage: string;
  detailImagesText: string;
  detailContent: string;
  unit: string;
  unitSpec: string;
  netWeight: string;
  price: string;
  quantity: string;
  warehouseLocation: string;
  inboundDate: string;
  expiryDate: string;
  lowStockThreshold: string;
};

const currencyFormatter = new Intl.NumberFormat("zh-CN", {
  style: "currency",
  currency: "CNY"
});

function formatDate(value: string) {
  return value.slice(0, 10);
}

function addDays(value: Date, days: number) {
  const next = new Date(value);
  next.setDate(next.getDate() + days);
  return next;
}

function formatDateInput(value: Date) {
  return value.toISOString().slice(0, 10);
}

function createInitialFormState(): FormState {
  const today = new Date();
  const expiryDate = addDays(today, 7);

  return {
    batchNo: "",
    name: "",
    brand: "",
    category: "",
    packageType: "BULK",
    origin: "",
    variety: "",
    storageTemp: "",
    foodLicense: "",
    mainImage: "",
    detailImagesText: "",
    detailContent: "",
    unit: "kg",
    unitSpec: "",
    netWeight: "",
    price: "",
    quantity: "",
    warehouseLocation: "",
    inboundDate: formatDateInput(today),
    expiryDate: formatDateInput(expiryDate),
    lowStockThreshold: "100"
  };
}

function normalizeDetailImagesInput(value: string) {
  return value
    .split(/\r?\n|,|，/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function normalizeDetailImages(value: unknown) {
  if (Array.isArray(value)) {
    return value.filter((item): item is string => typeof item === "string" && item.trim().length > 0);
  }

  if (typeof value === "string") {
    return normalizeDetailImagesInput(value);
  }

  return [];
}

function normalizeOptionalString(value: unknown) {
  return typeof value === "string" && value.trim() !== "" ? value : null;
}

function normalizeOptionalNumber(value: unknown) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }

  return null;
}

function fallbackText(value: string | number | null | undefined, empty = "-") {
  if (value == null || value === "") {
    return empty;
  }

  return String(value);
}

function parseInventoryItem(raw: unknown): InventoryItem {
  const item = raw as Partial<InventoryItem> & Record<string, unknown>;

  return {
    id: typeof item.id === "string" ? item.id : "",
    name: typeof item.name === "string" ? item.name : "",
    brand: normalizeOptionalString(item.brand),
    category: typeof item.category === "string" ? item.category : "",
    batchNo: typeof item.batchNo === "string" ? item.batchNo : "",
    origin: typeof item.origin === "string" ? item.origin : "",
    packageType: item.packageType === "PACKAGED" ? "PACKAGED" : "BULK",
    packageTypeLabel: typeof item.packageTypeLabel === "string" ? item.packageTypeLabel : item.packageType === "PACKAGED" ? "包装" : "散装",
    variety: normalizeOptionalString(item.variety),
    storageTemp: normalizeOptionalString(item.storageTemp),
    foodLicense: normalizeOptionalString(item.foodLicense),
    mainImage: normalizeOptionalString(item.mainImage),
    detailImages: normalizeDetailImages(item.detailImages),
    detailContent: normalizeOptionalString(item.detailContent),
    quantity: normalizeOptionalNumber(item.quantity) ?? 0,
    unit: typeof item.unit === "string" ? item.unit : "kg",
    unitSpec: normalizeOptionalString(item.unitSpec),
    netWeight: normalizeOptionalNumber(item.netWeight),
    price: normalizeOptionalNumber(item.price),
    warehouseLocation: typeof item.warehouseLocation === "string" ? item.warehouseLocation : "",
    inboundDate: typeof item.inboundDate === "string" ? item.inboundDate : "",
    expiryDate: typeof item.expiryDate === "string" ? item.expiryDate : "",
    lowStockThreshold: normalizeOptionalNumber(item.lowStockThreshold) ?? 0,
    status: typeof item.status === "string" ? item.status : "",
    createdAt: typeof item.createdAt === "string" ? item.createdAt : "",
    updatedAt: typeof item.updatedAt === "string" ? item.updatedAt : ""
  };
}

function toFormState(item: InventoryItem): FormState {
  return {
    id: item.id,
    batchNo: item.batchNo,
    name: item.name,
    brand: item.brand ?? "",
    category: item.category,
    packageType: item.packageType,
    origin: item.origin,
    variety: item.variety ?? "",
    storageTemp: item.storageTemp ?? "",
    foodLicense: item.foodLicense ?? "",
    mainImage: item.mainImage ?? "",
    detailImagesText: item.detailImages.join("\n"),
    detailContent: item.detailContent ?? "",
    unit: item.unit,
    unitSpec: item.unitSpec ?? "",
    netWeight: item.netWeight == null ? "" : String(item.netWeight),
    price: item.price == null ? "" : String(item.price),
    quantity: String(item.quantity),
    warehouseLocation: item.warehouseLocation,
    inboundDate: formatDate(item.inboundDate),
    expiryDate: formatDate(item.expiryDate),
    lowStockThreshold: String(item.lowStockThreshold)
  };
}

function FieldLabel({ label, required = false }: { label: string; required?: boolean }) {
  return (
    <span className="mb-2 block text-sm font-medium text-slate-700">
      {label}
      {required ? <span className="ml-1 text-rose-500">*</span> : null}
    </span>
  );
}

function DetailRow({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
      <div className="text-xs font-medium uppercase tracking-[0.16em] text-slate-400">{label}</div>
      <div className="mt-2 text-sm text-slate-700">{value}</div>
    </div>
  );
}

export function InventoryManagement() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [keyword, setKeyword] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formState, setFormState] = useState<FormState>(() => createInitialFormState());

  async function loadItems(search = "") {
    setLoading(true);
    setError(null);

    try {
      const query = search ? `?search=${encodeURIComponent(search)}` : "";
      const response = await fetch(`/api/inventory${query}`, {
        credentials: "include",
        cache: "no-store"
      });
      const payload = (await response.json()) as ApiResponse<unknown[]>;

      if (!response.ok || !payload.success || !payload.data) {
        throw new Error(payload.error || "加载商品列表失败");
      }

      setItems(payload.data.map(parseInventoryItem));
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "加载商品列表失败");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadItems();
  }, []);

  const previewImages = useMemo(() => normalizeDetailImagesInput(formState.detailImagesText), [formState.detailImagesText]);

  const rows = useMemo(
    () =>
      items.map((item) => [
        item.mainImage ? (
          <img
            src={item.mainImage}
            alt={item.name}
            className="h-14 w-14 rounded-xl border border-slate-200 object-cover"
          />
        ) : (
          <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 text-xs text-slate-400">
            无主图
          </div>
        ),
        <div>
          <div className="font-medium text-slate-900">{fallbackText(item.name)}</div>
          <div className="text-xs text-slate-500">{fallbackText(item.category)}</div>
        </div>,
        fallbackText(item.brand),
        fallbackText(item.packageTypeLabel),
        fallbackText(item.origin),
        fallbackText(item.variety),
        `${item.quantity} ${item.unit}`,
        item.netWeight == null ? "-" : `${item.netWeight}`,
        item.price == null ? "-" : currencyFormatter.format(item.price),
        fallbackText(item.batchNo),
        fallbackText(formatDate(item.inboundDate)),
        fallbackText(formatDate(item.expiryDate)),
        fallbackText(item.status),
        <button
          type="button"
          onClick={() => {
            setFormState(toFormState(item));
            setMessage(null);
            setError(null);
            setIsModalOpen(true);
          }}
          className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
        >
          编辑
        </button>
      ]),
    [items]
  );

  function openCreateModal() {
    setFormState(createInitialFormState());
    setMessage(null);
    setError(null);
    setIsModalOpen(true);
  }

  async function handleSearchSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await loadItems(keyword.trim());
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError(null);
    setMessage(null);

    const detailImages = normalizeDetailImagesInput(formState.detailImagesText);
    const quantity = Number(formState.quantity);
    const lowStockThreshold = Number(formState.lowStockThreshold);
    const isEditing = Boolean(formState.id);

    if (!isEditing && quantity <= 0) {
      setSaving(false);
      setError("新增商品时库存数量必须大于 0");
      return;
    }

    const payload = {
      ...(formState.id ? { id: formState.id } : {}),
      batchNo: formState.batchNo,
      name: formState.name,
      brand: formState.brand || null,
      category: formState.category,
      packageType: formState.packageType,
      origin: formState.origin,
      variety: formState.variety || null,
      storageTemp: formState.storageTemp || null,
      foodLicense: formState.foodLicense || null,
      mainImage: formState.mainImage || null,
      detailImages,
      detailContent: formState.detailContent || null,
      unit: formState.unit,
      unitSpec: formState.unitSpec || null,
      netWeight: formState.netWeight === "" ? null : Number(formState.netWeight),
      price: formState.price === "" ? null : Number(formState.price),
      quantity,
      warehouseLocation: formState.warehouseLocation,
      inboundDate: formState.inboundDate,
      expiryDate: formState.expiryDate,
      lowStockThreshold
    };

    try {
      const response = await fetch(isEditing ? "/api/inventory" : "/api/inbound", {
        method: isEditing ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify(payload)
      });
      const result = (await response.json()) as ApiResponse<unknown>;

      if (!response.ok || !result.success) {
        throw new Error(result.error || (isEditing ? "商品编辑失败" : "商品新增失败"));
      }

      setMessage(isEditing ? "商品信息已更新" : "商品已新增入库");
      setIsModalOpen(false);
      setFormState(createInitialFormState());
      await loadItems(keyword.trim());
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "提交失败");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <SectionCard
        title="商品列表"
        extra={
          <div className="flex items-center gap-3">
            <form className="flex items-center gap-2" onSubmit={handleSearchSubmit}>
              <input
                value={keyword}
                onChange={(event) => setKeyword(event.target.value)}
                className="w-56 rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none placeholder:text-slate-400 focus:border-slate-400"
                placeholder="搜索商品/品牌/批次/产地"
              />
              <button type="submit" className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50">
                查询
              </button>
            </form>
            <button
              type="button"
              onClick={openCreateModal}
              className="rounded-xl bg-brand px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-dark"
            >
              新增商品
            </button>
          </div>
        }
      >
        {message ? <p className="mb-4 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{message}</p> : null}
        {error ? <p className="mb-4 rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-600">{error}</p> : null}
        {loading ? (
          <div className="rounded-xl border border-dashed border-slate-200 px-6 py-12 text-center text-sm text-slate-500">商品数据加载中...</div>
        ) : (
          <DataTable
            columns={[
              "主图",
              "商品",
              "品牌",
              "包装方式",
              "产地",
              "品种",
              "库存",
              "净重",
              "价格",
              "批次",
              "入库日期",
              "到期日期",
              "状态",
              "操作"
            ]}
            rows={rows}
          />
        )}
      </SectionCard>

      {isModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-slate-950/40 px-4 py-10">
          <div className="max-h-[90vh] w-full max-w-6xl overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">{formState.id ? "编辑商品" : "新增商品"}</h3>
                <p className="mt-1 text-sm text-slate-500">商品图片暂时使用 URL 输入，提交字段与后端接口保持一致。</p>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-600 transition hover:bg-slate-50"
              >
                关闭
              </button>
            </div>
            <form className="space-y-6 px-6 py-6" onSubmit={handleSubmit}>
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                <label className="block">
                  <FieldLabel label="商品名称" required />
                  <input value={formState.name} onChange={(event) => setFormState((current) => ({ ...current, name: event.target.value }))} className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400" />
                </label>
                <label className="block">
                  <FieldLabel label="品牌" />
                  <input value={formState.brand} onChange={(event) => setFormState((current) => ({ ...current, brand: event.target.value }))} className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400" />
                </label>
                <label className="block">
                  <FieldLabel label="分类" required />
                  <input value={formState.category} onChange={(event) => setFormState((current) => ({ ...current, category: event.target.value }))} className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400" />
                </label>
                <label className="block">
                  <FieldLabel label="包装方式" required />
                  <select value={formState.packageType} onChange={(event) => setFormState((current) => ({ ...current, packageType: event.target.value as FormState["packageType"] }))} className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400">
                    <option value="BULK">散装</option>
                    <option value="PACKAGED">包装</option>
                  </select>
                </label>
                <label className="block">
                  <FieldLabel label="产地" required />
                  <input value={formState.origin} onChange={(event) => setFormState((current) => ({ ...current, origin: event.target.value }))} className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400" />
                </label>
                <label className="block">
                  <FieldLabel label="品种" />
                  <input value={formState.variety} onChange={(event) => setFormState((current) => ({ ...current, variety: event.target.value }))} className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400" />
                </label>
                <label className="block">
                  <FieldLabel label="批次号" required />
                  <input value={formState.batchNo} onChange={(event) => setFormState((current) => ({ ...current, batchNo: event.target.value }))} className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400" />
                </label>
                <label className="block">
                  <FieldLabel label="库存数量" required />
                  <input value={formState.quantity} onChange={(event) => setFormState((current) => ({ ...current, quantity: event.target.value }))} type="number" min="0" step="0.01" className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400" />
                </label>
                <label className="block">
                  <FieldLabel label="单位" required />
                  <input value={formState.unit} onChange={(event) => setFormState((current) => ({ ...current, unit: event.target.value }))} className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400" />
                </label>
                <label className="block">
                  <FieldLabel label="单果规格" />
                  <input value={formState.unitSpec} onChange={(event) => setFormState((current) => ({ ...current, unitSpec: event.target.value }))} className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400" />
                </label>
                <label className="block">
                  <FieldLabel label="净重" />
                  <input value={formState.netWeight} onChange={(event) => setFormState((current) => ({ ...current, netWeight: event.target.value }))} type="number" min="0" step="0.01" className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400" />
                </label>
                <label className="block">
                  <FieldLabel label="价格" />
                  <input value={formState.price} onChange={(event) => setFormState((current) => ({ ...current, price: event.target.value }))} type="number" min="0" step="0.01" className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400" />
                </label>
                <label className="block">
                  <FieldLabel label="仓位" required />
                  <input value={formState.warehouseLocation} onChange={(event) => setFormState((current) => ({ ...current, warehouseLocation: event.target.value }))} className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400" />
                </label>
                <label className="block">
                  <FieldLabel label="低库存阈值" required />
                  <input value={formState.lowStockThreshold} onChange={(event) => setFormState((current) => ({ ...current, lowStockThreshold: event.target.value }))} type="number" min="0" step="0.01" className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400" />
                </label>
                <label className="block">
                  <FieldLabel label="入库日期" required />
                  <input value={formState.inboundDate} onChange={(event) => setFormState((current) => ({ ...current, inboundDate: event.target.value }))} type="date" className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400" />
                </label>
                <label className="block">
                  <FieldLabel label="到期日期" required />
                  <input value={formState.expiryDate} onChange={(event) => setFormState((current) => ({ ...current, expiryDate: event.target.value }))} type="date" className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400" />
                </label>
                <label className="block">
                  <FieldLabel label="生鲜储存温度" />
                  <input value={formState.storageTemp} onChange={(event) => setFormState((current) => ({ ...current, storageTemp: event.target.value }))} className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400" placeholder="如 0-4C" />
                </label>
                <label className="block xl:col-span-2">
                  <FieldLabel label="食品生产许可证编号" />
                  <input value={formState.foodLicense} onChange={(event) => setFormState((current) => ({ ...current, foodLicense: event.target.value }))} className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400" />
                </label>
                <label className="block xl:col-span-3">
                  <FieldLabel label="主图 URL" />
                  <input value={formState.mainImage} onChange={(event) => setFormState((current) => ({ ...current, mainImage: event.target.value }))} className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400" placeholder="https://example.com/main.jpg" />
                </label>
                <label className="block xl:col-span-3">
                  <FieldLabel label="商品详情图 URLs（多个）" />
                  <textarea value={formState.detailImagesText} onChange={(event) => setFormState((current) => ({ ...current, detailImagesText: event.target.value }))} rows={4} className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400" placeholder="每行一个 URL，或使用英文逗号分隔" />
                </label>
                <label className="block xl:col-span-3">
                  <FieldLabel label="商品详情" />
                  <textarea value={formState.detailContent} onChange={(event) => setFormState((current) => ({ ...current, detailContent: event.target.value }))} rows={5} className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400" placeholder="填写商品卖点、规格说明、保鲜要求等" />
                </label>
              </div>

              <div className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <div>
                  <h4 className="text-sm font-semibold text-slate-900">详情预览</h4>
                  <p className="mt-1 text-sm text-slate-500">用于检查主图、详情图、详情文案与空值兜底展示。</p>
                </div>
                <div className="grid gap-4 lg:grid-cols-[220px_1fr]">
                  <div className="rounded-2xl border border-slate-200 bg-white p-3">
                    {formState.mainImage ? (
                      <img src={formState.mainImage} alt={formState.name || "商品主图"} className="h-48 w-full rounded-xl object-cover" />
                    ) : (
                      <div className="flex h-48 items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 text-sm text-slate-400">暂无主图</div>
                    )}
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <DetailRow label="品牌" value={fallbackText(formState.brand)} />
                    <DetailRow label="包装方式" value={formState.packageType === "PACKAGED" ? "包装" : "散装"} />
                    <DetailRow label="产地" value={fallbackText(formState.origin)} />
                    <DetailRow label="品种" value={fallbackText(formState.variety)} />
                    <DetailRow label="储存温度" value={fallbackText(formState.storageTemp)} />
                    <DetailRow label="许可证编号" value={fallbackText(formState.foodLicense)} />
                    <DetailRow label="单果规格" value={fallbackText(formState.unitSpec)} />
                    <DetailRow label="净重" value={fallbackText(formState.netWeight)} />
                    <DetailRow label="价格" value={formState.price ? currencyFormatter.format(Number(formState.price)) : "-"} />
                    <DetailRow label="详情文案" value={fallbackText(formState.detailContent)} />
                  </div>
                </div>
                <div>
                  <div className="mb-3 text-xs font-medium uppercase tracking-[0.16em] text-slate-400">详情图预览</div>
                  {previewImages.length > 0 ? (
                    <div className="grid gap-3 md:grid-cols-3 xl:grid-cols-4">
                      {previewImages.map((image) => (
                        <div key={image} className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-2">
                          <img src={image} alt="详情图" className="h-32 w-full rounded-xl object-cover" />
                          <p className="mt-2 truncate text-xs text-slate-500">{image}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-xl border border-dashed border-slate-300 bg-white px-4 py-8 text-center text-sm text-slate-400">暂无详情图</div>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 border-t border-slate-200 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                >
                  取消
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl bg-brand px-5 py-2 text-sm font-semibold text-white transition hover:bg-brand-dark disabled:cursor-not-allowed disabled:bg-slate-400"
                >
                  {saving ? "提交中..." : formState.id ? "保存修改" : "确认新增"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}
