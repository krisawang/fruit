"use client";

import { FormEvent, ReactNode, useEffect, useMemo, useState } from "react";
import { DataTable, SectionCard } from "@/components/ui-shell";

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
  mainImages: string[];
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
  showOnHome: boolean;
};

type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
};

type UploadResponse = {
  files: string[];
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
  mainImages: string[];
  detailImages: string[];
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
  showOnHome: boolean;
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

function resolveImageUrl(value: string | null | undefined) {
  if (!value) return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  if (/^(https?:|data:|blob:)/i.test(trimmed)) return trimmed;
  if (trimmed.startsWith("/api/uploads/")) return trimmed.replace(/^\/api/, "");
  if (trimmed.startsWith("/uploads/")) return trimmed;
  if (trimmed.startsWith("/")) return trimmed;
  return `/uploads/${trimmed.replace(/^\.?\/+/, "")}`;
}

function createInitialFormState(): FormState {
  const today = new Date();
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
    mainImages: [],
    detailImages: [],
    detailContent: "",
    unit: "kg",
    unitSpec: "",
    netWeight: "",
    price: "",
    quantity: "",
    warehouseLocation: "",
    inboundDate: formatDateInput(today),
    expiryDate: formatDateInput(addDays(today, 7)),
    lowStockThreshold: "100",
    showOnHome: false
  };
}

function textOrNull(value: unknown) {
  return typeof value === "string" && value.trim() !== "" ? value : null;
}

