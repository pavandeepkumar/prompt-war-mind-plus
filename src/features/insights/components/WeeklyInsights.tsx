import { Flame, Brain, Activity, Lightbulb } from 'lucide-react';
import type { JournalEntry } from '../../../lib/types';
import { useMemo } from 'react';

interface WeeklyInsightsProps {
  entries: JournalEntry[];
  streak: number;
  exercisesDone: number;
}

export default function WeeklyInsights({ entries, streak, exercisesDone }: WeeklyInsightsProps) {
  
  // Calculate stats dynamically from entries
  const { averageMood, topTrigger, triggerCount } = useMemo(() => {
    const scoredEntries = entries.filter(e => e.moodScore !== null);
    if (scoredEntries.length === 0) {
      return { averageMood: 5.0, topTrigger: 'None Recorded', triggerCount: 0 };
    }

    const sum = scoredEntries.reduce((acc, current) => acc + (current.moodScore || 0), 0);
    const avg = parseFloat((sum / scoredEntries.length).toFixed(1));

    // Calculate triggers prevalence
    const counts: Record<string, number> = {};
    scoredEntries.forEach(entry => {
      (entry.triggers || []).forEach(trigger => {
        counts[trigger] = (counts[trigger] || 0) + 1;
      });
    });

    let top = 'None Recorded';
    let maxCount = 0;
    Object.entries(counts).forEach(([trigger, count]) => {
      if (count > maxCount) {
        maxCount = count;
        top = trigger;
      }
    });

    return { averageMood: avg, topTrigger: top, triggerCount: maxCount };
  }, [entries]);

  return (
    <div className="space-y-6" id="weekly-insights-container">
      
      {/* 2x2 grid of metrics cards */}
      <div className="grid grid-cols-2 gap-4">
        
        {/* Streak card */}
        <div className="bg-white/80 backdrop-blur-md border border-white/50 p-4 rounded-2xl shadow-xl shadow-zinc-200/30 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-mono text-slate-500 tracking-wider">Logging Habit</span>
            <Flame className="h-4 w-4 text-orange-500 animate-pulse-gentle" />
          </div>
          <div className="mt-4">
            <h4 className="text-2xl font-black font-mono text-slate-800 leading-none">
              {streak} <span className="text-xs font-normal text-slate-500">Days</span>
            </h4>
            <p className="text-[10px] text-slate-500 mt-1">Consistent self-tracking</p>
          </div>
        </div>

        {/* Avg Mood card */}
        <div className="bg-white/80 backdrop-blur-md border border-white/50 p-4 rounded-2xl shadow-xl shadow-zinc-200/30 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-mono text-slate-500 tracking-wider">Average Coping</span>
            <Activity className="h-4 w-4 text-indigo-600" />
          </div>
          <div className="mt-4">
            <h4 className="text-2xl font-black font-mono text-slate-800 leading-none">
              {averageMood} <span className="text-xs font-normal text-slate-500">/ 10</span>
            </h4>
            <p className="text-[10px] text-slate-500 mt-1">Emotional stress average</p>
          </div>
        </div>

        {/* Top Trigger Card */}
        <div className="bg-white/80 backdrop-blur-md border border-white/50 p-4 rounded-2xl shadow-xl shadow-zinc-200/30 col-span-2 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-mono text-slate-500 tracking-wider">Top Emotional Stimulus</span>
            <Brain className="h-4 w-4 text-purple-600" />
          </div>
          <div className="mt-3">
            <h4 className="text-base font-bold text-slate-850 truncate">
              {topTrigger}
            </h4>
            <p className="text-[10px] text-slate-500 mt-0.5">
              Detected in {triggerCount} journal {triggerCount === 1 ? 'submission' : 'submissions'}
            </p>
          </div>
        </div>

        {/* Coping Exercises Done */}
        <div className="bg-emerald-50/90 border border-emerald-100 p-4 rounded-2xl shadow-sm col-span-2 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-emerald-150 border border-emerald-200 flex items-center justify-center text-emerald-700 shadow-sm shrink-0">
              <Lightbulb className="h-4 w-4" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-mono text-emerald-800 tracking-wider block font-bold">Completed Exercises</span>
              <span className="text-xs font-bold text-emerald-950">
                {exercisesDone} Restorative Breathing / CBT
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* AI Behavioral Diagnostic Pattern Callout */}
      <div className="bg-indigo-50/90 border border-indigo-100 rounded-2xl p-4 shadow-sm">
        <h4 className="text-xs font-bold text-indigo-900 flex items-center gap-1.5 uppercase font-mono tracking-wider">
          <Lightbulb className="h-3.5 w-3.5" />
          Longitudinal Stress Insights
        </h4>
        <p className="text-xs text-slate-700 mt-2 leading-relaxed">
          {entries.length < 3 
            ? 'Complete at least 3 journal assessments to extract predictive stress curves over high stakes calendars.'
            : 'Pre-study stress levels typically surge in direct proportion to your NEET mock tests. Breaking late sessions with 2-minute cooling routines is proven to lock spatial study retention.'}
        </p>
      </div>

    </div>
  );
}
