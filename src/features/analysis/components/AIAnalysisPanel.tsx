import { Sparkles, AlertCircle } from 'lucide-react';
import type { AIAnalysisResult } from '../../../lib/types';
import MoodMeter from './MoodMeter';
import CopingCard from '../../coping/components/CopingCard';

interface AIAnalysisPanelProps {
  analysis: AIAnalysisResult;
  onExerciseCompleted: (improvedScore: number) => void;
}

export default function AIAnalysisPanel({ analysis, onExerciseCompleted }: AIAnalysisPanelProps) {
  const { moodScore, sentiment, triggers, summary, patterns, copingExercise, followUpMessage } = analysis;

  // Determine sentiment styling
  let sentimentStyle = 'text-indigo-700 bg-indigo-50 border-indigo-150';
  if (sentiment.includes('negative')) {
    sentimentStyle = 'text-rose-700 bg-rose-50 border-rose-150';
  } else if (sentiment.includes('positive')) {
    sentimentStyle = 'text-emerald-700 bg-emerald-50 border-emerald-150';
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
        <div className="md:col-span-2 bg-white/80 backdrop-blur-md border border-white/50 p-6 rounded-3xl flex flex-col justify-between shadow-xl shadow-zinc-200/40">
          <div>
            <div className="flex items-center justify-between gap-4 mb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4.5 w-4.5 text-indigo-600 animate-pulse-gentle" />
                <h3 className="font-bold text-slate-800 text-sm">Empathetic Stress Evaluation</h3>
              </div>
              <span className={`text-[10px] uppercase font-mono px-2.5 py-0.5 rounded-full border ${sentimentStyle}`}>
                {sentiment.replace('_', ' ')}
              </span>
            </div>

            <p className="text-slate-700 text-sm leading-relaxed mb-4">
              {summary}
            </p>

            {/* Trigger badging elements */}
            <div className="flex flex-wrap items-center gap-1.5 mt-3">
              <span className="text-[10px] uppercase font-mono text-slate-500 mr-2">Triggers scanned:</span>
              {triggers.map((trig, idx) => (
                <span
                  key={idx}
                  className="text-[10px] px-2.5 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-600 font-mono font-medium"
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
        <div className="bg-amber-50/90 border border-amber-200 rounded-2xl p-4 flex items-start gap-3 shadow-sm">
          <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5 animate-pulse-gentle" />
          <div>
            <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wider font-mono">
              Pattern Anomalies Detected
            </h4>
            <ul className="list-disc pl-4 mt-2 space-y-1">
              {patterns.map((pat, i) => (
                <li key={i} className="text-xs text-slate-705 leading-relaxed font-sans">
                  {pat}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Recommended stress coping section */}
      <div>
        <h3 className="text-xs font-mono uppercase tracking-wider text-slate-500 font-bold mb-3">
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
