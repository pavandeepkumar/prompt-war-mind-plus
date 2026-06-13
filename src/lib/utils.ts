/**
 * Join Tailwind class names together cleanly.
 */
export function cn(...classes: Array<string | undefined | null | boolean | number>): string {
  return classes.filter(Boolean).join(' ');
}

/**
 * Format date string into human-friendly format.
 */
export function formatDate(dateString: string): string {
  try {
    const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-IN', options);
  } catch {
    return dateString;
  }
}
