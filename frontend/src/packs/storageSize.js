export const STORAGE_SIZE_PRESETS = [
  "1Gi",
  "2Gi",
  "4Gi",
  "8Gi",
  "12Gi",
  "16Gi",
  "24Gi",
  "32Gi",
  "64Gi",
  "128Gi",
  "200Gi",
];

export const DEFAULT_STORAGE_SIZE = "4Gi";

/**
 * Normalize user input to Kubernetes quantity with Gi suffix, e.g. 4Gi.
 */
export function normalizeStorageSize(value) {
  if (value == null || String(value).trim() === "") {
    return DEFAULT_STORAGE_SIZE;
  }
  const raw = String(value).trim();
  const match = raw.match(/^(\d+(?:\.\d+)?)\s*(Gi|G|gi|giB)?$/i);
  if (!match) {
    throw new Error(`无效的 storage_size: ${value}`);
  }
  const amount = Number(match[1]);
  if (!Number.isFinite(amount) || amount <= 0) {
    throw new Error("storage_size 必须大于 0");
  }
  if (Number.isInteger(amount)) {
    return `${amount}Gi`;
  }
  return `${amount}Gi`;
}

export function resolveStorageSizePayload(form) {
  if (!form || typeof form !== "object") {
    return { storage_size: DEFAULT_STORAGE_SIZE };
  }
  const raw = form.storage_size ?? form.storageSize;
  return { storage_size: normalizeStorageSize(raw) };
}
