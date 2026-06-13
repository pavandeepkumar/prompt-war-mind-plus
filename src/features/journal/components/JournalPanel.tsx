import React, { useState, useEffect, FormEvent } from 'react';
import { PenTool, Sparkles, RefreshCw, AlertCircle } from 'lucide-react';

interface JournalPanelProps {
  onAnalyze: (text: string) => void;
  isAnalyzing: boolean;
  error: string | null;
}

export default function JournalPanel({ onAnalyze, isAnalyzing, error }: JournalPanelProps) {
  const [text, setText] = useState('');
  const [placeholderIndex, setPlaceholderIndex] = useState(0);

  const prompts = [
    "RE-NEET anxiety: 'Hands shake thinking about the Cancelled paper. Biology mock score went down...'",
    "Environmental isolation: 'Kota hostel is touching 42°C. Power cut is ruining my concentration...'",
    "Expectation burdens: 'My parents spent a lot on my coaching fees. I can't sleep thinking about the cut-off...'"
  ];

  // Rotate placehold prompts every 8 seconds for inspiration, unless user is typing
  useEffect(() => {
    if (text.length > 0) return;
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % prompts.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [text]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (text.trim().length >= 10 && !isAnalyzing) {
      onAnalyze(text);
    }
  };

  const handleClear = () => {
    setText('');
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white/80 backdrop-blur-md border border-white/50 rounded-3xl p-6 shadow-xl shadow-zinc-200/40" id="journal-input-form">
      <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-3">
        <label htmlFor="journal-textarea" className="text-sm font-bold text-slate-800 flex items-center gap-2">
          <PenTool className="h-4.5 w-4.5 text-indigo-600 animate-pulse-gentle" />
          Student Stress Journal
        </label>
        
        <span className="text-[10px] font-mono text-slate-500 font-bold bg-slate-100 px-2 py-0.5 rounded-full">
          {text.length} / 5000 chars
        </span>
      </div>

      <div className="relative">
        <textarea
          id="journal-textarea"
          value={text}
          onChange={(e) => setText(e.target.value.slice(0, 5000))}
          placeholder={prompts[placeholderIndex]}
          disabled={isAnalyzing}
          className="w-full min-h-[140px] bg-slate-50/50 border border-slate-200 focus:border-indigo-500 focus:bg-white rounded-2xl p-4 text-sm text-slate-800 placeholder-slate-400 focus:outline-none transition-all leading-relaxed resize-y focus:ring-4 focus:ring-indigo-100"
          aria-label="Student stress journal entry text field"
        />
        
        {text.length > 0 && !isAnalyzing && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3.5 bottom-3.5 text-xs text-slate-400 hover:text-slate-600 font-mono font-bold hover:underline"
          >
            Clear text
          </button>
        )}
      </div>

      {error && (
        <div className="mt-4 bg-rose-50 border border-rose-150 rounded-2xl p-4 flex items-start gap-2.5 text-xs text-rose-700 animate-slide-up shadow-sm">
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
          <span className="font-medium">{error}</span>
        </div>
      )}

      <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-[10px] text-slate-500 font-medium leading-relaxed max-w-sm text-center sm:text-left">
          🔐 Real-time Gemini inference is processed server-side. No entries are logged or stored.
        </p>

        <button
          type="submit"
          disabled={text.trim().length < 10 || isAnalyzing}
          className={`w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
            text.trim().length < 10 || isAnalyzing
              ? 'bg-slate-150 text-slate-400 border border-slate-200/60 cursor-not-allowed shadow-none'
              : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/20 active:scale-95'
          }`}
          id="analyze-submit-button"
        >
          {isAnalyzing ? (
            <>
              <RefreshCw className="h-4 w-4 animate-spin" />
              <span>Analyzing Stress...</span>
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              <span>Inference via Gemini</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
