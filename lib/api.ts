import { NextResponse } from "next/server";
import { ApiError } from "@/lib/validation";

export function ok(data: unknown, init?: ResponseInit) {
  return NextResponse.json({ success: true, data }, init);
}

export function fail(error: unknown) {
  if (error instanceof ApiError) {
    return NextResponse.json({ success: false, error: error.message }, { status: error.status });
  }

  console.error(error);
  return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
}