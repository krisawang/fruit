import { prisma } from "@/lib/prisma";
import { ok, fail } from "@/lib/api";
import { hashPassword, verifyPassword } from "@/lib/password";
import { requireApiUser } from "@/lib/session";
import { assertPassword, ApiError } from "@/lib/validation";

export async function POST(request: Request) {
  try {
    const session = await requireApiUser();
    const body = await request.json();
    const currentPassword = assertPassword(body.currentPassword, "currentPassword");
    const nextPassword = assertPassword(body.nextPassword, "nextPassword");

    const user = await prisma.user.findUnique({ where: { id: session.id } });
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    if (!verifyPassword(currentPassword, user.passwordHash)) {
      throw new ApiError(400, "\u5f53\u524d\u5bc6\u7801\u4e0d\u6b63\u786e");
    }

    if (currentPassword === nextPassword) {
      throw new ApiError(400, "\u65b0\u5bc6\u7801\u4e0d\u80fd\u4e0e\u5f53\u524d\u5bc6\u7801\u76f8\u540c");
    }

    await prisma.user.update({ where: { id: user.id }, data: { passwordHash: hashPassword(nextPassword) } });
    return ok({ changed: true });
  } catch (error) {
    return fail(error);
  }
}
