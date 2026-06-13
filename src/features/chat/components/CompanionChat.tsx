import { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { 
  Send, 
  Paperclip, 
  Mic, 
  Copy, 
  Check, 
  ThumbsUp, 
  ThumbsDown, 
  Search, 
  Bell, 
  HelpCircle, 
  Sparkles,
  Bot,
  User,
  Coffee,
  Lightbulb,
  CornerDownRight
} from 'lucide-react';
import { sendCompanionMessage, type ChatMessage } from '../../../api/apiService';

interface CompanionChatProps {
  apiConfigured: boolean;
}

export default function CompanionChat({ apiConfigured }: CompanionChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      sender: 'companion',
      text: "Namaste! I'm Aura, your MindPulse companion. With the NEET 2026 Re-exam just 8 days away, I know the pressure is immense. Whether mock grades are hurting your sleep, or Kota/Delhi loneliness is eating on you—let's deal with this together. How are you feeling right now?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const [inputText, setInputText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  // Attachment popup
  const [showAttachmentSuccess, setShowAttachmentSuccess] = useState(false);
  // Mic speech animation states
  const [isListening, setIsListening] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto Scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isSending]);

  // Clickable rapid prompts for NEET student contexts
  const quickTemplatePrompts = [
    { label: "Mock Exam Burnout", text: "My mock exam scores dropped. I am burnt out and feeling useless with 8 days to go." },
    { label: "深夜 Sleep Friction", text: "I can't sleep at night. Stress triggers are making me super restless during study blocks." },
    { label: "Parental Coaching Guilt", text: "My family spent a lot of money on my offline coaching. The cutoff anxiety is making me feel so guilty." },
    { label: "Kota Isolation", text: "Living in this small Kota PG in 42°C heat is really suffocating. I feel so isolated." }
  ];

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isSending) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}-user`,
      sender: 'student',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsSending(true);

    if (!apiConfigured) {
      // Return beautiful mock responses matching exam triggers if real key is not enabled
      setTimeout(() => {
        let mockReply = "I understand completely how difficult it feels. Take a deep, slow inhale for 4 seconds, and exhale for 4. The burden of Kota loneliness combined with mock stress is hefty, but you are more than these exams. Let's tackle one revision block at a time. What topic are you working on next?";
        
        if (textToSend.toLowerCase().includes('mock') || textToSend.toLowerCase().includes('score')) {
          mockReply = "Mock scores are diagnostics, not absolute endpoints! Often, mock exams in coaching centers are intentionally set 15% harder than the actual NEET or JEE guidelines to prepare you. Don't let a score drop today blind you to your true academic progress.";
        } else if (textToSend.toLowerCase().includes('sleep') || textToSend.toLowerCase().includes('insomnia')) {
          mockReply = "Exam insomnia is extremely common but manageable. Try standard sleep hygiene: shut off mocks 1 hour before bed, hydrate, and let's do alternate nostril breathing. Would you like a 60-second breathing script to ease the spatial tremors now?";
        } else if (textToSend.toLowerCase().includes('guilt') || textToSend.toLowerCase().includes('parent')) {
          mockReply = "Your parent's investment represents their love, not a heavy mental debt. Refuse the voice that says you're letting them down. They want your safety and wellbeing more than any cutoff number. Focus on the effort, not the absolute result.";
        }

        const compMsg: ChatMessage = {
          id: `msg-${Date.now()}-comp`,
          sender: 'companion',
          text: mockReply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, compMsg]);
        setIsSending(false);
      }, 1500);
      return;
    }

    try {
      const response = await sendCompanionMessage(textToSend, messages.slice(-8));
      const companionMsg: ChatMessage = {
        id: `msg-${Date.now()}-comp`,
        sender: 'companion',
        text: response.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, companionMsg]);
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: `msg-${Date.now()}-err`,
        sender: 'companion',
        text: `Oh dear, my communication was briefly interrupted: ${err.message || 'Check network connection'}. Close this and try again shortly!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(inputText);
    }
  };

  const handleCopyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedMessageId(id);
    setTimeout(() => setCopiedMessageId(null), 2000);
  };

  const handleMicToggle = () => {
    if (isListening) {
      setIsListening(false);
      // Simulate speech-to-text response
      const randomStatements = [
        "I am feeling completely exhausted by revisions today.",
        "How can I stop my hands from shaking during mock tests?",
        "My parents keep talking about Kota results, I need a breath.",
        "Teach me a breathing exercise for physics stress."
      ];
      const selected = randomStatements[Math.floor(Math.random() * randomStatements.length)];
      setInputText(selected);
    } else {
      setIsListening(true);
      // Automatically finish listening in 2.5 seconds
      setTimeout(() => {
        setIsListening(false);
        const randomStatements = [
          "I am feeling completely exhausted by revisions today.",
          "How can I stop my hands from shaking during mock tests?",
          "My parents keep talking about Kota results, I need a breath.",
          "Teach me a breathing exercise for physics stress."
        ];
        const selected = randomStatements[Math.floor(Math.random() * randomStatements.length)];
        setInputText(selected);
      }, 2500);
    }
  };

  const handleAttachment = () => {
    setShowAttachmentSuccess(true);
    setTimeout(() => {
      setShowAttachmentSuccess(false);
    }, 3000);
  };

  // Filter messages based on search query
  const filteredMessages = searchQuery.trim() === ''
    ? messages
    : messages.filter(m => m.text.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div id="companion-chat-layout" className="flex flex-col h-[calc(100vh-160px)] md:h-[630px] bg-slate-50/40 rounded-3xl overflow-hidden border border-slate-200/60 shadow-lg relative" aria-label="Empathetic companion chat screen">
      
      {/* Search Header and Quick Actions bar (Matches image) */}
      <header className="px-5 py-3.5 bg-white border-b border-slate-150 flex items-center justify-between gap-4 shadow-sm z-10" id="chat-header">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            id="chat-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search within conversation..."
            className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:bg-white rounded-full py-1.5 pl-9 pr-4 text-xs text-slate-700 focus:outline-none transition-all placeholder-slate-400 focus:ring-2 focus:ring-indigo-100"
            aria-label="Search within conversation text input"
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setNotificationsEnabled(!notificationsEnabled)}
            className={`p-2 rounded-full cursor-pointer transition-all ${
              notificationsEnabled ? 'text-indigo-600 bg-indigo-50 hover:bg-indigo-100' : 'text-slate-400 bg-slate-50'
            }`}
            title={notificationsEnabled ? "Mute companion notifications" : "Enable companion notifications"}
            aria-label={notificationsEnabled ? "Mute notifications" : "Unmute notifications"}
          >
            <Bell className="h-4 w-4" />
          </button>
          
          <button
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-all"
            title="Chat Help Guidelines"
            onClick={() => alert("Aura uses Generative AI to provide safe mental grounding, CBT guidance, and academic encouragement. Aura should NOT be substituted for psychiatric care.")}
            aria-label="Aura guide details"
          >
            <HelpCircle className="h-4 w-4" />
          </button>
        </div>
      </header>

      {/* Floating alert for attachment uploads */}
      {showAttachmentSuccess && (
        <div className="absolute top-16 left-1/2 transform -translate-x-1/2 z-20 bg-emerald-50 border border-emerald-150 text-emerald-800 text-[11px] px-4 py-2 rounded-full font-mono font-medium shadow-md flex items-center gap-1.5 animate-slide-up">
          <Check className="h-3.5 w-3.5" />
          <span>Attachment uploaded successfully! (Mock analysis applied)</span>
        </div>
      )}

      {/* Dynamic Listening Indicator */}
      {isListening && (
        <div className="absolute top-16 left-1/2 transform -translate-x-1/2 z-20 bg-rose-500 text-white text-[11px] px-4 py-2 rounded-full font-mono font-bold shadow-md flex items-center gap-2 animate-pulse-gentle">
          <span className="w-2 h-2 rounded-full bg-white animate-ping" />
          <span>Aura Listening... Speak now</span>
        </div>
      )}

      {/* Main scrolling Chat dialogue bubble area */}
      <div 
        id="chat-messages-scroll"
        className="flex-1 overflow-y-auto p-5 md:p-6 space-y-4"
        style={{
          backgroundImage: 'linear-gradient(135deg, rgba(187,247,236,0.1) 0%, rgba(254,240,138,0.1) 50%, rgba(254,215,170,0.1) 100%)'
        }}
        aria-live="polite"
      >
        {/* Safe AI warning notice */}
        <div className="bg-amber-50 border border-amber-200/70 p-3 rounded-2xl flex items-start gap-2.5 max-w-lg mx-auto text-[11px] text-slate-600 leading-relaxed shadow-sm">
          <Coffee className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
          <p>
            <strong className="text-slate-800">CBT Safety Gate:</strong> Aura processes messages in live sandboxed sessions. If you are experiencing acute medical crises, please connect with official toll-free counseling networks.
          </p>
        </div>

        {/* Dynamic List Items */}
        {filteredMessages.map((msg) => {
          const isComp = msg.sender === 'companion';
          return (
            <div 
              key={msg.id}
              className={`flex items-start gap-3 max-w-[85%] ${
                isComp ? 'self-start' : 'self-end flex-row-reverse ml-auto'
              }`}
            >
              {/* Avatar circle */}
              <div className={`p-1.5 rounded-xl shrink-0 ${
                isComp ? 'bg-indigo-50 border border-indigo-100 text-indigo-600' : 'bg-rose-50 border border-rose-100 text-[#f43f5e]'
              }`}>
                {isComp ? <Bot className="h-4.5 w-4.5" /> : <User className="h-4.5 w-4.5" />}
              </div>

              {/* Speech board bubble wrapper */}
              <div className="space-y-1">
                <div className={`p-4 rounded-3xl text-sm leading-relaxed ${
                  isComp 
                    ? 'bg-white text-slate-800 rounded-tl-sm border border-slate-100 shadow-md shadow-zinc-200/20' 
                    : 'bg-emerald-600 text-white rounded-tr-sm shadow-md'
                }`}>
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                </div>

                {/* Bubble details and action rows */}
                <div className={`flex items-center gap-3 text-[10px] text-slate-400 px-1 ${
                  !isComp && 'justify-end'
                }`}>
                  <span>{msg.timestamp}</span>
                  {isComp && (
                    <div className="flex items-center gap-2 border-l border-slate-200 pl-2">
                      <button 
                        onClick={() => handleCopyText(msg.text, msg.id)}
                        className="hover:text-slate-600 cursor-pointer p-0.5" 
                        title="Copy text content"
                        aria-label="Copy response text"
                      >
                        {copiedMessageId === msg.id ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
                      </button>
                      <button className="hover:text-amber-500 hover:scale-110 transition-all cursor-pointer p-0.5" title="Thumbs Up" aria-label="Like message">
                        <ThumbsUp className="h-3 w-3" />
                      </button>
                      <button className="hover:text-rose-500 hover:scale-110 transition-all cursor-pointer p-0.5" title="Thumbs Down" aria-label="Dislike message">
                        <ThumbsDown className="h-3 w-3" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {/* Loading Bubble */}
        {isSending && (
          <div className="flex items-start gap-3 max-w-[85%] animate-pulse">
            <div className="p-1.5 rounded-xl shrink-0 bg-indigo-50 text-indigo-600 border border-indigo-100">
              <Bot className="h-4.5 w-4.5" />
            </div>
            <div className="bg-white/90 p-4 rounded-3xl rounded-tl-sm border border-slate-100 shadow-sm flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Template Prompt Chips */}
      <footer className="bg-white border-t border-slate-150 p-4 shrink-0" id="chat-footer-controls">
        <div className="mb-3.5">
          <div className="flex items-center gap-1.5 mb-2">
            <Lightbulb className="h-3.5 w-3.5 text-amber-500 animate-pulse-gentle" />
            <span className="text-[10px] font-mono font-bold uppercase tracking-wide text-slate-500">Suggested Stress Topics</span>
          </div>
          <div className="flex flex-wrap gap-1.5 overflow-x-auto max-h-[76px] pb-1">
            {quickTemplatePrompts.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSendMessage(p.text)}
                disabled={isSending}
                className="text-[10px] text-slate-600 font-mono font-medium hover:text-indigo-700 bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 transition-all px-2.5 py-1 rounded-full text-left inline-flex items-center gap-1 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label={`Ask template query: ${p.label}`}
              >
                <CornerDownRight className="h-2.5 w-2.5 text-indigo-500" />
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Input Text Pill Container (Matches image) */}
        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-full px-3 py-1.5 focus-within:border-indigo-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-indigo-100 transition-all shadow-inner" id="pill-input-box">
          
          <button
            type="button"
            onClick={handleAttachment}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-all cursor-pointer"
            title="Attach mock revision sheets or notes"
            aria-label="Upload attachment"
          >
            <Paperclip className="h-4.5 w-4.5" />
          </button>

          <button
            type="button"
            onClick={handleMicToggle}
            className={`p-1.5 rounded-full transition-all cursor-pointer ${
              isListening ? 'text-white bg-rose-500 hover:bg-rose-600 animate-pulse' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
            }`}
            title="Dictate message (Mock Speech Recognition)"
            aria-label="Toggle voice diction"
          >
            <Mic className="h-4.5 w-4.5" />
          </button>

          <textarea
            id="chat-textarea-box"
            rows={1}
            value={inputText}
            onChange={(e) => setInputText(e.target.value.slice(0, 1000))}
            onKeyDown={handleKeyDown}
            placeholder="Start typing..."
            className="flex-1 bg-transparent border-none text-slate-800 text-xs placeholder-slate-400 focus:outline-none resize-none pt-1"
            aria-label="Message chat input field"
          />

          <button
            type="button"
            onClick={() => handleSendMessage(inputText)}
            disabled={!inputText.trim() || isSending}
            className={`p-2 rounded-full flex items-center justify-center transition-all cursor-pointer ${
              !inputText.trim() || isSending
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                : 'bg-rose-500 hover:bg-rose-600 text-white shadow-md shadow-rose-500/20 active:scale-95'
            }`}
            id="chat-send-btn"
            title="Send Message"
            aria-label="Send messenger text"
          >
            <Send className="h-3.5 w-3.5" />
          </button>
        </div>
      </footer>
    </div>
  );
}
