export interface ExamDate {
  name: string;
  date: string;      // YYYY-MM-DD
  status: 'upcoming' | 'completed' | 'cancelled' | 're-exam';
  description: string;
}

export const examDates2026: ExamDate[] = [
  {
    name: "NEET 2026 (Original)",
    date: "2026-05-03",
    status: "cancelled",
    description: "Original NEET exam — cancelled due to investigations"
  },
  {
    name: "NEET Re-Exam 2026",
    date: "2026-06-21",
    status: "re-exam",
    description: "Re-examination scheduled post paper-leak inquiry"
  },
  {
    name: "JEE Main 2026 Session 1",
    date: "2026-01-21",
    status: "completed",
    description: "First session of Joint Entrance Examination"
  },
  {
    name: "JEE Main 2026 Session 2",
    date: "2026-04-02",
    status: "completed",
    description: "Second session of Joint Entrance Examination"
  },
  {
    name: "JEE Advanced 2026",
    date: "2026-05-17",
    status: "completed",
    description: "JEE Advanced examination"
  },
  {
    name: "CUET 2026",
    date: "2026-05-15",
    status: "completed",
    description: "Common University Entrance Test"
  },
  {
    name: "UPSC Prelims 2026",
    date: "2026-06-28",
    status: "upcoming",
    description: "UPSC Civil Services Preliminary Examination"
  },
  {
    name: "GATE 2026",
    date: "2026-02-07",
    status: "completed",
    description: "Graduate Aptitude Test in Engineering"
  }
];

export function getDaysUntilExam(dateStr: string): number {
  const exam = new Date(dateStr);
  const today = new Date("2026-06-13T00:28:00"); // Grounded to simulated local time (June 13, 2026)
  exam.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  const diff = exam.getTime() - today.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export function getNextExam(): ExamDate | null {
  const upcoming = examDates2026.filter(e => e.status === 'upcoming' || e.status === 're-exam');
  upcoming.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  return upcoming[0] || null;
}
