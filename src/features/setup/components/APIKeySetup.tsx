import { AlertTriangle, Key, ArrowRight, Play } from 'lucide-react';

interface APIKeySetupProps {
  onDismiss: () => void;
}

export default function APIKeySetup({ onDismiss }: APIKeySetupProps) {
  return (
    <div className="bg-amber-50/90 backdrop-blur-md border border-amber-200 rounded-2xl p-6 mb-8 animate-fade-in shadow-xl shadow-amber-200/50" id="api-key-setup">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-amber-100 rounded-xl text-amber-700 shrink-0 shadow-sm">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-amber-950">AI Analysis Active: Local Demo Mode</h2>
            <p className="text-sm text-slate-700 mt-1 max-w-xl leading-relaxed">
              Strictly local analytics are running on your cache. To unlock real-time **Gemini 3.5 AI** stress analysis, trigger scanning, and personalized exercises, declare your API key.
            </p>

            <div className="mt-4 space-y-2.5 text-xs text-slate-600">
              <div className="flex items-center gap-2.5">
                <span className="w-5 h-5 flex items-center justify-center bg-amber-150 border border-amber-200 rounded-full text-amber-800 font-bold shrink-0">1</span>
                <span>Retrieve your Gemini API Key from <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-amber-800 font-semibold hover:underline">Google AI Studio</a>.</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="w-5 h-5 flex items-center justify-center bg-amber-150 border border-amber-200 rounded-full text-amber-800 font-bold shrink-0">2</span>
                <span>Paste it in the **Settings &rarr; Secrets** panel on Google AI Studio as <code className="bg-amber-100 text-amber-900 border border-amber-250 px-1 py-0.5 rounded font-mono">GEMINI_API_KEY</code>.</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="w-5 h-5 flex items-center justify-center bg-amber-150 border border-amber-200 rounded-full text-amber-800 font-bold shrink-0">3</span>
                <span>MindPulse will automatically link and enable deep live AI diagnostics!</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 md:self-center shrink-0">
          <a
            href="https://aistudio.google.com/app/apikey"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-lg shadow-rose-500/20 focus:ring-2 focus:ring-rose-450 focus:outline-none"
            id="get-api-key-link"
          >
            <Key className="h-4 w-4" />
            Get Free key
            <ArrowRight className="h-4 w-4" />
          </a>
          <button
            onClick={onDismiss}
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-white/95 border border-slate-200 text-slate-700 hover:text-slate-900 hover:bg-slate-100/90 text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-sm focus:ring-2 focus:ring-slate-400 focus:outline-none"
            id="continue-offline-btn"
          >
            <Play className="h-4 w-4 text-amber-600 animate-pulse-gentle" />
            Offline Demo
          </button>
        </div>
      </div>
    </div>
  );
}
