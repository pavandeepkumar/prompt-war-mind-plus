import { Calendar, AlertCircle, CheckCircle2, RefreshCw } from 'lucide-react';
import { examDates2026, getDaysUntilExam } from '../lib/examDates';

export default function ExamCountdown() {
  return (
    <div className="bg-[#12121a] border border-[#2a2a3e] rounded-xl p-5 shadow-sm" id="exam-countdown-panel">
      <div className="flex items-center gap-2 mb-4">
        <Calendar className="h-5 w-5 text-indigo-400" />
        <h3 className="font-bold text-gray-200">2026 Competitive Exam Tracker</h3>
      </div>

      <div className="space-y-3">
        {examDates2026.map((exam, index) => {
          const daysLeft = getDaysUntilExam(exam.date);
          const isUpcoming = exam.status === 'upcoming' || exam.status === 're-exam';

          let statusTheme = 'bg-gray-500/10 text-gray-400 border-gray-500/20';
          let statusText = 'Completed';
          let statusIcon = <CheckCircle2 className="h-3 w-3" />;

          if (exam.status === 'cancelled') {
            statusTheme = 'bg-rose-500/10 text-rose-400 border-rose-500/20';
            statusText = 'Cancelled';
            statusIcon = <AlertCircle className="h-3 w-3" />;
          } else if (exam.status === 're-exam') {
            statusTheme = 'bg-amber-500/10 text-amber-400 border-amber-500/20 animate-pulse-gentle';
            statusText = 'Critical Re-Exam';
            statusIcon = <RefreshCw className="h-3 w-3" />;
          } else if (exam.status === 'upcoming') {
            statusTheme = 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20';
            statusText = 'Upcoming';
            statusIcon = <Calendar className="h-3 w-3" />;
          }

          return (
            <div
              key={index}
              className={`p-3 rounded-lg border transition-all ${
                exam.status === 're-exam'
                  ? 'border-amber-500/30 bg-amber-950/10 shadow-lg shadow-amber-500/5'
                  : 'border-[#2a2a3e] bg-[#0a0a0f]/40 hover:border-[#3a3a5e]'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h4 className="font-semibold text-sm text-gray-200 flex items-center gap-1.5">
                    {exam.name}
                  </h4>
                  <p className="text-xs text-gray-400 mt-0.5">{exam.description}</p>
                </div>
                <div className="text-right shrink-0">
                  <span className={`inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full border ${statusTheme}`}>
                    {statusIcon}
                    {statusText}
                  </span>
                  {isUpcoming && daysLeft > 0 && (
                    <div className="text-xs font-mono font-bold text-gray-200 mt-2">
                      In {daysLeft} Days
                    </div>
                  )}
                  {isUpcoming && daysLeft <= 0 && (
                    <div className="text-xs font-mono font-bold text-emerald-400 mt-2">
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
