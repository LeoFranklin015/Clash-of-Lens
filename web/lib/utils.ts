import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function statusToLabel(status: number) {
  return status === 0 ? "Ready for War" : status === 1 ? "At War" : "Not Ready";
}
