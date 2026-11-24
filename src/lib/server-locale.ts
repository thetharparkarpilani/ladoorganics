import { cookies } from "next/headers";
import type { LocaleCode } from "@/types/domain";

export async function getServerLocale(): Promise<LocaleCode> {
  const store = await cookies();
  const value = store.get("lado-locale")?.value;
  return value === "hi" || value === "ma" ? value : "en";
}
