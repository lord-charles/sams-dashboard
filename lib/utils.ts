import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function truncateText(text: string, charLimit: number): string {
  if (text?.length > charLimit) {
    return text?.slice(0, charLimit) + "…";
  }
  return text;
}

export function formatNumber(value: number): string {
  if (value >= 1_000_000) {
    return `${(value / 1_000_000)?.toFixed(1)?.replace(/\.0$/, "")}M`;
  } else if (value >= 1_000) {
    return `${(value / 1_000)?.toFixed(1)?.replace(/\.0$/, "")}K`;
  }
  return value?.toString();
}

export function abbreviateNumber(value: number): string {
  if (value >= 1_000_000) {
    return `${(value / 1_000_000)?.toFixed(2)}M`;
  } else if (value >= 1_000) {
    return `${(value / 1_000)?.toFixed(2)}K`;
  } else {
    return value?.toString();
  }
}
