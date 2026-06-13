import { useEffect, useState } from 'react';
import { Play, Pause, RefreshCw } from 'lucide-react';

interface CountdownTimerProps {
  durationSeconds: number; // dynamically allocated by AI
  steps: string[];
  onComplete: () => void;
}

export default function CountdownTimer({ durationSeconds, steps, onComplete }: CountdownTimerProps) {
  const [secondsLeft, setSecondsLeft] = useState(durationSeconds);
  const [isActive, setIsActive] = useState(true);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  // Divide elapsed steps based on duration
  const stepInterval = durationSeconds / (steps.length || 1);

  useEffect(() => {
    setSecondsLeft(durationSeconds);
    setCurrentStepIndex(0);
    setIsActive(true);
  }, [durationSeconds, steps]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isActive && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft((prev) => {
          const next = prev - 1;
          // Determine active step index based on elapsed seconds
          const elapsed = durationSeconds - next;
          const calculatedIndex = Math.min(
            Math.floor(elapsed / stepInterval),
            steps.length - 1
          );
          if (calculatedIndex !== currentStepIndex) {
            setCurrentStepIndex(calculatedIndex);
          }
          return next;
        });
      }, 1000);
    } else if (secondsLeft === 0) {
      setIsActive(false);
      onComplete();
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, secondsLeft, currentStepIndex, steps.length, stepInterval, durationSeconds, onComplete]);

  // SVG calculations for timer circular track
  const radius = 64;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (secondsLeft / durationSeconds) * circumference;

  const secondsToMMSS = (sec: number) => {
    const mm = Math.floor(sec / 60);
    const ss = sec % 60;
    return `${mm}:${ss.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col items-center justify-center py-6 px-4 bg-slate-50 border border-slate-200 rounded-3xl max-w-sm mx-auto shadow-inner" id="countdown-timer">
      
      {/* Dynamic Animated Breather Container */}
      <div className="relative w-44 h-44 flex items-center justify-center mb-6">
        {/* Pulsing visual core layer */}
        <div className={`absolute w-36 h-36 rounded-full bg-gradient-to-br from-indigo-500/10 to-purple-600/10 transform transition-all duration-1000 ${
          isActive && secondsLeft % 8 < 4 ? 'scale-110 opacity-75' : 'scale-95 opacity-40'
        }`} />

        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="88"
            cy="88"
            r={radius}
            className="stroke-slate-205"
            strokeWidth="6"
            fill="transparent"
          />
          <circle
            cx="88"
            cy="88"
            r={radius}
            className="stroke-indigo-600 transition-all duration-1000"
            strokeWidth="6"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
          />
        </svg>

        {/* Core numbers display */}
        <div className="absolute text-center">
          <span className="text-4xl font-mono font-extrabold text-slate-850 tracking-wide">
            {secondsToMMSS(secondsLeft)}
          </span>
          <p className="text-[10px] text-slate-500 font-bold tracking-wider uppercase mt-1">
            Remaining
          </p>
        </div>
      </div>

      {/* active guidance indicator */}
      <div className="text-center w-full min-h-[72px] mb-6 px-4">
        <span className="text-[10px] uppercase font-mono bg-indigo-50 border border-indigo-150 px-2 py-0.5 rounded text-indigo-700 font-bold">
          Step {currentStepIndex + 1} of {steps.length}
        </span>
        <h4 className="text-sm font-bold text-slate-800 mt-2">
          {steps[currentStepIndex] || 'Breathing deeply...'}
        </h4>
        <p className="text-xs text-indigo-600 mt-1.5 font-semibold italic animate-pulse-gentle">
          {secondsLeft % 8 < 4 ? 'Inhale peace...' : 'Exhale tension...'}
        </p>
      </div>

      {/* Controls panel */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => setSecondsLeft(durationSeconds)}
          className="p-2.5 bg-white hover:bg-slate-100 text-slate-650 rounded-lg border border-slate-200 shadow-sm transition-all cursor-pointer focus:outline-none"
          title="Restart exercise timer"
        >
          <RefreshCw className="h-4 w-4" />
        </button>

        <button
          onClick={() => setIsActive(!isActive)}
          className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-md shadow-indigo-500/20 focus:outline-none"
        >
          {isActive ? (
            <>
              <Pause className="h-4 w-4" /> Pause
            </>
          ) : (
            <>
              <Play className="h-4 w-4" /> Resume
            </>
          )}
        </button>
      </div>
    </div>
  );
}
