import { type ClassValue, clsx } from "clsx";

/** 简洁版 cn：合并 className */
export function cn(...args: ClassValue[]): string {
  return clsx(args);
}
