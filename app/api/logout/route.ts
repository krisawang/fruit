import { clearSession } from "@/lib/session";
import { ok, fail } from "@/lib/api";

export async function POST() {
  try {
    await clearSession();
    return ok({ loggedOut: true });
  } catch (error) {
    return fail(error);
  }
}
