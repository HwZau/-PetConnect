import { clsx, type ClassValue } from "clsx";

/**
 * Combine class names with clsx utility
 * @param inputs - Class names to combine
 * @returns Combined class string
 */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

/**
 * Conditionally apply class names
 * @param baseClass - Base class name
 * @param conditionalClasses - Object with condition-class pairs
 * @returns Combined class string
 */
export function conditionalClass(
  baseClass: string,
  conditionalClasses: Record<string, boolean>
): string {
  return cn(
    baseClass,
    Object.entries(conditionalClasses)
      .filter(([, condition]) => condition)
      .map(([className]) => className)
  );
}

/**
 * Create variant classes based on props
 * @param variants - Object mapping variant names to class names
 * @param props - Props containing variant values
 * @returns Combined class string
 */
export function createVariants<T extends Record<string, string>>(
  variants: Record<keyof T, Record<string, string>>,
  props: Partial<T>
): string {
  const classes = Object.entries(props)
    .map(([key, value]) => {
      if (value && variants[key] && variants[key][value]) {
        return variants[key][value];
      }
      return "";
    })
    .filter(Boolean);

  return cn(...classes);
}
