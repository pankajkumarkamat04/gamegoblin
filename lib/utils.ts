import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Central API base URL – Onetopup backend (via zorotopup)
// Default: https://api.zorotopup.com, override with NEXT_PUBLIC_API_URL if needed
export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://api.zorotopup.com";

export function buildAPIURL(path: string): string {
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `${API_URL}/${cleanPath}`;
}

export function getAPIHeaders(includeAuth = false): HeadersInit {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  return headers;
}
