import { readFile } from "node:fs/promises";
import path from "node:path";

const contentTypes: Record<string, string> = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".bmp": "image/bmp",
  ".avif": "image/avif"
};

export async function GET(_request: Request, context: { params: Promise<{ segments: string[] }> }) {
  try {
    const { segments } = await context.params;
    const rootDir = path.join(process.cwd(), "public", "uploads");
    const absolutePath = path.join(rootDir, ...segments);

    if (!absolutePath.startsWith(rootDir)) {
      return new Response("Invalid path", { status: 400 });
    }

    const buffer = await readFile(absolutePath);
    const extension = path.extname(absolutePath).toLowerCase();
    return new Response(buffer, {
      headers: {
        "Content-Type": contentTypes[extension] || "application/octet-stream",
        "Cache-Control": "public, max-age=31536000, immutable"
      }
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}