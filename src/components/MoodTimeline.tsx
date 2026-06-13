import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ReferenceLine } from 'recharts';
import type { JournalEntry } from '../lib/types';
import { formatDate } from '../lib/utils';
import { Sparkles, TrendingUp } from 'lucide-react';

interface MoodTimelineProps {
  entries: JournalEntry[];
}

export default React.memo(function MoodTimeline({ entries }: MoodTimelineProps) {
  // Sort entries chronologically for the visual chart map
  const chartData = [...entries]
    .filter((e) => e.moodScore !== null)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map((e) => ({
      dateLabel: formatDate(e.date),
      score: e.moodScore,
      textPreview: e.text.slice(0, 60) + '...',
      sentiment: e.sentiment,
    }));

  // Calculate moving trends
  const hasMultiplePoints = chartData.length > 1;
  const recentDiff = hasMultiplePoints 
    ? (chartData[chartData.length - 1].score ?? 0) - (chartData[chartData.length - 2].score ?? 0)
    : 0;

  // Custom tooltips
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-zinc-950/95 border border-zinc-800 p-3.5 rounded-xl shadow-2xl max-w-xs text-xs font-mono">
          <p className="text-zinc-500 mb-1">{data.dateLabel}</p>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-zinc-400 font-bold">Coping Index:</span>
            <span className={`font-bold text-sm ${
              data.score <= 3 ? 'text-rose-400' : data.score <= 6 ? 'text-amber-400' : 'text-emerald-400'
            }`}>
              {data.score} / 10
            </span>
          </div>
          <p className="text-zinc-300 leading-relaxed italic">"{data.textPreview}"</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-zinc-900/40 border border-zinc-800 rounded-3xl p-6 relative overflow-hidden flex flex-col justify-between" id="mood-timeline-chart-widget">
      
      {/* Header Info mapping labels */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-mono">
            <Sparkles className="h-3 w-3 animate-pulse-gentle" />
            <span>AI Chrono Log Integration</span>
          </div>
          <h3 className="text-base font-bold text-white mt-1">Coping Velocity Timeline</h3>
          <p className="text-xs text-zinc-500 mt-0.5">Somatic state changes relative to exam studies</p>
        </div>

        {hasMultiplePoints && (
          <div className="text-right shrink-0">
            <div className={`flex items-center gap-1 text-xs font-bold font-mono px-2.5 py-1 rounded-lg ${
              recentDiff >= 0 ? 'text-emerald-400 bg-emerald-500/10' : 'text-rose-400 bg-rose-500/10'
            }`}>
              <TrendingUp className={`h-3 w-3 ${recentDiff < 0 ? 'rotate-180' : ''}`} />
              <span>{recentDiff >= 0 ? '+' : ''}{recentDiff.toFixed(1)} Index shift</span>
            </div>
          </div>
        )}
      </div>

      {chartData.length === 0 ? (
        <div className="h-44 flex flex-col items-center justify-center border border-dashed border-zinc-800 rounded-xl" id="mood-chart-empty">
          <p className="text-xs text-zinc-500 font-mono">Submit your first journal text to plot kinetic wellness metrics.</p>
        </div>
      ) : (
        <div className="w-full h-44" id="mood-timeline-chart-container">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
              <defs>
                <linearGradient id="colorMood" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#1e1e24" strokeDasharray="3 3" vertical={false} />
              <XAxis 
                dataKey="dateLabel" 
                tick={{ fill: '#71717a', fontSize: 10, fontFamily: 'monospace' }}
                axisLine={{ stroke: '#27272a' }}
                tickLine={false}
              />
              <YAxis 
                domain={[1, 10]} 
                ticks={[2, 4, 6, 8, 10]}
                tick={{ fill: '#71717a', fontSize: 10, fontFamily: 'monospace' }}
                axisLine={{ stroke: '#27272a' }}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#3f3f46', strokeWidth: 1 }} />
              
              {/* Highlight Mock exam periods */}
              <ReferenceLine y={3} stroke="#ef4444" strokeDasharray="3 3" strokeOpacity={0.4} />
              
              <Area 
                type="monotone" 
                dataKey="score" 
                stroke="#6366f1" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorMood)"
                dot={(props: any) => {
                  const { cx, cy, payload } = props;
                  const score = payload.score;
                  let color = '#ef4444'; // Red for hazard stress
                  if (score > 6) color = '#10b981'; // Green for serene
                  else if (score > 3) color = '#f59e0b'; // Amber for tension

                  return (
                    <circle
                      cx={cx}
                      cy={cy}
                      r={4}
                      fill={color}
                      stroke="#09090b"
                      strokeWidth={2}
                      key={`dot-${cx}-${cy}`}
                    />
                  );
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
});
