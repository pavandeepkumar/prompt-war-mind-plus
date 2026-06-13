import { useEffect, useState, useCallback, useMemo } from 'react';
import Header from './components/Header';
import APIKeySetup from './components/APIKeySetup';
import JournalPanel from './components/JournalPanel';
import AIAnalysisPanel from './components/AIAnalysisPanel';
import MoodTimeline from './components/MoodTimeline';
import WeeklyInsights from './components/WeeklyInsights';
import ExamCountdown from './components/ExamCountdown';
import type { JournalEntry, AIAnalysisResult } from './lib/types';
import { getEntries, getStreak, saveEntry, seedDemoEntries, clearEntries } from './lib/localStorage';
import { Brain, Sparkles, RefreshCw, AlertCircle, CheckCircle, Trash2 } from 'lucide-react';

export default function App() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [streak, setStreak] = useState(0);
  const [exercisesDone, setExercisesDone] = useState(3); // start with a small counter of positive exercises

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [activeAnalysis, setActiveAnalysis] = useState<AIAnalysisResult | null>(null);

  // API Key validation toggles
  const [apiConfigured, setApiConfigured] = useState(false);
  const [showApiWarning, setShowApiWarning] = useState(true);

  // Load state on mount
  useEffect(() => {
    // Check if server is declared with key
    fetch('/api/verify-config')
      .then((res) => res.json())
      .then((data) => {
        setApiConfigured(data.apiConfigured);
      })
      .catch(() => {
        setApiConfigured(false);
      });

    // Seed mock entries into local cache if empty
    const cachedEntries = getEntries();
    if (cachedEntries.length === 0) {
      const seeded = seedDemoEntries();
      setEntries(seeded);
    } else {
      setEntries(cachedEntries);
    }

    setStreak(getStreak() || 3);
  }, []);

  // Action: Analyze Journal entries
  const handleAnalyze = async (text: string) => {
    setIsAnalyzing(true);
    setAnalysisError(null);

    // If key not configured, trigger a simulated simulation so user still gets an interactive offline test
    if (!apiConfigured) {
      setTimeout(() => {
        const mockResponse: AIAnalysisResult = {
          moodScore: text.toLowerCase().includes('sleep') ? 4 : 5,
          sentiment: 'negative',
          triggers: ['Exams Stress', 'Sleep Deprivation', 'Delhi Extreme Humidity'],
          summary: `Mock AI Diagnostic: Your entry reflects deep physical tension and stress tied directly to upcoming exams. The words "${text.slice(0, 15)}..." showcase sleep friction which locks cognitive recall.`,
          patterns: [
            "Your stress spikes heavily 2-3 days prior to your mock exams.",
            "Excessive chai/caffeine intake is inducing physical fatigue."
          ],
          copingExercise: {
            name: "4-7-8 Breathing for Pre-Exam Panic",
            description: "A restorative pranayama routine to stimulate the vagus nerve and slow down spatial hand tremor.",
            steps: [
              "Exhale completely through your mouth, making a whoosh sound.",
              "Close your mouth and inhale quietly through your nose to a mental count of 4.",
              "Hold your breath for a mental count of 7.",
              "Exhale completely through your mouth, making a whoosh sound to a count of 8.",
              "Repeat this visual loop for 4 complete breath cycles."
            ],
            duration: 90,
            category: "Breathing",
            rationale: "Somatic breathing activates parasympathetic control within 60 seconds."
          },
          followUpMessage: "Every tiny step of peace counts towards your ultimate potential. Inhale stillness, exhale doubt."
        };

        // Create new Journal entry object
        const newEntry: JournalEntry = {
          id: `entry-${Date.now()}`,
          date: new Date().toISOString().split('T')[0],
          text,
          moodScore: mockResponse.moodScore,
          triggers: mockResponse.triggers,
          sentiment: 'negative',
          aiSummary: mockResponse.summary,
          copingExercise: mockResponse.copingExercise.name
        };

        saveEntry(newEntry);
        setEntries(getEntries());
        setStreak(getStreak());
        setActiveAnalysis(mockResponse);
        setIsAnalyzing(false);
      }, 2000);
      return;
    }

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          journalText: text,
          previousEntries: entries,
          city: 'Delhi'
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Gemini server overloaded. Try again soon.');
      }

      const parsedAnalysis: AIAnalysisResult = await response.json();

      // Log entry to localStorage
      const newEntry: JournalEntry = {
        id: `entry-${Date.now()}`,
        date: new Date().toISOString().split('T')[0],
        text,
        moodScore: parsedAnalysis.moodScore,
        triggers: parsedAnalysis.triggers,
        sentiment: parsedAnalysis.sentiment as any,
        aiSummary: parsedAnalysis.summary,
        copingExercise: parsedAnalysis.copingExercise.name
      };

      saveEntry(newEntry);
      setEntries(getEntries());
      setStreak(getStreak());
      setActiveAnalysis(parsedAnalysis);
    } catch (err: any) {
      console.error('Analysis failed:', err.message);
      setAnalysisError(err.message || 'Gemini processing failed. Check network stability.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Action: completed coping routine
  const handleExerciseCompleted = (improvedScore: number) => {
    setExercisesDone((prev) => prev + 1);
    
    // Modify the last logged entry with the upgraded tranquility score
    if (entries.length > 0) {
      const updated = [...entries];
      // Search for the last element
      const lastIndex = updated.length - 1;
      updated[lastIndex].moodScore = improvedScore;
      
      // Save it back to local storage
      window.localStorage.setItem('mindpulse_journal_entries', JSON.stringify(updated));
      setEntries(updated);

      // Mutate active analysis so the main widget shows the tranquil transition update
      if (activeAnalysis) {
        setActiveAnalysis({
          ...activeAnalysis,
          moodScore: improvedScore,
          followUpMessage: "Splendid somatic shift! Your stress state logged an incremental rise into comfort."
        });
      }
    }
  };

  const handleResetSimulation = () => {
    if (confirm("Reset clinical student state cache? All custom logs will revert to Kota demo entries.")) {
      clearEntries();
      const seeded = seedDemoEntries();
      setEntries(seeded);
      setStreak(3);
      setExercisesDone(3);
      setActiveAnalysis(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-400 font-sans flex flex-col md:flex-row relative overflow-x-hidden" id="applet-viewport-root">
      
      {/* Sidebar Navigation & Environmental Analytics */}
      <aside className="w-full md:w-80 border-r border-zinc-800 bg-[#09090b] p-6 flex flex-col gap-6 shrink-0 md:h-screen md:overflow-y-auto">
        
        {/* Main Branding bar */}
        <div className="flex items-center gap-3 py-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shrink-0 shadow-lg shadow-indigo-500/10">
            <Brain className="w-5 h-5" />
          </div>
          <div>
            <span className="text-white font-bold tracking-tight text-lg flex items-center gap-1.5">
              MindPulse
              <span className="text-[10px] text-zinc-500 font-mono tracking-normal capitalize font-normal px-1 py-0.5 bg-zinc-800 rounded">
                AI Live
              </span>
            </span>
            <p className="text-[10px] text-zinc-500 font-mono">NEET Exam Stress Defense</p>
          </div>
        </div>

        {/* Real-time exam dates details */}
        <section aria-label="Competitive Exam Schedules">
          <ExamCountdown />
        </section>

        {/* Database Management Tools */}
        <div className="mt-auto pt-4 border-t border-zinc-800/60">
          <button
            onClick={handleResetSimulation}
            className="w-full py-2.5 px-4 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-rose-400 font-mono text-[10px] uppercase font-bold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer focus:outline-none focus:ring-1 focus:ring-rose-500"
            id="reset-cache-button"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Reset student memory
          </button>
        </div>
      </aside>

      {/* Main command feed screen block */}
      <main className="flex-1 flex flex-col md:h-screen md:overflow-y-auto" id="main-content">
        
        {/* Interactive Header tracking bar */}
        <Header streak={streak} />

        <div className="p-4 md:p-8 space-y-8 max-w-5xl w-full mx-auto pb-16">
          
          {/* Warn about Missing API keys cleanly */}
          {!apiConfigured && showApiWarning && (
            <APIKeySetup onDismiss={() => setShowApiWarning(false)} />
          )}

          {/* Core Longitudinal Timeline chart & Diagnosis Stat panels */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <MoodTimeline entries={entries} />
            </div>
            <div className="lg:col-span-1">
              <WeeklyInsights 
                entries={entries} 
                streak={streak} 
                exercisesDone={exercisesDone} 
              />
            </div>
          </div>

          {/* New Personal Journal Box */}
          <section id="journal-input" aria-label="Somatic Journal Box">
            <JournalPanel 
              onAnalyze={handleAnalyze} 
              isAnalyzing={isAnalyzing} 
              error={analysisError} 
            />
          </section>

          {/* Diagnostic outputs displays */}
          {activeAnalysis && (
            <section id="ai-evaluation-results" aria-label="Clinical AI Analysis Result" className="animate-fade-in border-t border-zinc-800 pt-8">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="h-5 w-5 text-indigo-400 animate-pulse-gentle" />
                <h3 className="text-base font-bold text-white">Dynamic AI Diagnosis</h3>
              </div>
              
              <AIAnalysisPanel 
                analysis={activeAnalysis} 
                onExerciseCompleted={handleExerciseCompleted} 
              />
            </section>
          )}

        </div>
      </main>
    </div>
  );
}
