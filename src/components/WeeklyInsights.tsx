import { Flame, Brain, HelpCircle, Activity, Lightbulb } from 'lucide-react';
import type { JournalEntry } from '../lib/types';
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
        <div className="bg-zinc-900/40 border border-zinc-800 p-4 rounded-2xl flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-mono text-zinc-500 tracking-wider">Logging Habit</span>
            <Flame className="h-4 w-4 text-orange-500 animate-pulse-gentle" />
          </div>
          <div className="mt-4">
            <h4 className="text-2xl font-black font-mono text-white leading-none">
              {streak} <span className="text-xs font-normal text-zinc-400">Days</span>
            </h4>
            <p className="text-[10px] text-zinc-500 mt-1">Consistent self-tracking</p>
          </div>
        </div>

        {/* Avg Mood card */}
        <div className="bg-zinc-900/40 border border-zinc-800 p-4 rounded-2xl flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-mono text-zinc-500 tracking-wider">Average Coping</span>
            <Activity className="h-4 w-4 text-indigo-400" />
          </div>
          <div className="mt-4">
            <h4 className="text-2xl font-black font-mono text-white leading-none">
              {averageMood} <span className="text-xs font-normal text-zinc-400">/ 10</span>
            </h4>
            <p className="text-[10px] text-zinc-500 mt-1">Emotional stress average</p>
          </div>
        </div>

        {/* Top Trigger Card */}
        <div className="bg-zinc-900/40 border border-[#27272a] p-4 rounded-2xl col-span-2 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-mono text-zinc-500 tracking-wider">Top Emotional Stimulus</span>
            <Brain className="h-4 w-4 text-[#8b5cf6]" />
          </div>
          <div className="mt-3">
            <h4 className="text-base font-bold text-white truncate">
              {topTrigger}
            </h4>
            <p className="text-[10px] text-zinc-500 mt-0.5">
              Detected in {triggerCount} journal {triggerCount === 1 ? 'submission' : 'submissions'}
            </p>
          </div>
        </div>

        {/* Coping Exercises Done */}
        <div className="bg-zinc-900/40 border border-[#27272a] p-4 rounded-xl col-span-2 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Lightbulb className="h-4 w-4" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-mono text-zinc-500 tracking-wider block">Completed Exercises</span>
              <span className="text-xs font-bold text-zinc-200">
                {exercisesDone} Restorative Breathing / CBT
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* AI Behavioral Diagnostic Pattern Callout */}
      <div className="bg-indigo-950/20 border border-indigo-900/30 rounded-2xl p-4">
        <h4 className="text-xs font-bold text-indigo-300 flex items-center gap-1.5 uppercase font-mono tracking-wider">
          <Lightbulb className="h-3.5 w-3.5" />
          Longitudinal Stress Insights
        </h4>
        <p className="text-xs text-zinc-300 mt-2 leading-relaxed">
          {entries.length < 3 
            ? 'Complete at least 3 journal assessments to extract predictive stress curves over high stakes calendars.'
            : 'Pre-study stress levels typically surge in direct proportion to your NEET mock tests. Breaking late sessions with 2-minute cooling routines is proven to lock spatial study retention.'}
        </p>
      </div>

    </div>
  );
}
