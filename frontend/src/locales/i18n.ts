import { en } from "./en";
import { ko } from "./ko";
import type { LocaleCode } from "../engine/types";

const catalogs: Record<LocaleCode, Record<string, string>> = { ko, en };

export function hasKoKey(key: string): boolean {
  return Object.hasOwn(ko, key);
}

export function t(
  key: string,
  vars: Record<string, string | number> = {},
  locale: LocaleCode = "ko",
): string {
  const template = catalogs[locale][key] ?? ko[key as keyof typeof ko] ?? `[missing:${key}]`;
  return template.replace(/\{(\w+)\}/g, (_, varName: string) => String(vars[varName] ?? `{${varName}}`));
}

export function resolveTextValue(value: string | number, locale: LocaleCode = "ko"): string | number {
  if (typeof value !== "string") return value;
  if (value.includes(".")) return t(value, {}, locale);
  return value;
}
