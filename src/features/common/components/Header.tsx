import { Brain, Flame } from 'lucide-react';
import { getDaysUntilExam } from '../../../lib/examDates';

interface HeaderProps {
  streak: number;
}

export default function Header({ streak }: HeaderProps) {
  const daysUntilNeet = getDaysUntilExam("2026-06-21");

  return (
    <header className="sticky top-0 z-50 bg-white/40 backdrop-blur-md border-b border-white/30 py-4 px-4 md:px-8" id="main-header">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        
        {/* Brand Identity */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600/10 border border-indigo-500/10 text-indigo-600 shadow-sm">
            <Brain className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                MindPulse
              </h1>
              <span className="text-[10px] uppercase font-mono tracking-widest px-1.5 py-0.5 bg-indigo-100 text-indigo-700 border border-indigo-200 rounded">
                v1.0
              </span>
            </div>
            <p className="text-xs text-slate-600">AI Student Wellness Command Center</p>
          </div>
        </div>

        {/* Dynamic Context Dashboard */}
        <div className="flex flex-wrap items-center gap-3 md:gap-4 text-xs font-mono">
          
          {/* Streak Indicator */}
          <div className="flex items-center gap-2 bg-white/60 px-3 py-2 rounded-xl border border-white/40 shadow-sm" id="streak-badge">
            <Flame className="h-4 w-4 text-rose-500 animate-pulse-gentle animate-bounce-subtle" />
            <div className="text-left">
              <span className="text-slate-500 block text-[10px] leading-3 uppercase font-medium">Streak</span>
              <span className="font-bold text-slate-800">{streak} Days 🔥</span>
            </div>
          </div>

          {/* High-Stakes Timeline countdown badge */}
          <div className="flex items-center gap-2 bg-indigo-50 px-3 py-2 rounded-xl border border-indigo-100" id="exam-badge">
            <div className="h-2 w-2 rounded-full bg-indigo-600 animate-ping shrink-0" />
            <div className="text-left">
              <span className="text-indigo-600 block text-[10px] leading-3 uppercase font-medium">Re-NEET 2026</span>
              <span className="font-bold text-indigo-900">
                {daysUntilNeet > 0 ? `${daysUntilNeet} Days Away` : 'Exam Today'}
              </span>
            </div>
          </div>

          {/* Student Avatar context */}
          <div className="hidden sm:flex items-center gap-2 bg-white/60 px-3 py-1.5 rounded-xl border border-white/40 shadow-sm">
            <div className="h-6 w-6 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center font-bold text-white text-xs">
              PK
            </div>
            <div className="text-left">
              <span className="text-slate-800 block font-semibold leading-4 text-[11px]">Priya K.</span>
              <span className="text-slate-500 block text-[9px]">NEET Aspirant</span>
            </div>
          </div>

        </div>
      </div>
    </header>
  );
}
