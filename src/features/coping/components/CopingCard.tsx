import { useState } from 'react';
import { BrainCircuit, Play, X, Compass, CheckCircle2 } from 'lucide-react';
import type { AIAnalysisResult } from '../../../lib/types';
import CountdownTimer from './CountdownTimer';

interface CopingCardProps {
  exercise: AIAnalysisResult['copingExercise'];
  followUpMessage: string;
  onExerciseCompleted: (improvedScore: number) => void;
}

export default function CopingCard({ exercise, followUpMessage, onExerciseCompleted }: CopingCardProps) {
  const [showOverlay, setShowOverlay] = useState(false);
  const [exerciseState, setExerciseState] = useState<'idle' | 'running' | 'completed'>('idle');
  const [selectedImprovedScore, setSelectedImprovedScore] = useState<number | null>(null);

  const emojiMoods = [
    { emoji: '😰', label: 'Overwhelmed', score: 3 },
    { emoji: '😟', label: 'Anxious', score: 5 },
    { emoji: '😐', label: 'Stable', score: 6 },
    { emoji: '🙂', label: 'Better', score: 8 },
    { emoji: '😊', label: 'Serene', score: 9 },
  ];

  const handleTimerComplete = () => {
    setExerciseState('completed');
  };

  const handleMoodSubmit = () => {
    if (selectedImprovedScore !== null) {
      onExerciseCompleted(selectedImprovedScore);
      setSelectedImprovedScore(null);
      setExerciseState('idle');
      setShowOverlay(false);
    }
  };

  const handleClose = () => {
    setExerciseState('idle');
    setShowOverlay(false);
  };

  const handleStart = () => {
    setExerciseState('running');
    setShowOverlay(true);
  };

  return (
    <div className="bg-white/80 backdrop-blur-md border border-white/50 rounded-3xl p-6 shadow-xl shadow-zinc-200/45 flex flex-col justify-between" id="coping-root-card">
      
      {/* Category header */}
      <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
        <span className="text-[10px] tracking-wider uppercase font-mono font-bold bg-indigo-50 text-indigo-700 border border-indigo-150 px-2.5 py-0.5 rounded-full">
          {exercise.category} Suggested Exercise
        </span>
        <BrainCircuit className="h-4.5 w-4.5 text-indigo-600 animate-pulse-gentle" />
      </div>

      <div>
        <h4 className="text-base font-bold text-slate-800 mb-2">{exercise.name}</h4>
        <p className="text-xs text-slate-600 leading-relaxed mb-4">{exercise.description}</p>
        
        {/* Rationale explanation card */}
        <div className="bg-slate-50 border border-slate-200/60 p-3.5 rounded-2xl mb-5 flex items-start gap-2.5 shadow-sm">
          <Compass className="h-4 w-4 text-purple-600 shrink-0 mt-0.5" />
          <p className="text-[11px] text-slate-600 leading-relaxed italic">
            <strong className="text-slate-800">Diagnostic reasoning:</strong> {exercise.rationale}
          </p>
        </div>
      </div>

      <button
        onClick={handleStart}
        className="w-full py-3 bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs uppercase tracking-wider rounded-xl hover:opacity-95 active:scale-95 transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-rose-500/20 focus:outline-none focus:ring-2 focus:ring-rose-500"
      >
        <Play className="h-3.5 w-3.5" />
        Start Calming Exercise ({Math.round(exercise.duration / 60)}m)
      </button>

      {/* Somatic guidance Screen overlay */}
      {showOverlay && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4" id="exercise-overlay">
          <div className="bg-white border border-slate-200 w-full max-w-md rounded-3xl p-6 md:p-8 animate-slide-up relative shadow-2xl">
            
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer p-1 bg-slate-50 hover:bg-slate-100 rounded-full transition-all"
              title="Close overlay"
            >
              <X className="h-5 w-5" />
            </button>

            {exerciseState === 'running' && (
              <div>
                <div className="mb-4 text-center">
                  <h3 className="text-lg font-bold text-slate-900">{exercise.name}</h3>
                  <p className="text-xs text-slate-500 mt-1 uppercase font-mono tracking-wider">Follow steps closely</p>
                </div>
                
                <CountdownTimer
                  durationSeconds={exercise.duration}
                  steps={exercise.steps}
                  onComplete={handleTimerComplete}
                />
              </div>
            )}

            {exerciseState === 'completed' && (
              <div className="text-center py-4 space-y-6">
                <div className="flex justify-center">
                  <div className="h-14 w-14 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
                    <CheckCircle2 className="h-8 w-8 animate-pulse-gentle" />
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-slate-950">Exercise complete</h3>
                  <p className="text-xs text-slate-600 px-6 mt-1.5 italic leading-relaxed">
                    "{followUpMessage}"
                  </p>
                </div>

                {/* Self Report Mood Evaluation scales */}
                <div className="pt-4 border-t border-slate-100">
                  <h4 className="text-xs font-bold text-slate-800 mb-3">Rate your internal state now:</h4>
                  <div className="flex items-center justify-center gap-3">
                    {emojiMoods.map((emo) => (
                      <button
                        key={emo.score}
                        onClick={() => setSelectedImprovedScore(emo.score)}
                        className={`p-2.5 rounded-2xl text-2xl transition-all cursor-pointer ${
                          selectedImprovedScore === emo.score
                            ? 'bg-indigo-55 border-2 border-indigo-500 scale-110 shadow-md shadow-indigo-500/10'
                            : 'bg-slate-50 border border-slate-200/60 hover:bg-slate-100 text-slate-705'
                        }`}
                        title={emo.label}
                      >
                        {emo.emoji}
                      </button>
                    ))}
                  </div>
                  {selectedImprovedScore !== null && (
                    <p className="text-[10px] text-indigo-700 font-bold font-mono mt-2 uppercase tracking-wide">
                      Reported state: {emojiMoods.find(e => e.score === selectedImprovedScore)?.label}
                    </p>
                  )}
                </div>

                <div className="pt-2">
                  <button
                    onClick={handleMoodSubmit}
                    disabled={selectedImprovedScore === null}
                    className={`w-full py-3 rounded-xl font-bold text-xs tracking-wider uppercase transition-all ${
                      selectedImprovedScore === null
                        ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
                        : 'bg-indigo-650 hover:bg-indigo-700 text-white cursor-pointer shadow-lg shadow-indigo-55/20'
                    }`}
                  >
                    Log assessment state
                  </button>
                </div>

              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
