import { AlertTriangle, Key, ArrowRight, Play } from 'lucide-react';

interface APIKeySetupProps {
  onDismiss: () => void;
}

export default function APIKeySetup({ onDismiss }: APIKeySetupProps) {
  return (
    <div className="bg-amber-950/20 border border-amber-500/30 rounded-xl p-6 mb-8 animate-fade-in" id="api-key-setup">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-amber-500/10 rounded-lg text-amber-400 shrink-0">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-amber-200">AI Analysis Active: Offline Mode</h2>
            <p className="text-sm text-gray-300 mt-1 max-w-xl">
              Strictly local analytics are running on your cache. To unlock real-time **Gemini 3.5 AI** stress analysis, triggers scanning, and personalized exercises, declare your API key.
            </p>

            <div className="mt-4 space-y-2 text-xs text-gray-400">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 flex items-center justify-center bg-amber-500/20 rounded-full text-amber-300 font-bold">1</span>
                <span>Retrieve your Gemini API Key from <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-amber-400 hover:underline">Google AI Studio</a>.</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 flex items-center justify-center bg-amber-500/20 rounded-full text-amber-300 font-bold">2</span>
                <span>Paste it in the **Settings &rarr; Secrets** panel on Google AI Studio as <code className="bg-black/30 px-1 py-0.5 rounded text-amber-300 font-mono">GEMINI_API_KEY</code>.</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 flex items-center justify-center bg-amber-500/20 rounded-full text-amber-300 font-bold">3</span>
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
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-500 text-black font-semibold text-sm rounded-lg hover:bg-amber-400 transition-all cursor-pointer focus:ring-2 focus:ring-amber-500 focus:outline-none"
            id="get-api-key-link"
          >
            <Key className="h-4 w-4" />
            Get Free key
            <ArrowRight className="h-4 w-4" />
          </a>
          <button
            onClick={onDismiss}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-zinc-800/80 border border-zinc-700 text-gray-200 hover:text-white hover:bg-zinc-700/80 text-sm font-medium rounded-lg transition-all cursor-pointer focus:ring-2 focus:ring-gray-500 focus:outline-none"
            id="continue-offline-btn"
          >
            <Play className="h-4 w-4 text-amber-400 animate-pulse-gentle" />
            Offline Demo Mode
          </button>
        </div>
      </div>
    </div>
  );
}
