export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export function assertString(value: unknown, field: string) {
  if (typeof value !== "string" || value.trim() === "") {
    throw new ApiError(400, `${field} is required`);
  }

  return value.trim();
}

export function assertOptionalString(value: unknown) {
  if (value == null || value === "") {
    return null;
  }

  if (typeof value !== "string") {
    throw new ApiError(400, "Invalid string value");
  }

  const trimmed = value.trim();
  return trimmed === "" ? null : trimmed;
}

export function assertPassword(value: unknown, field = "password") {
  const password = assertString(value, field);
  if (password.length < 6) {
    throw new ApiError(400, `${field} must be at least 6 characters`);
  }
  return password;
}

export function assertPhone(value: unknown, field = "phone") {
  const phone = assertString(value, field).replace(/\s+/g, "").replace(/-/g, "");
  if (!/^1\d{10}$/.test(phone)) {
    throw new ApiError(400, `${field} must be a valid mobile number`);
  }
  return phone;
}

export function assertPositiveNumber(value: unknown, field: string) {
  const parsed = typeof value === "number" ? value : Number(value);

  if (!Number.isFinite(parsed) || parsed <= 0) {
    throw new ApiError(400, `${field} must be a positive number`);
  }

  return parsed;
}

export function assertNonNegativeNumber(value: unknown, field: string) {
  const parsed = typeof value === "number" ? value : Number(value);

  if (!Number.isFinite(parsed) || parsed < 0) {
    throw new ApiError(400, `${field} must be a non-negative number`);
  }

  return parsed;
}

export function assertOptionalNumber(value: unknown, field: string) {
  if (value == null || value === "") {
    return null;
  }

  const parsed = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(parsed)) {
    throw new ApiError(400, `${field} must be a valid number`);
  }

  return parsed;
}

export function assertEnumValue<T extends string>(value: unknown, field: string, options: readonly T[]) {
  if (typeof value !== "string" || !options.includes(value as T)) {
    throw new ApiError(400, `${field} is invalid`);
  }

  return value as T;
}

export function assertOptionalEnumValue<T extends string>(value: unknown, field: string, options: readonly T[]) {
  if (value == null || value === "") {
    return null;
  }

  return assertEnumValue(value, field, options);
}

export function assertOptionalStringArray(value: unknown, field: string) {
  if (value == null) {
    return null;
  }

  if (!Array.isArray(value) || value.some((item) => typeof item !== "string")) {
    throw new ApiError(400, `${field} must be an array of strings`);
  }

  return value.map((item) => item.trim()).filter(Boolean);
}

export function assertDate(value: unknown, field: string) {
  if (typeof value !== "string" || value.trim() === "") {
    throw new ApiError(400, `${field} is required`);
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    throw new ApiError(400, `${field} must be a valid date`);
  }

  return parsed;
}

export function assertOptionalDate(value: unknown) {
  if (value == null || value === "") {
    return null;
  }

  if (typeof value !== "string") {
    throw new ApiError(400, "Invalid date value");
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    throw new ApiError(400, "Invalid date value");
  }

  return parsed;
}
