import { expect, test, describe } from 'vitest';
import { cn, formatDate } from './utils';

describe('utils utility logic', () => {
  test('cn merges space-separated tailwind classes correctly', () => {
    const result = cn('bg-rose-500', 'text-white', false && 'hidden', 'p-4');
    expect(result).toBe('bg-rose-500 text-white p-4');
  });

  test('cn handles empty and null inputs gracefully', () => {
    const result = cn(null, undefined, '', 'mx-auto', false, 12, 'w-full');
    expect(result).toBe('mx-auto 12 w-full');
  });

  test('cn with all falsey arguments returns an empty string', () => {
    const result = cn(null, undefined, false, '');
    expect(result).toBe('');
  });

  test('formatDate correctly formats a 2026 date for India locale', () => {
    const result = formatDate('2026-06-21');
    // For en-IN locale, expect "21 Jun 2026" or similar format depending on local implementation.
    // It should contain 'Jun', '21' and '2026'.
    expect(result).toContain('Jun');
    expect(result).toContain('21');
    expect(result).toContain('2026');
  });

  test('formatDate returns original string on failure/invalid date format', () => {
    const invalid = 'not-a-date';
    const result = formatDate(invalid);
    expect(result).toBe(invalid);
  });
});
