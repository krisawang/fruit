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
      throw new ApiError(400, "��ǰ���벻��ȷ");
    }

    if (currentPassword === nextPassword) {
      throw new ApiError(400, "�����벻���뵱ǰ������ͬ");
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash: hashPassword(nextPassword)
      }
    });

    return ok({ changed: true });
  } catch (error) {
    return fail(error);
  }
}
