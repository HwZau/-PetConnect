/**
 * Format file size in human readable format
 * @param bytes - File size in bytes
 * @returns Formatted file size string
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";

  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

/**
 * Check if file type is image
 * @param type - File MIME type
 * @returns True if image type
 */
export function isImageFile(type: string): boolean {
  return type.startsWith("image/");
}

// Removed video and document file checks - not needed for PawNest pet images

/**
 * Get file extension from filename
 * @param filename - File name
 * @returns File extension
 */
export function getFileExtension(filename: string): string {
  return filename.split(".").pop()?.toLowerCase() || "";
}

/**
 * Get file name without extension
 * @param filename - File name
 * @returns File name without extension
 */
export function getFileNameWithoutExtension(filename: string): string {
  return filename.split(".").slice(0, -1).join(".");
}

/**
 * Validate file size
 * @param file - File to validate
 * @param maxSizeInMB - Maximum size in MB
 * @returns True if file size is valid
 */
export function validateFileSize(file: File, maxSizeInMB: number): boolean {
  const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
  return file.size <= maxSizeInBytes;
}

/**
 * Validate file type
 * @param file - File to validate
 * @param allowedTypes - Array of allowed MIME types
 * @returns True if file type is valid
 */
export function validateFileType(file: File, allowedTypes: string[]): boolean {
  return allowedTypes.includes(file.type);
}

/**
 * Read file as data URL
 * @param file - File to read
 * @returns Promise with data URL
 */
export function readFileAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// Removed readFileAsText - not needed for pet image uploads
