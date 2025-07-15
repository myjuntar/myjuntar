// lib/utils.ts
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const decodeJwt = <T = any>(token: string): T => {
  const payload = token.split('.')[1];
  return JSON.parse(atob(payload));
};
