import { expect, test, describe } from 'vitest';
import { getDaysUntilExam, getNextExam, examDates2026 } from './examDates';

describe('examDates utility logic', () => {
  test('correctly calculates days remaining until NEET re-exam on June 21, 2026 from June 13, 2026 base', () => {
    // 2026-06-21 is 8 days after simulated base 2026-06-13
    const days = getDaysUntilExam('2026-06-21');
    expect(days).toBe(8);
  });

  test('correctly calculates negative days for completed/past exams', () => {
    // Cuet is 2026-05-15, which is in the past
    const days = getDaysUntilExam('2026-05-15');
    expect(days).toBeLessThan(0);
  });

  test('correctly identifies the next scheduled high-stakes exam', () => {
    const nextExam = getNextExam();
    expect(nextExam).not.toBeNull();
    // NEET Re-exam scheduled for 2026-06-21 should be sorted before UPSC on 2026-06-28
    expect(nextExam?.name).toBe('NEET Re-Exam 2026');
  });

  test('examDates2026 config contains NEET Re-Exam 2026', () => {
    const neetReexam = examDates2026.find(e => e.status === 're-exam');
    expect(neetReexam).toBeDefined();
    expect(neetReexam?.date).toBe('2026-06-21');
  });
});