function numberOrNull(value: unknown) {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

function normalizeImages(value: unknown) {
  if (Array.isArray(value)) {
    return value
      .filter((item): item is string => typeof item === "string" && item.trim().length > 0)
      .map((item) => resolveImageUrl(item))
      .filter((item): item is string => Boolean(item));
  }
  if (typeof value === "string" && value.trim()) {
    return value
      .split(/[\n,]/)
      .map((item) => resolveImageUrl(item))
      .filter((item): item is string => Boolean(item));
  }
  return [];
}

function fallback(value: string | number | null | undefined, empty = "-") {
  return value == null || value === "" ? empty : String(value);
}

function parseItem(raw: unknown): InventoryItem {
  const item = raw as Partial<InventoryItem> & Record<string, unknown>;
  const mainImages = normalizeImages(item.mainImages);
  const mainImage = resolveImageUrl(textOrNull(item.mainImage)) ?? mainImages[0] ?? null;
  return {
    id: typeof item.id === "string" ? item.id : "",
    name: typeof item.name === "string" ? item.name : "",
    brand: textOrNull(item.brand),
    category: typeof item.category === "string" ? item.category : "",
    batchNo: typeof item.batchNo === "string" ? item.batchNo : "",
    origin: typeof item.origin === "string" ? item.origin : "",
    packageType: item.packageType === "PACKAGED" ? "PACKAGED" : "BULK",
    packageTypeLabel: typeof item.packageTypeLabel === "string" ? item.packageTypeLabel : item.packageType === "PACKAGED" ? "Packaged" : "Bulk",
    variety: textOrNull(item.variety),
    storageTemp: textOrNull(item.storageTemp),
    foodLicense: textOrNull(item.foodLicense),
    mainImage,
    mainImages: mainImages.length > 0 ? mainImages : mainImage ? [mainImage] : [],
    detailImages: normalizeImages(item.detailImages),
    detailContent: textOrNull(item.detailContent),
    quantity: numberOrNull(item.quantity) ?? 0,
    unit: typeof item.unit === "string" ? item.unit : "kg",
    unitSpec: textOrNull(item.unitSpec),
    netWeight: numberOrNull(item.netWeight),
    price: numberOrNull(item.price),
    warehouseLocation: typeof item.warehouseLocation === "string" ? item.warehouseLocation : "",
    inboundDate: typeof item.inboundDate === "string" ? item.inboundDate : "",
    expiryDate: typeof item.expiryDate === "string" ? item.expiryDate : "",
    lowStockThreshold: numberOrNull(item.lowStockThreshold) ?? 0,
    status: typeof item.status === "string" ? item.status : "",
    showOnHome: item.showOnHome === true
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
    mainImage: item.mainImage ?? item.mainImages[0] ?? "",
    mainImages: item.mainImages,
    detailImages: item.detailImages,
    detailContent: item.detailContent ?? "",
    unit: item.unit,
    unitSpec: item.unitSpec ?? "",
    netWeight: item.netWeight == null ? "" : String(item.netWeight),
    price: item.price == null ? "" : String(item.price),
    quantity: String(item.quantity),
    warehouseLocation: item.warehouseLocation,
    inboundDate: formatDate(item.inboundDate),
    expiryDate: formatDate(item.expiryDate),
    lowStockThreshold: String(item.lowStockThreshold),
    showOnHome: item.showOnHome
  };
}

function ensureCover(mainImage: string, mainImages: string[]) {
  const unique = Array.from(new Set(mainImages.filter(Boolean)));
  if (!mainImage) {
    return { mainImage: unique[0] ?? "", mainImages: unique };
  }
  return { mainImage, mainImages: unique.includes(mainImage) ? unique : [mainImage, ...unique] };
}

function FieldLabel({ label, required = false }: { label: string; required?: boolean }) {
  return <span className="mb-2 block text-sm font-medium text-slate-700">{label}{required ? <span className="ml-1 text-rose-500">*</span> : null}</span>;
}

function DetailRow({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
      <div className="text-xs font-medium uppercase tracking-[0.16em] text-slate-400">{label}</div>
      <div className="mt-2 text-sm text-slate-700">{value}</div>
    </div>
  );
}

function Thumb({ src, alt }: { src: string | null; alt: string }) {
  const imageUrl = resolveImageUrl(src);
  if (!imageUrl) {
    return <div className="flex h-16 w-16 items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 text-[11px] text-slate-400">No image</div>;
  }
  return <img src={imageUrl} alt={alt} className="h-16 w-16 rounded-xl border border-slate-200 object-cover" />;
}

export function InventoryManagement() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingMain, setUploadingMain] = useState(false);
  const [uploadingDetail, setUploadingDetail] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formState, setFormState] = useState<FormState>(() => createInitialFormState());

  async function loadItems(search = "") {
    setLoading(true);
    setError(null);
    try {
      const query = search ? `?search=${encodeURIComponent(search)}` : "";
      const response = await fetch(`/api/inventory${query}`, { credentials: "include", cache: "no-store" });
      const payload = (await response.json()) as ApiResponse<unknown[]>;
      if (!response.ok || !payload.success || !payload.data) throw new Error(payload.error || "Failed to load items");
      setItems(payload.data.map(parseItem));
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Failed to load items");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { void loadItems(); }, []);

  async function uploadFiles(files: FileList | null) {
    if (!files || files.length === 0) return [] as string[];
    const body = new FormData();
    Array.from(files).forEach((file) => body.append("files", file));
    const response = await fetch("/api/upload", { method: "POST", credentials: "include", body });
    const payload = (await response.json()) as ApiResponse<UploadResponse>;
    if (!response.ok || !payload.success || !payload.data) throw new Error(payload.error || "Upload failed");
    return payload.data.files.map((item) => resolveImageUrl(item)).filter((item): item is string => Boolean(item));
  }

  async function handleMainUpload(files: FileList | null) {
    setUploadingMain(true);
    try {
      const uploaded = await uploadFiles(files);
      if (uploaded.length > 0) {
        setFormState((current) => {
          const nextMainImages = Array.from(new Set([...current.mainImages, ...uploaded]));
          return { ...current, ...ensureCover(current.mainImage || uploaded[0], nextMainImages) };
        });
      }
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Main image upload failed");
    } finally {
      setUploadingMain(false);
    }
  }

  async function handleDetailUpload(files: FileList | null) {
    setUploadingDetail(true);
    try {
      const uploaded = await uploadFiles(files);
      if (uploaded.length > 0) {
        setFormState((current) => ({ ...current, detailImages: Array.from(new Set([...current.detailImages, ...uploaded])) }));
      }
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Detail image upload failed");
    } finally {
      setUploadingDetail(false);
    }
  }

  function removeMainImage(image: string) {
    setFormState((current) => {
      const filtered = current.mainImages.filter((item) => item !== image);
      return { ...current, mainImages: filtered, mainImage: current.mainImage === image ? filtered[0] ?? "" : current.mainImage };
    });
  }

  function removeDetailImage(image: string) {
    setFormState((current) => ({ ...current, detailImages: current.detailImages.filter((item) => item !== image) }));
  }

  async function handleSearchSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await loadItems(keyword.trim());
  }

  function openCreateModal() {
    setFormState(createInitialFormState());
    setError(null);
    setMessage(null);
    setIsModalOpen(true);
  }

  const rows = useMemo(() => items.map((item) => [
    <a href={item.mainImage ?? item.mainImages[0] ?? undefined} target="_blank" rel="noreferrer"><Thumb src={item.mainImage ?? item.mainImages[0] ?? null} alt={item.name} /></a>,
    <div><div className="font-medium text-slate-900">{fallback(item.name)}</div><div className="text-xs text-slate-500">{fallback(item.category)}</div></div>,
    fallback(item.brand),
    fallback(item.packageTypeLabel),
    fallback(item.origin),
    fallback(item.variety),
    `${item.quantity} ${item.unit}`,
    item.netWeight == null ? "-" : `${item.netWeight}`,
    item.price == null ? "-" : currencyFormatter.format(item.price),
    item.showOnHome ? "Yes" : "No",
    fallback(item.batchNo),
    fallback(formatDate(item.inboundDate)),
    fallback(formatDate(item.expiryDate)),
    fallback(item.status),
    <button type="button" onClick={() => { setFormState(toFormState(item)); setError(null); setMessage(null); setIsModalOpen(true); }} className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-50">Edit</button>
  ]), [items]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError(null);
    setMessage(null);
    try {
      const isEditing = Boolean(formState.id);
      const normalized = ensureCover(formState.mainImage, formState.mainImages);
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
        mainImage: normalized.mainImage || null,
        mainImages: normalized.mainImages,
        detailImages: formState.detailImages,
        detailContent: formState.detailContent || null,
        unit: formState.unit,
        unitSpec: formState.unitSpec || null,
        netWeight: formState.netWeight === "" ? null : Number(formState.netWeight),
        price: formState.price === "" ? null : Number(formState.price),
        quantity: Number(formState.quantity),
        warehouseLocation: formState.warehouseLocation,
        inboundDate: formState.inboundDate,
        expiryDate: formState.expiryDate,
        lowStockThreshold: Number(formState.lowStockThreshold),
        showOnHome: formState.showOnHome
      };
      const response = await fetch(isEditing ? "/api/inventory" : "/api/inbound", {
        method: isEditing ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload)
      });
      const result = (await response.json()) as ApiResponse<unknown>;
      if (!response.ok || !result.success) throw new Error(result.error || (isEditing ? "Update failed" : "Create failed"));
      setMessage(isEditing ? "Item updated" : "Item created");
      setIsModalOpen(false);
      setFormState(createInitialFormState());
      await loadItems(keyword.trim());
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Submit failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <SectionCard title="Items" extra={<div className="flex items-center gap-3"><form className="flex items-center gap-2" onSubmit={handleSearchSubmit}><input value={keyword} onChange={(event) => setKeyword(event.target.value)} className="w-56 rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none placeholder:text-slate-400 focus:border-slate-400" placeholder="Search by name / brand / batch / origin" /><button type="submit" className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50">Search</button></form><button type="button" onClick={openCreateModal} className="rounded-xl bg-brand px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-dark">New item</button></div>}>
        {message ? <p className="mb-4 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{message}</p> : null}
        {error ? <p className="mb-4 rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-600">{error}</p> : null}
        {loading ? <div className="rounded-xl border border-dashed border-slate-200 px-6 py-12 text-center text-sm text-slate-500">Loading items...</div> : <DataTable columns={["Cover", "Item", "Brand", "Package", "Origin", "Variety", "Stock", "Net Weight", "Price", "Home", "Batch", "Inbound", "Expiry", "Status", "Action"]} rows={rows} />}
      </SectionCard>

      {isModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-slate-950/40 px-4 py-10">
          <div className="max-h-[90vh] w-full max-w-6xl overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">{formState.id ? "Edit Item" : "New Item"}</h3>
                <p className="mt-1 text-sm text-slate-500">Upload multiple cover images. Thumbnails are shown below immediately and you can choose one cover for the homepage card.</p>
              </div>
              <button type="button" onClick={() => setIsModalOpen(false)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-600 transition hover:bg-slate-50">Close</button>
            </div>
            <form className="space-y-6 px-6 py-6" onSubmit={handleSubmit}>
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                <label className="block"><FieldLabel label="Name" required /><input value={formState.name} onChange={(event) => setFormState((current) => ({ ...current, name: event.target.value }))} className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400" /></label>
                <label className="block"><FieldLabel label="Brand" /><input value={formState.brand} onChange={(event) => setFormState((current) => ({ ...current, brand: event.target.value }))} className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400" /></label>
                <label className="block"><FieldLabel label="Category" required /><input value={formState.category} onChange={(event) => setFormState((current) => ({ ...current, category: event.target.value }))} className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400" /></label>
                <label className="block"><FieldLabel label="Package Type" required /><select value={formState.packageType} onChange={(event) => setFormState((current) => ({ ...current, packageType: event.target.value as FormState["packageType"] }))} className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400"><option value="BULK">Bulk</option><option value="PACKAGED">Packaged</option></select></label>
                <label className="block"><FieldLabel label="Origin" required /><input value={formState.origin} onChange={(event) => setFormState((current) => ({ ...current, origin: event.target.value }))} className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400" /></label>
                <label className="block"><FieldLabel label="Variety" /><input value={formState.variety} onChange={(event) => setFormState((current) => ({ ...current, variety: event.target.value }))} className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400" /></label>
                <label className="block"><FieldLabel label="Batch No" required /><input value={formState.batchNo} onChange={(event) => setFormState((current) => ({ ...current, batchNo: event.target.value }))} className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400" /></label>
                <label className="block"><FieldLabel label="Stock Quantity" required /><input value={formState.quantity} onChange={(event) => setFormState((current) => ({ ...current, quantity: event.target.value }))} type="number" min="0" step="0.01" className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400" /></label>
                <label className="block"><FieldLabel label="Unit" required /><input value={formState.unit} onChange={(event) => setFormState((current) => ({ ...current, unit: event.target.value }))} className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400" /></label>
                <label className="block"><FieldLabel label="Unit Spec" /><input value={formState.unitSpec} onChange={(event) => setFormState((current) => ({ ...current, unitSpec: event.target.value }))} className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400" /></label>
                <label className="block"><FieldLabel label="Net Weight" /><input value={formState.netWeight} onChange={(event) => setFormState((current) => ({ ...current, netWeight: event.target.value }))} type="number" min="0" step="0.01" className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400" /></label>
                <label className="block"><FieldLabel label="Price" /><input value={formState.price} onChange={(event) => setFormState((current) => ({ ...current, price: event.target.value }))} type="number" min="0" step="0.01" className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400" /></label>
                <label className="block"><FieldLabel label="Warehouse Location" required /><input value={formState.warehouseLocation} onChange={(event) => setFormState((current) => ({ ...current, warehouseLocation: event.target.value }))} className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400" /></label>
                <label className="block"><FieldLabel label="Low Stock Threshold" required /><input value={formState.lowStockThreshold} onChange={(event) => setFormState((current) => ({ ...current, lowStockThreshold: event.target.value }))} type="number" min="0" step="0.01" className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400" /></label>
                <label className="block"><FieldLabel label="Inbound Date" required /><input value={formState.inboundDate} onChange={(event) => setFormState((current) => ({ ...current, inboundDate: event.target.value }))} type="date" className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400" /></label>
                <label className="block"><FieldLabel label="Expiry Date" required /><input value={formState.expiryDate} onChange={(event) => setFormState((current) => ({ ...current, expiryDate: event.target.value }))} type="date" className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400" /></label>
                <label className="block"><FieldLabel label="Storage Temp" /><input value={formState.storageTemp} onChange={(event) => setFormState((current) => ({ ...current, storageTemp: event.target.value }))} className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400" placeholder="e.g. 0-4C" /></label>
                <label className="block xl:col-span-2"><FieldLabel label="Food License" /><input value={formState.foodLicense} onChange={(event) => setFormState((current) => ({ ...current, foodLicense: event.target.value }))} className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400" /></label>
                <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-700 xl:col-span-3"><input type="checkbox" checked={formState.showOnHome} onChange={(event) => setFormState((current) => ({ ...current, showOnHome: event.target.checked }))} className="h-4 w-4 rounded border-slate-300 text-brand focus:ring-brand" />Show on home page</label>
                <div className="xl:col-span-3 grid gap-4 xl:grid-cols-2">
                  <label className="block rounded-2xl border border-slate-200 bg-slate-50 p-4"><FieldLabel label="Cover Images Upload" /><input type="file" accept="image/*" multiple onChange={(event) => void handleMainUpload(event.target.files)} className="block w-full text-sm text-slate-600 file:mr-4 file:rounded-full file:border-0 file:bg-slate-900 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white" /><p className="mt-2 text-xs text-slate-500">{uploadingMain ? "Uploading cover images..." : formState.mainImages.length > 0 ? "Uploaded images are shown below as thumbnails." : "Upload one or more cover images."}</p></label>
                  <label className="block rounded-2xl border border-slate-200 bg-slate-50 p-4"><FieldLabel label="Detail Images Upload" /><input type="file" accept="image/*" multiple onChange={(event) => void handleDetailUpload(event.target.files)} className="block w-full text-sm text-slate-600 file:mr-4 file:rounded-full file:border-0 file:bg-slate-900 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white" /><p className="mt-2 text-xs text-slate-500">{uploadingDetail ? "Uploading detail images..." : "Uploaded images are arranged below as small thumbnails."}</p></label>
                </div>
                <label className="block xl:col-span-3"><FieldLabel label="Detail Content" /><textarea value={formState.detailContent} onChange={(event) => setFormState((current) => ({ ...current, detailContent: event.target.value }))} rows={5} className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400" placeholder="Describe highlights, specs, and storage notes" /></label>
              </div>

              <div className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <h4 className="text-sm font-semibold text-slate-900">Preview</h4>
                <div>
                  <div className="mb-3 text-xs font-medium uppercase tracking-[0.16em] text-slate-400">Cover thumbnails</div>
                  {formState.mainImages.length > 0 ? <div className="grid gap-3 md:grid-cols-3 xl:grid-cols-5">{formState.mainImages.map((image) => <div key={image} className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-2"><button type="button" onClick={() => setFormState((current) => ({ ...current, ...ensureCover(image, current.mainImages) }))} className="block w-full text-left"><img src={resolveImageUrl(image) || undefined} alt="cover" className="h-28 w-full rounded-xl object-cover" /></button><div className="mt-2 flex items-center justify-between gap-2"><span className={`rounded-full px-2 py-1 text-[11px] ${formState.mainImage === image ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-500"}`}>{formState.mainImage === image ? "Current cover" : "Set cover"}</span><button type="button" onClick={() => removeMainImage(image)} className="rounded-lg border border-slate-200 px-2 py-1 text-xs text-slate-600 transition hover:bg-slate-50">Remove</button></div></div>)}</div> : <div className="rounded-xl border border-dashed border-slate-300 bg-white px-4 py-8 text-center text-sm text-slate-400">No cover images</div>}
                </div>
                <div className="grid gap-4 lg:grid-cols-[220px_1fr]">
                  <div className="rounded-2xl border border-slate-200 bg-white p-3">{formState.mainImage ? <img src={resolveImageUrl(formState.mainImage) || undefined} alt={formState.name || "cover image"} className="h-48 w-full rounded-xl object-cover" /> : <div className="flex h-48 items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 text-sm text-slate-400">No cover image</div>}</div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <DetailRow label="Brand" value={fallback(formState.brand)} />
                    <DetailRow label="Package Type" value={formState.packageType === "PACKAGED" ? "Packaged" : "Bulk"} />
                    <DetailRow label="Origin" value={fallback(formState.origin)} />
                    <DetailRow label="Variety" value={fallback(formState.variety)} />
                    <DetailRow label="Storage Temp" value={fallback(formState.storageTemp)} />
                    <DetailRow label="Food License" value={fallback(formState.foodLicense)} />
                    <DetailRow label="Unit Spec" value={fallback(formState.unitSpec)} />
                    <DetailRow label="Net Weight" value={fallback(formState.netWeight)} />
                    <DetailRow label="Price" value={formState.price ? currencyFormatter.format(Number(formState.price)) : "-"} />
                    <DetailRow label="Home Showcase" value={formState.showOnHome ? "Yes" : "No"} />
                  </div>
                </div>
                <div>
                  <div className="mb-3 text-xs font-medium uppercase tracking-[0.16em] text-slate-400">Detail thumbnails</div>
                  {formState.detailImages.length > 0 ? <div className="grid gap-3 md:grid-cols-3 xl:grid-cols-4">{formState.detailImages.map((image) => <div key={image} className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-2"><img src={resolveImageUrl(image) || undefined} alt="detail" className="h-28 w-full rounded-xl object-cover" /><div className="mt-2 flex items-center justify-between gap-2"><p className="flex-1 truncate text-xs text-slate-500">{image}</p><button type="button" onClick={() => removeDetailImage(image)} className="rounded-lg border border-slate-200 px-2 py-1 text-xs text-slate-600 transition hover:bg-slate-50">Remove</button></div></div>)}</div> : <div className="rounded-xl border border-dashed border-slate-300 bg-white px-4 py-8 text-center text-sm text-slate-400">No detail images</div>}
                </div>
                <DetailRow label="Detail Content" value={fallback(formState.detailContent)} />
              </div>

              <div className="flex items-center justify-end gap-3 border-t border-slate-200 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50">Cancel</button>
                <button type="submit" disabled={saving || uploadingMain || uploadingDetail} className="rounded-xl bg-brand px-5 py-2 text-sm font-semibold text-white transition hover:bg-brand-dark disabled:cursor-not-allowed disabled:bg-slate-400">{saving ? "Submitting..." : formState.id ? "Save changes" : "Create item"}</button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}