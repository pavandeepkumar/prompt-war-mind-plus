import { expect, test, describe, beforeEach, vi } from 'vitest';
import { getEntries, saveEntry, getStreak, clearEntries, seedDemoEntries } from './localStorage';

describe('localStorage student journaling state persistence', () => {
  beforeEach(() => {
    // Mock local storage functionality
    const store: Record<string, string> = {};
    const mockLocalStorage = {
      getItem: vi.fn((key: string) => store[key] || null),
      setItem: vi.fn((key: string, value: string) => {
        store[key] = value;
      }),
      removeItem: vi.fn((key: string) => {
        delete store[key];
      }),
      clear: vi.fn(() => {
        Object.keys(store).forEach(key => delete store[key]);
      }),
    };

    vi.stubGlobal('window', {
      localStorage: mockLocalStorage,
    });
  });

  test('successfully retrieves empty entries list when store key is empty', () => {
    const entries = getEntries();
    expect(entries).toEqual([]);
  });

  test('correctly stores and retrieves a new student journal recording', () => {
    const sampleEntry = {
      id: 'test-journal-1',
      date: '2026-06-13',
      text: 'Trying my best to stay calm with only 8 days left for the NEET re-exam.',
      moodScore: 7,
      triggers: ['Stress'],
      sentiment: 'neutral' as const,
      aiSummary: 'Test summary',
      copingExercise: 'Deep Breath',
    };

    saveEntry(sampleEntry);
    
    const retrieved = getEntries();
    expect(retrieved.length).toBe(1);
    expect(retrieved[0].id).toBe('test-journal-1');
    expect(retrieved[0].text).toBe(sampleEntry.text);
  });

  test('correctly initializes streak configuration to zero initially', () => {
    expect(getStreak()).toBe(0);
  });

  test('clears current session and profile data correctly on demand', () => {
    const sampleEntry = {
      id: 'test-clear',
      date: '2026-06-13',
      text: 'Sample to clear out later.',
      moodScore: 5,
      triggers: [],
      sentiment: 'neutral' as const,
      aiSummary: 'Summary',
      copingExercise: 'Grounding',
    };

    saveEntry(sampleEntry);
    expect(getEntries().length).toBe(1);

    clearEntries();
    expect(getEntries().length).toBe(0);
    expect(getStreak()).toBe(0);
  });

  test('seeds default demo entries when database logs are empty', () => {
    const demo = seedDemoEntries();
    expect(demo.length).toBe(3);
    expect(getEntries().length).toBe(3);
    expect(getStreak()).toBe(3); // Demo seeds a 3-day continuous study cycle streak
  });
});
