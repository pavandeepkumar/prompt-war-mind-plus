import { Calendar, AlertCircle, CheckCircle2, RefreshCw } from 'lucide-react';
import { examDates2026, getDaysUntilExam } from '../../../lib/examDates';

export default function ExamCountdown() {
  return (
    <div className="bg-white/80 backdrop-blur-md border border-white/50 rounded-2xl p-5 shadow-xl shadow-zinc-200/50" id="exam-countdown-panel">
      <div className="flex items-center gap-2 mb-4">
        <Calendar className="h-5 w-5 text-indigo-600" />
        <h3 className="font-bold text-slate-800">2026 Competitive Exam Tracker</h3>
      </div>

      <div className="space-y-3">
        {examDates2026.map((exam, index) => {
          const daysLeft = getDaysUntilExam(exam.date);
          const isUpcoming = exam.status === 'upcoming' || exam.status === 're-exam';

          let statusTheme = 'bg-slate-100 text-slate-600 border-slate-200';
          let statusText = 'Completed';
          let statusIcon = <CheckCircle2 className="h-3 w-3" />;

          if (exam.status === 'cancelled') {
            statusTheme = 'bg-rose-50 text-rose-700 border-rose-100';
            statusText = 'Cancelled';
            statusIcon = <AlertCircle className="h-3 w-3" />;
          } else if (exam.status === 're-exam') {
            statusTheme = 'bg-amber-100/80 text-amber-800 border-amber-200 animate-pulse-gentle';
            statusText = 'Critical Re-Exam';
            statusIcon = <RefreshCw className="h-3 w-3" />;
          } else if (exam.status === 'upcoming') {
            statusTheme = 'bg-blue-50 text-blue-700 border-blue-100';
            statusText = 'Upcoming';
            statusIcon = <Calendar className="h-3 w-3" />;
          }

          return (
            <div
              key={index}
              className={`p-3 rounded-xl border transition-all ${
                exam.status === 're-exam'
                  ? 'border-amber-300 bg-amber-50/70 shadow-sm shadow-amber-200/30'
                  : 'border-slate-100 bg-white/40 hover:border-indigo-200'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h4 className="font-bold text-sm text-slate-800 flex items-center gap-1.5">
                    {exam.name}
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">{exam.description}</p>
                </div>
                <div className="text-right shrink-0">
                  <span className={`inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full border font-medium ${statusTheme}`}>
                    {statusIcon}
                    {statusText}
                  </span>
                  {isUpcoming && daysLeft > 0 && (
                    <div className="text-xs font-mono font-bold text-slate-700 mt-2">
                      In {daysLeft} Days
                    </div>
                  )}
                  {isUpcoming && daysLeft <= 0 && (
                    <div className="text-xs font-mono font-bold text-emerald-600 mt-2">
                      Exam Today
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
