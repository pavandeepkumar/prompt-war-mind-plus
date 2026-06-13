import { useEffect, useState, useMemo } from 'react';
import Header from './features/common/components/Header';
import APIKeySetup from './features/setup/components/APIKeySetup';
import JournalPanel from './features/journal/components/JournalPanel';
import AIAnalysisPanel from './features/analysis/components/AIAnalysisPanel';
import MoodTimeline from './features/insights/components/MoodTimeline';
import WeeklyInsights from './features/insights/components/WeeklyInsights';
import ExamCountdown from './features/exams/components/ExamCountdown';
import CompanionChat from './features/chat/components/CompanionChat';
import type { JournalEntry, AIAnalysisResult } from './lib/types';
import { getEntries, getStreak, saveEntry, seedDemoEntries, clearEntries } from './lib/localStorage';
import { verifyConfig, analyzeStress } from './api/apiService';
import { 
  Brain, 
  Sparkles, 
  Trash2, 
  MessageSquare, 
  BookOpen, 
  BarChart3, 
  Calendar, 
  Crown, 
  ChevronRight, 
  CheckCircle, 
  Compass, 
  ChevronLeft 
} from 'lucide-react';

export default function App() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [streak, setStreak] = useState(0);
  const [exercisesDone, setExercisesDone] = useState(3);

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [activeAnalysis, setActiveAnalysis] = useState<AIAnalysisResult | null>(null);

  // Active view tab state (default: Chat Companion to immediately showcase conversational AI)
  const [activeTab, setActiveTab] = useState<'chat' | 'journal' | 'stats' | 'calendar'>('chat');

  // API Key validation toggles
  const [apiConfigured, setApiConfigured] = useState(false);
  const [showApiWarning, setShowApiWarning] = useState(true);

  // Load state on mount
  useEffect(() => {
    verifyConfig()
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

    setStreak(getStreak() || 4);
  }, []);

  // Action: Analyze Journal entries
  const handleAnalyze = async (text: string) => {
    setIsAnalyzing(true);
    setAnalysisError(null);

    if (!apiConfigured) {
      setTimeout(() => {
        const mockResponse: AIAnalysisResult = {
          moodScore: text.toLowerCase().includes('sleep') ? 4 : text.toLowerCase().includes('mock') ? 3 : 5,
          sentiment: 'negative',
          triggers: text.toLowerCase().includes('mock') ? ['Failed Mock Score', 'Parental Expectation'] : ['Academic Burnout', 'Kota Loneliness'],
          summary: `AI Companion Diagnostic: Your journal entry reflects deep physical cortisol tension tie-ins. The vocabulary you chose conveys high burnout risk. Standard trackers overlook these somatic locks, but MindPulse suggests instant vagal focus.`,
          patterns: [
            "Stress spikes 2.1x on weekly mock calendar iterations.",
            "Subconscious parental performance guilt is inducing insomnia."
          ],
          copingExercise: {
            name: "Bilateral Eye Grounding & Alternate Nostril Breathing",
            description: "A calming alternate pranayama pattern to soothe spatial muscle triggers and lower anxiety.",
            steps: [
              "Exhale fully, then cover your right nostril with your thumb.",
              "Inhale gently through your left nostril for a count of 4.",
              "Close both nostrils and hold the breath for a count of 4.",
              "Release the right nostril and exhale calmly for a count of 6.",
              "Repeat back-and-forth for 5 total visual cycles."
            ],
            duration: 120,
            category: "Grounding",
            rationale: "Pranayama immediately drops active adrenaline spikes and resets hand steadiness."
          },
          followUpMessage: "Your test results don't define your ultimate worth. Inhale focus, exhale the cloud."
        };

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
      const parsedAnalysis = await analyzeStress(text, entries);

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
    
    if (entries.length > 0) {
      const updated = [...entries];
      const lastIndex = updated.length - 1;
      updated[lastIndex].moodScore = improvedScore;
      
      window.localStorage.setItem('mindpulse_journal_entries', JSON.stringify(updated));
      setEntries(updated);

      if (activeAnalysis) {
        setActiveAnalysis({
          ...activeAnalysis,
          moodScore: improvedScore,
          followUpMessage: "Somatic state shifted beautifully! Your stress index has been recorded as tranquil."
        });
      }
    }
  };

  const handleResetSimulation = () => {
    if (confirm("Reset student state cache? All custom logs will revert to standard NEET competitive exam demo entries.")) {
      clearEntries();
      const seeded = seedDemoEntries();
      setEntries(seeded);
      setStreak(4);
      setExercisesDone(3);
      setActiveAnalysis(null);
    }
  };

  return (
    <div 
      className="min-h-screen text-slate-700 font-sans flex flex-col md:flex-row relative overflow-x-hidden" 
      id="applet-viewport-root"
      style={{
        backgroundImage: 'linear-gradient(135deg, #bbf7ec 0%, #fef08a 50%, #fed7aa 100%)'
      }}
    >
      
      {/* 1. Left Sidebar Navigation Column (Matches image typography and visual style) */}
      <aside className="w-full md:w-80 border-r border-white/40 bg-white/60 backdrop-blur-md p-6 flex flex-col justify-between shrink-0 md:h-screen md:overflow-y-auto shadow-2xl shadow-indigo-100/10 z-20">
        <div className="space-y-6">
          {/* Main Brand with Gradient Icon */}
          <div className="flex items-center gap-3.5 py-1" id="sidebar-logo">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-500 via-pink-500 to-amber-500 flex items-center justify-center text-white shrink-0 shadow-lg shadow-rose-500/15 animate-pulse-gentle">
              <Brain className="w-5.5 h-5.5" />
            </div>
            <div>
              <span className="text-slate-800 font-bold tracking-tight text-base flex items-center gap-1.5">
                MindPulse AI
                <span className="text-[9px] text-[#f43f5e] font-bold font-mono tracking-normal capitalize px-1.5 py-0.5 bg-rose-50 border border-rose-100 rounded-full animate-pulse-gentle">
                  v2.0
                </span>
              </span>
              <p className="text-[10px] text-slate-500 font-bold font-mono">Exam Stress Defense Companion</p>
            </div>
          </div>

          {/* Quick Stats Indicator Bar */}
          <div className="bg-white/80 border border-white rounded-2xl p-3 flex items-center justify-between text-xs font-mono shadow-sm">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-bold text-slate-600">Aura Live State</span>
            </div>
            <span className="text-indigo-600 font-bold">Secure Proxy</span>
          </div>

          {/* Navigation Pill Lists */}
          <nav className="space-y-1.5" id="sidebar-navigation">
            <div className="text-[9px] font-mono font-bold uppercase tracking-widest text-slate-400 mb-2.5 px-3">
              Core Workspace
            </div>
            
            <button
              id="tab-btn-chat"
              onClick={() => setActiveTab('chat')}
              className={`w-full py-3 px-4 rounded-2xl font-semibold text-xs tracking-wide flex items-center gap-3 transition-all cursor-pointer ${
                activeTab === 'chat'
                  ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/20 translate-x-1'
                  : 'text-slate-600 hover:text-slate-800 hover:bg-white/40'
              }`}
              aria-label="Toggle AI stress companion live chat"
            >
              <MessageSquare className="h-4 w-4" />
              <span>Empathetic Companion Chat</span>
            </button>

            <button
              id="tab-btn-journal"
              onClick={() => setActiveTab('journal')}
              className={`w-full py-3 px-4 rounded-2xl font-semibold text-xs tracking-wide flex items-center gap-3 transition-all cursor-pointer ${
                activeTab === 'journal'
                  ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/20 translate-x-1'
                  : 'text-slate-600 hover:text-slate-800 hover:bg-white/40'
              }`}
              aria-label="Toggle open stress journal submission feed"
            >
              <BookOpen className="h-4 w-4" />
              <span>My Stress Journal</span>
            </button>

            <button
              id="tab-btn-stats"
              onClick={() => setActiveTab('stats')}
              className={`w-full py-3 px-4 rounded-2xl font-semibold text-xs tracking-wide flex items-center gap-3 transition-all cursor-pointer ${
                activeTab === 'stats'
                  ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/20 translate-x-1'
                  : 'text-slate-600 hover:text-slate-800 hover:bg-white/40'
              }`}
              aria-label="Toggle longitudinal somatic mood graphs"
            >
              <BarChart3 className="h-4 w-4" />
              <span>Somatic Statistics</span>
            </button>

            <button
              id="tab-btn-calendar"
              onClick={() => setActiveTab('calendar')}
              className={`w-full py-3 px-4 rounded-2xl font-semibold text-xs tracking-wide flex items-center gap-3 transition-all cursor-pointer ${
                activeTab === 'calendar'
                  ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/20 translate-x-1'
                  : 'text-slate-600 hover:text-slate-800 hover:bg-white/40'
              }`}
              aria-label="Toggle competitive exam countdown trackers"
            >
              <Calendar className="h-4 w-4" />
              <span>Competitive Tracker</span>
            </button>
          </nav>
        </div>

        {/* MindPulse Pro Upgrade Promo - matching the red/pink bento box at the bottom of the left column */}
        <div className="space-y-4 pt-6 border-t border-slate-200/40">
          <div className="bg-gradient-to-br from-rose-50 to-orange-50/50 border border-rose-100 rounded-3xl p-4.5 text-xs shadow-md relative overflow-hidden group">
            <div className="absolute -top-12 -right-12 w-28 h-28 bg-rose-200/25 rounded-full blur-xl" />
            <div className="flex items-center gap-1 text-[#f43f5e] font-bold font-mono text-[9px] uppercase tracking-wider mb-1">
              <Crown className="h-3 w-3 animate-pulse-gentle" />
              <span>MindPulse Pro</span>
            </div>
            <p className="font-bold text-slate-800 text-xs mb-1">Unlock AI Stress Coach</p>
            <p className="text-slate-500 text-[10px] leading-relaxed mb-3">Get 24/7 hyper-personalized CBT revision plans and real-time mock exam simulations.</p>
            <button 
              onClick={() => alert("MindPulse Pro is in simulator preview. Full updates will integrate live Kota and Delhi center counselor support lines.")}
              className="w-full bg-[#f43f5e] hover:bg-rose-600 text-white rounded-xl py-2 px-3.5 font-bold transition-all text-[11px] flex items-center justify-between shadow-md shadow-rose-500/10 cursor-pointer"
            >
              <span>Upgrade Now</span>
              <ChevronRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Reset button at footer */}
          <button
            onClick={handleResetSimulation}
            className="w-full py-2.5 px-3 bg-white/40 hover:bg-rose-50 text-slate-500 hover:text-rose-600 border border-slate-200/30 font-mono text-[9px] uppercase font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            id="reset-cache-button"
          >
            <Trash2 className="h-3 w-3" />
            Reset student state
          </button>
        </div>
      </aside>

      {/* 2. Central Active View Panel - Glassmorphic bento block with soft white background */}
      <main className="flex-1 flex flex-col md:h-screen md:overflow-y-auto" id="main-content">
        {/* Header strip */}
        <Header streak={streak} />

        <div className="p-4 md:p-6 lg:p-8 flex-1 max-w-4xl w-full mx-auto space-y-6 pb-16">
          
          {/* Real-time configuration state helper banner */}
          {!apiConfigured && showApiWarning && (
            <APIKeySetup onDismiss={() => setShowApiWarning(false)} />
          )}

          {/* Render Active View Tab conditionally */}
          <div>
            {activeTab === 'chat' && (
              <div className="animate-fade-in">
                <div className="mb-4">
                  <h2 className="text-lg font-bold text-slate-800 tracking-tight">Digital Stress Companion</h2>
                  <p className="text-xs text-slate-500">24/7 always-available dialogue with Aura to vent and receive grounding hacks.</p>
                </div>
                <CompanionChat apiConfigured={apiConfigured} />
              </div>
            )}

            {activeTab === 'journal' && (
              <div className="space-y-6 animate-fade-in" id="journal-view-panel">
                <div className="mb-2">
                  <h2 className="text-lg font-bold text-slate-800 tracking-tight">Open Journal Analysis</h2>
                  <p className="text-xs text-slate-500">Log open-ended self-reflections to extract diagnostic triggers missing in simple mood widgets.</p>
                </div>

                <JournalPanel 
                  onAnalyze={handleAnalyze} 
                  isAnalyzing={isAnalyzing} 
                  error={analysisError} 
                />

                {/* Display active analysis result immediately below the submitting panel */}
                {activeAnalysis ? (
                  <section id="ai-evaluation-results" aria-label="Somatic Diagnosis results" className="animate-slide-up border-t border-slate-200/40 pt-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Sparkles className="h-5 w-5 text-indigo-600 animate-pulse-gentle" />
                      <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider font-mono">MindPulse Diagnosis</h3>
                    </div>
                    
                    <AIAnalysisPanel 
                      analysis={activeAnalysis} 
                      onExerciseCompleted={handleExerciseCompleted} 
                    />
                  </section>
                ) : (
                  <div className="p-8 border border-dashed border-slate-300 bg-white/40 rounded-3xl text-center space-y-2">
                    <Compass className="h-8 w-8 text-slate-400 mx-auto animate-pulse-gentle" />
                    <h3 className="text-sm font-bold text-slate-700">Analytical Trajectory Awaiting Entry</h3>
                    <p className="text-xs text-slate-500 max-w-md mx-auto">
                      Submit an open-ended journaling passage above. Once processed, Aura's custom cognitive model returns coping exercises and sub-conscious somatic patterns here.
                    </p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'stats' && (
              <div className="space-y-6 animate-fade-in" id="stats-view-panel">
                <div className="mb-2">
                  <h2 className="text-lg font-bold text-slate-800 tracking-tight">Somatic Statistics Board</h2>
                  <p className="text-xs text-slate-500">Bi-directional progress charts computed from open log processing history.</p>
                </div>

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
              </div>
            )}

            {activeTab === 'calendar' && (
              <div className="space-y-6 animate-fade-in" id="calendar-view-panel">
                <div className="mb-2">
                  <h2 className="text-lg font-bold text-slate-800 tracking-tight">Competitive Exam Calendar</h2>
                  <p className="text-xs text-slate-500">Live countdown counters and test calendars compiled according to national regulatory timetables.</p>
                </div>

                <div className="bg-white/80 backdrop-blur-md border border-white/50 rounded-3xl p-6 shadow-xl shadow-zinc-200/40">
                  <ExamCountdown />
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* 3. Right-Hand Column: Emotional Trajectory History logs (Matches image perfectly) */}
      <aside className="hidden xl:flex w-80 shrink-0 border-l border-white/40 bg-white/60 backdrop-blur-md p-6 flex-col gap-6 h-screen overflow-y-auto z-10">
        <div className="border-b border-rose-100 pb-3">
          <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest">Trajectory Logs</h3>
          <p className="text-[10px] text-[#f43f5e] font-mono mt-0.5 font-bold uppercase">{entries.length} of 30 days filed</p>
        </div>

        <div className="space-y-3">
          {entries.map((item) => {
            // Emojis based on typical competitive student context
            let emoji = "💡";
            if (item.moodScore && item.moodScore <= 3) emoji = "🌀"; // Extreme crash
            else if (item.moodScore && item.moodScore <= 6) emoji = "⚡"; // heavy study fatigue
            else emoji = "🌱"; // comfortable / serene
            
            if (item.text.toLowerCase().includes('sleep') || item.text.toLowerCase().includes('insomnia')) emoji = "🌙";
            if (item.text.toLowerCase().includes('mock') || item.text.toLowerCase().includes('score')) emoji = "📝";
            if (item.text.toLowerCase().includes('parent') || item.text.toLowerCase().includes('family')) emoji = "👨‍👩";
            if (item.text.toLowerCase().includes('chemistry')) emoji = "🧪";
            if (item.text.toLowerCase().includes('biology')) emoji = "🧬";

            const preview = item.text.length > 28 ? item.text.slice(0, 28) + '...' : item.text;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setActiveAnalysis({
                    moodScore: item.moodScore || 5,
                    sentiment: item.sentiment || 'negative',
                    triggers: item.triggers || ["Academic Stress"],
                    summary: item.aiSummary || `Reviewing entry from ${item.date}: "${item.text}"`,
                    patterns: [
                      "Somatic stress peaks correlated with close-up mock rehearsals.",
                      "Environmental exhaustion recorded from midnight study logs."
                    ],
                    copingExercise: {
                      name: item.copingExercise || "Vagal Re-anchor Breathing",
                      description: "A fast, 60-second breathing script to lower adrenaline load.",
                      steps: [
                        "Exhale heavily.",
                        "Inhale slowly for a count of 4.",
                        "Hold and relax your shoulders for 4.",
                        "Exhale slowly like a sigh for 6 counts."
                      ],
                      duration: 60,
                      category: "Grounding",
                      rationale: "Vagotonic simulation calms pre-test micro-shakes."
                    },
                    followUpMessage: "Restoring state from historical ledger logs. Inhale calmness, exhale expectations."
                  });
                  // Jump straight to journal panel where analysis outputs are showcased!
                  setActiveTab('journal');
                }}
                className={`w-full p-4 rounded-3xl border text-left transition-all hover:bg-white hover:border-rose-200 hover:shadow-lg hover:scale-102 cursor-pointer group flex items-start gap-3.5 ${
                  activeAnalysis?.summary === item.aiSummary
                    ? 'border-[#f43f5e] bg-white shadow-md shadow-rose-500/5'
                    : 'border-white/40 bg-white/40'
                }`}
              >
                <div className="text-xl shrink-0">{emoji}</div>
                <div className="overflow-hidden">
                  <h4 className="text-xs font-bold text-slate-800 line-clamp-1 group-hover:text-rose-600 transition-colors">
                    {preview}
                  </h4>
                  <div className="flex items-center gap-1.5 mt-1.5 font-mono text-[9px] text-slate-400 font-medium">
                    <span>{item.date}</span>
                    <span>•</span>
                    <span className={`font-bold ${
                      (item.moodScore || 5) <= 3 ? 'text-rose-650' : (item.moodScore || 5) <= 6 ? 'text-amber-600' : 'text-emerald-600'
                    }`}>
                      {item.moodScore}/10 Score
                    </span>
                  </div>
                </div>
              </button>
            );
          })}

          {entries.length === 0 && (
            <div className="text-center p-8 bg-white/20 border border-dashed border-slate-200 rounded-3xl">
              <span className="text-[10px] text-slate-450 font-mono">Trajectory ledger is empty.</span>
            </div>
          )}
        </div>
      </aside>
    </div>
  );
}
