import { useState } from 'react';
import { Sparkles, BrainCircuit, Play, X, Compass, CheckCircle2 } from 'lucide-react';
import type { AIAnalysisResult } from '../lib/types';
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
    <div className="bg-zinc-900/60 border border-zinc-805/90 rounded-3xl p-5 md:p-6 shadow-sm flex flex-col justify-between" id="coping-root-card">
      
      {/* Category header */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-[10px] tracking-wider uppercase font-mono font-bold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 px-2.5 py-0.5 rounded-full">
          {exercise.category} Suggested Exercise
        </span>
        <BrainCircuit className="h-4.5 w-4.5 text-indigo-400" />
      </div>

      <div>
        <h4 className="text-base font-bold text-white mb-2">{exercise.name}</h4>
        <p className="text-xs text-zinc-300 leading-relaxed mb-4">{exercise.description}</p>
        
        {/* Rationale explanation card */}
        <div className="bg-zinc-950/40 border border-zinc-800/80 p-3.5 rounded-2xl mb-5 flex items-start gap-2.5">
          <Compass className="h-4 w-4 text-purple-400 shrink-0 mt-0.5" />
          <p className="text-[11px] text-zinc-400 leading-relaxed italic">
            <strong>Diagnostic reasoning:</strong> {exercise.rationale}
          </p>
        </div>
      </div>

      <button
        onClick={handleStart}
        className="w-full py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold text-xs uppercase tracking-wider rounded-xl hover:opacity-95 active:scale-95 transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-indigo-500/5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        <Play className="h-3.5 w-3.5" />
        Start Calming Exercise ({Math.round(exercise.duration / 60)}m)
      </button>

      {/* Somatic guidance Screen overlay */}
      {showOverlay && (
        <div className="fixed inset-0 z-50 bg-[#09090b]/95 backdrop-blur-md flex items-center justify-center p-4" id="exercise-overlay">
          <div className="bg-zinc-900 border border-zinc-800 w-full max-w-md rounded-3xl p-6 md:p-8 animate-slide-up relative">
            
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white cursor-pointer"
              title="Close overlay"
            >
              <X className="h-5 w-5" />
            </button>

            {exerciseState === 'running' && (
              <div>
                <div className="mb-4 text-center">
                  <h3 className="text-lg font-bold text-white">{exercise.name}</h3>
                  <p className="text-xs text-zinc-500 mt-1 uppercase font-mono tracking-wider">Follow steps closely</p>
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
                  <div className="h-14 w-14 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                    <CheckCircle2 className="h-8 w-8 animate-pulse-gentle" />
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-white">Exercise complete</h3>
                  <p className="text-xs text-zinc-400 px-6 mt-1.5 italic leading-relaxed">
                    "{followUpMessage}"
                  </p>
                </div>

                {/* Self Report Mood Evaluation scales */}
                <div className="pt-4 border-t border-zinc-800/80">
                  <h4 className="text-xs font-bold text-zinc-300 mb-3">Rate your internal state now:</h4>
                  <div className="flex items-center justify-center gap-3">
                    {emojiMoods.map((emo) => (
                      <button
                        key={emo.score}
                        onClick={() => setSelectedImprovedScore(emo.score)}
                        className={`p-2 rounded-xl text-2xl transition-all cursor-pointer ${
                          selectedImprovedScore === emo.score
                            ? 'bg-indigo-500/20 border border-indigo-500 scale-110'
                            : 'bg-zinc-800/40 border border-transparent hover:bg-zinc-800'
                        }`}
                        title={emo.label}
                      >
                        {emo.emoji}
                      </button>
                    ))}
                  </div>
                  {selectedImprovedScore !== null && (
                    <p className="text-[10px] text-zinc-400 mt-2">
                      Reported stress level: {emojiMoods.find(e => e.score === selectedImprovedScore)?.label}
                    </p>
                  )}
                </div>

                <div className="pt-2">
                  <button
                    onClick={handleMoodSubmit}
                    disabled={selectedImprovedScore === null}
                    className={`w-full py-2.5 rounded-xl font-semibold text-xs tracking-wider uppercase transition-all ${
                      selectedImprovedScore === null
                        ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                        : 'bg-white hover:bg-zinc-200 text-black cursor-pointer'
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
