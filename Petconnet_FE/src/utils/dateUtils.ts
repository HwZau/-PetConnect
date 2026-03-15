import {
  format,
  formatDistance,
  formatRelative,
  isValid,
  parseISO,
} from "date-fns";
import { vi } from "date-fns/locale";

/**
 * Format date to Vietnamese locale
 * @param date - Date to format
 * @param pattern - Date format pattern
 * @returns Formatted date string
 */
export function formatDate(
  date: Date | string | number,
  pattern: string = "dd/MM/yyyy"
): string {
  try {
    const dateObj = typeof date === "string" ? parseISO(date) : new Date(date);
    if (!isValid(dateObj)) return "Invalid date";
    return format(dateObj, pattern, { locale: vi });
  } catch {
    return "Invalid date";
  }
}

/**
 * Format date to relative time (e.g., "2 hours ago")
 * @param date - Date to format
 * @returns Relative time string
 */
export function formatRelativeTime(date: Date | string | number): string {
  try {
    const dateObj = typeof date === "string" ? parseISO(date) : new Date(date);
    if (!isValid(dateObj)) return "Invalid date";
    return formatDistance(dateObj, new Date(), {
      addSuffix: true,
      locale: vi,
    });
  } catch {
    return "Invalid date";
  }
}

/**
 * Format date relative to today (e.g., "today", "yesterday", "last Friday")
 * @param date - Date to format
 * @returns Relative date string
 */
export function formatRelativeDate(date: Date | string | number): string {
  try {
    const dateObj = typeof date === "string" ? parseISO(date) : new Date(date);
    if (!isValid(dateObj)) return "Invalid date";
    return formatRelative(dateObj, new Date(), { locale: vi });
  } catch {
    return "Invalid date";
  }
}
