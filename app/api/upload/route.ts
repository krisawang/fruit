import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { ok, fail } from "@/lib/api";
import { requireApiUser } from "@/lib/session";
import { ApiError } from "@/lib/validation";

export async function POST(request: Request) {
  try {
    await requireApiUser("inventory");
    const formData = await request.formData();
    const entries = formData.getAll("files").filter((item): item is File => item instanceof File && item.size > 0);
    if (entries.length === 0) {
      throw new ApiError(400, "\u8bf7\u9009\u62e9\u56fe\u7247\u6587\u4ef6");
    }

    const now = new Date();
    const relativeDir = path.posix.join("uploads", String(now.getFullYear()), String(now.getMonth() + 1).padStart(2, "0"));
    const targetDir = path.join(process.cwd(), "public", relativeDir);
    await mkdir(targetDir, { recursive: true });

    const files: string[] = [];
    for (const file of entries) {
      if (!file.type.startsWith("image/")) {
        throw new ApiError(400, "\u4ec5\u652f\u6301\u56fe\u7247\u6587\u4ef6\u4e0a\u4f20");
      }
      const extension = path.extname(file.name) || ".png";
      const fileName = `${Date.now()}-${randomUUID()}${extension}`;
      const absolutePath = path.join(targetDir, fileName);
      const buffer = Buffer.from(await file.arrayBuffer());
      await writeFile(absolutePath, buffer);
      files.push(`/${path.posix.join(relativeDir, fileName)}`);
    }

    return ok({ files }, { status: 201 });
  } catch (error) {
    return fail(error);
  }
}
