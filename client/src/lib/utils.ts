import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isValidTimestamp(_timestamp: string) {
  const newTimestamp = new Date(_timestamp).getTime();
  return isNumeric(newTimestamp);
}

export function isNumeric(_n: number) {
  return !isNaN(_n) && isFinite(_n);
}
