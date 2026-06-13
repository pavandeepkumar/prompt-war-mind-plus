import { Smile, Frown, Meh } from 'lucide-react';

interface MoodMeterProps {
  score: number; // 1 to 10
}

export default function MoodMeter({ score }: MoodMeterProps) {
  // SVG properties for smooth gauge representation
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 10) * circumference;

  let color = 'stroke-emerald-500';
  let textTheme = 'text-emerald-600';
  let bgGradient = 'from-emerald-500/10 to-transparent';
  let Icon = Smile;

  if (score <= 3) {
    color = 'stroke-rose-500';
    textTheme = 'text-rose-650';
    bgGradient = 'from-rose-500/10 to-transparent';
    Icon = Frown;
  } else if (score <= 6) {
    color = 'stroke-amber-500';
    textTheme = 'text-amber-600';
    bgGradient = 'from-amber-500/10 to-transparent';
    Icon = Meh;
  }

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-white/80 backdrop-blur-md border border-white/50 rounded-3xl relative overflow-hidden shadow-xl shadow-zinc-200/40" id="mood-meter">
      <div className={`absolute inset-0 bg-gradient-to-b ${bgGradient} opacity-20 pointer-events-none`} />
      
      <div className="relative w-32 h-32 flex items-center justify-center mt-2">
         {/* Background track circle */}
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="64"
            cy="64"
            r={radius}
            className="stroke-slate-100"
            strokeWidth="8"
            fill="transparent"
          />
          {/* Active colored score metric line progress */}
          <circle
            cx="64"
            cy="64"
            r={radius}
            className={`transition-all duration-700 ${color}`}
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
          />
        </svg>

        {/* Interior center display */}
        <div className="absolute text-center flex flex-col items-center justify-center">
          <Icon className={`h-6 w-6 mb-1 ${textTheme}`} />
          <span className="text-3xl font-extrabold font-mono tracking-tighter text-slate-800">{score}</span>
          <span className="text-[10px] text-slate-500 font-medium">out of 10</span>
        </div>
      </div>

      <div className="mt-4 text-center">
        <h4 className="text-sm font-semibold text-slate-700">Stress Integrity Metric</h4>
        <p className="text-xs text-slate-500 mt-1 leading-relaxed">
          {score <= 3 ? 'Hyper-anxiety detected. Rest vital.' : score <= 6 ? 'Substantial tension loads.' : 'Equilibrium state.'}
        </p>
      </div>
    </div>
  );
}
