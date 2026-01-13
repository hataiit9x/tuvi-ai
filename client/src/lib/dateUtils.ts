/**
 * Date utility functions for Vietnamese date format (dd/mm/yyyy)
 */

/**
 * Format a date string or Date object to dd/mm/yyyy format
 */
export function formatDateVN(date: string | Date | null | undefined): string {
  if (!date) return "";
  
  try {
    const d = typeof date === "string" ? new Date(date) : date;
    if (isNaN(d.getTime())) return String(date);
    
    const day = d.getDate().toString().padStart(2, "0");
    const month = (d.getMonth() + 1).toString().padStart(2, "0");
    const year = d.getFullYear();
    
    return `${day}/${month}/${year}`;
  } catch {
    return String(date);
  }
}

/**
 * Format a date string or Date object to dd/mm/yyyy HH:mm format
 */
export function formatDateTimeVN(date: string | Date | null | undefined): string {
  if (!date) return "";
  
  try {
    const d = typeof date === "string" ? new Date(date) : date;
    if (isNaN(d.getTime())) return String(date);
    
    const day = d.getDate().toString().padStart(2, "0");
    const month = (d.getMonth() + 1).toString().padStart(2, "0");
    const year = d.getFullYear();
    const hours = d.getHours().toString().padStart(2, "0");
    const minutes = d.getMinutes().toString().padStart(2, "0");
    
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  } catch {
    return String(date);
  }
}

/**
 * Parse a dd/mm/yyyy string to Date object
 */
export function parseDateVN(dateStr: string): Date | null {
  if (!dateStr) return null;
  
  // Try parsing dd/mm/yyyy format
  const parts = dateStr.split("/");
  if (parts.length === 3) {
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const year = parseInt(parts[2], 10);
    
    if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
      return new Date(year, month, day);
    }
  }
  
  // Fallback to native Date parsing
  const d = new Date(dateStr);
  return isNaN(d.getTime()) ? null : d;
}

/**
 * Convert yyyy-mm-dd to dd/mm/yyyy
 */
export function convertISOToVN(isoDate: string): string {
  if (!isoDate) return "";
  
  const parts = isoDate.split("-");
  if (parts.length === 3) {
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }
  
  return isoDate;
}

/**
 * Convert dd/mm/yyyy to yyyy-mm-dd (for input[type="date"])
 */
export function convertVNToISO(vnDate: string): string {
  if (!vnDate) return "";
  
  const parts = vnDate.split("/");
  if (parts.length === 3) {
    return `${parts[2]}-${parts[1]}-${parts[0]}`;
  }
  
  return vnDate;
}
