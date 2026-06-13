import { Sparkles, Activity, BellRing, Target, AlertCircle } from 'lucide-react';
import type { AIAnalysisResult } from '../lib/types';
import MoodMeter from './MoodMeter';
import CopingCard from './CopingCard';

interface AIAnalysisPanelProps {
  analysis: AIAnalysisResult;
  onExerciseCompleted: (improvedScore: number) => void;
}

export default function AIAnalysisPanel({ analysis, onExerciseCompleted }: AIAnalysisPanelProps) {
  const { moodScore, sentiment, triggers, summary, patterns, copingExercise, followUpMessage } = analysis;

  // Determine sentiment styling
  let sentimentStyle = 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20';
  if (sentiment.includes('negative')) {
    sentimentStyle = 'text-rose-400 bg-rose-500/10 border-rose-500/20';
  } else if (sentiment.includes('positive')) {
    sentimentStyle = 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
  }

  return (
    <div className="space-y-6 animate-slide-up" id="ai-analysis-output-panel">
      
      {/* Visual Diagnostic Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left Column: Mood Gauge */}
        <div className="md:col-span-1">
          <MoodMeter score={moodScore} />
        </div>

        {/* Right Column: AI Summary insights */}
        <div className="md:col-span-2 bg-zinc-900/40 border border-zinc-800 p-6 rounded-3xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-4 mb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4.5 w-4.5 text-[#8b5cf6]" />
                <h3 className="font-bold text-gray-200 text-sm">Empathetic Stress Evaluation</h3>
              </div>
              <span className={`text-[10px] uppercase font-mono px-2.5 py-0.5 rounded-full border ${sentimentStyle}`}>
                {sentiment.replace('_', ' ')}
              </span>
            </div>

            <p className="text-zinc-200 text-sm leading-relaxed mb-4">
              {summary}
            </p>

            {/* Trigger badging elements */}
            <div className="flex flex-wrap items-center gap-1.5 mt-3">
              <span className="text-[10px] uppercase font-mono text-zinc-500 mr-2">Triggers scanned:</span>
              {triggers.map((trig, idx) => (
                <span
                  key={idx}
                  className="text-[10px] px-2.5 py-0.5 rounded bg-zinc-800/40 border border-zinc-700/60 text-zinc-300 font-mono"
                >
                  {trig}
                </span>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Recurrence anomaly warnings callout */}
      {patterns && patterns.length > 0 && (
        <div className="bg-amber-950/10 border border-amber-500/20 rounded-2xl p-4 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5 animate-pulse-gentle" />
          <div>
            <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider font-mono">
              Pattern Anomalies Detected
            </h4>
            <ul className="list-disc pl-4 mt-2 space-y-1">
              {patterns.map((pat, i) => (
                <li key={i} className="text-xs text-zinc-300 leading-relaxed font-sans">
                  {pat}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Recommended stress coping section */}
      <div>
        <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-500 font-bold mb-3">
          Deep Healing Intervention
        </h3>
        
        <CopingCard 
          exercise={copingExercise}
          followUpMessage={followUpMessage}
          onExerciseCompleted={onExerciseCompleted}
        />
      </div>

    </div>
  );
}
