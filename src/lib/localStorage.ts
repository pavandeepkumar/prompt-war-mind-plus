import type { JournalEntry } from './types';

const STORAGE_KEY = 'mindpulse_journal_entries';
const STREAK_KEY = 'mindpulse_journal_streak';
const LAST_ENTRY_DATE_KEY = 'mindpulse_last_entry_date';

export function getEntries(): JournalEntry[] {
  if (typeof window === 'undefined') return [];
  try {
    const data = window.localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveEntry(entry: JournalEntry): void {
  if (typeof window === 'undefined') return;
  try {
    const entries = getEntries();
    // Check if the entry already exists to avoid duplication
    if (!entries.some(e => e.id === entry.id)) {
      entries.push(entry);
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    }

    // Update streak
    const today = "2026-06-13"; // Pin to the current app system scenario date
    const lastDate = window.localStorage.getItem(LAST_ENTRY_DATE_KEY);
    
    if (lastDate !== today) {
      let streak = parseInt(window.localStorage.getItem(STREAK_KEY) || '0', 10);
      if (lastDate) {
        const last = new Date(lastDate);
        const current = new Date(today);
        const diff = Math.floor((current.getTime() - last.getTime()) / (1000 * 60 * 60 * 24));
        if (diff === 1) {
          streak++;
        } else if (diff > 1) {
          streak = 1;
        }
      } else {
        streak = 1;
      }
      window.localStorage.setItem(STREAK_KEY, streak.toString());
      window.localStorage.setItem(LAST_ENTRY_DATE_KEY, today);
    }
  } catch (err) {
    console.error('Failed to save journal entry in localStorage', err);
  }
}

export function getStreak(): number {
  if (typeof window === 'undefined') return 0;
  try {
    return parseInt(window.localStorage.getItem(STREAK_KEY) || '0', 10);
  } catch {
    return 0;
  }
}

export function clearEntries(): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
    window.localStorage.removeItem(STREAK_KEY);
    window.localStorage.removeItem(LAST_ENTRY_DATE_KEY);
  } catch (err) {
    console.error('Failed to clear localStorage', err);
  }
}

export function seedDemoEntries(): JournalEntry[] {
  const demoEntries: JournalEntry[] = [
    {
      id: 'demo-1',
      date: '2026-06-07',
      text: 'Scored 160 in today\'s Biology mock. Felt terrible. Couldn\'t solve the molecular genetics section at all. Everyone else seems to be improving but I\'m stuck. NEET re-exam is so close and I feel like everything I revised in April is lost.',
      moodScore: 3,
      triggers: ['Performance Anxiety', 'Comparison Trap', 'NEET Cancellation stress'],
      sentiment: 'negative',
      aiSummary: 'You are experiencing performance anxiety tied to mock test results and paper leak trauma. Peer comparison is amplifying your self-doubt.',
      copingExercise: 'Molecular Genetics Mind Map Reset',
    },
    {
      id: 'demo-2',
      date: '2026-06-09',
      text: 'Took a break in Kota tea-stall today. Went for a 30 min walk in the evening. Felt a bit better. Realized I\'ve been studying 14 hours straight for a week and drinking way too much chai. I need to stay hydrated and pace myself.',
      moodScore: 5,
      triggers: ['Kota isolation', 'Burnout Warning', 'Pacing Problems'],
      sentiment: 'neutral',
      aiSummary: 'A moment of positive self-realization — you identified burnout risks and toxic studying hours, and took a cooling active break.',
      copingExercise: '5-4-3-2-1 Sensory Walk Grounding',
    },
    {
      id: 'demo-3',
      date: '2026-06-11',
      text: 'Mock test was actually slightly better today. Scored 185! Still not quite at my ideal target of 210 for government colleges, but it is progress. Trying to suppress my fear about the Re-NEET leak investigations.',
      moodScore: 6,
      triggers: ['Cautious Optimism', 'Leak uncertainty', 'Target Pressure'],
      sentiment: 'neutral',
      aiSummary: 'You scored higher — that is real proof of progress. The anxiety over government cut-offs is heavy, but do not let it discount your biological memory.',
      copingExercise: 'CBT Cognitive Reframe on Exam Day Outcomes',
    }
  ];

  if (typeof window !== 'undefined') {
    try {
      const existing = getEntries();
      if (existing.length === 0) {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(demoEntries));
        window.localStorage.setItem(STREAK_KEY, '3');
        window.localStorage.setItem(LAST_ENTRY_DATE_KEY, '2026-06-11');
      }
    } catch (err) {
      console.error('Failed to seed demo entries', err);
    }
  }

  return demoEntries;
}
