export interface JournalEntry {
  id: string;
  date: string;
  text: string;
  moodScore: number | null;     // 1-10, calculated after AI analysis
  triggers: string[];           // Detected by AI
  sentiment: 'very_negative' | 'negative' | 'neutral' | 'positive' | 'very_positive';
  aiSummary: string;            // Gemini-generated emotional summary
  copingExercise: string;       // AI-generated personalized coping suggestion
}

export interface AIAnalysisResult {
  moodScore: number;            // 1-10
  sentiment: string;
  triggers: string[];
  summary: string;              // Empathetic 2-3 sentence summary
  patterns: string[];           // Hidden patterns detected across entries
  copingExercise: {
    name: string;
    description: string;
    steps: string[];
    duration: number;           // seconds
    category: string;
    rationale: string;          // Why this exercise was chosen
  };
  followUpMessage: string;      // Post-exercise encouraging message
}

export interface StudentProfile {
  name: string;
  age: number;
  examType: string;
  city: string;
  daysUntilExam: number;
  journalStreak: number;
}
