import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date | undefined | null): string {
  if (!date) return "-";
  
  try {
    const d = typeof date === 'string' ? new Date(date) : date;

    if (isNaN(d.getTime())) return String(date);

    const day = String(d.getUTCDate()).padStart(2, '0');
    const month = String(d.getUTCMonth() + 1).padStart(2, '0');
    const year = d.getUTCFullYear();
    
    return `${day}/${month}/${year}`;
} catch (e) {
    return String(date);
  }
}

export function isExpired(date: string | Date | undefined | null): boolean {
  if (!date) return false;
  try {
    const d = typeof date === 'string' ? new Date(date) : date;
    if (isNaN(d.getTime())) return false;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    d.setHours(0, 0, 0, 0);
    
    return d.getTime() < today.getTime();
  } catch (e) {
    return false;
  }
}
