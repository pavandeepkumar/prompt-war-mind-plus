import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '100kb' }));

  // Enforce comprehensive HTTP security response headers to secure student data
  app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    res.setHeader(
      'Content-Security-Policy',
      "default-src 'self' 'unsafe-inline' 'unsafe-eval' https: data: blob:;"
    );
    next();
  });

  // Simple and lightweight in-memory rate limiter to secure API from abuse
  const rateLimitStore: Record<string, { count: number; resetTime: number }> = {};
  const apiRateLimiter = (req: any, res: any, next: any) => {
    const ip = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || 'anonymous';
    const now = Date.now();
    const limitWindow = 10 * 60 * 1000; // 10 minutes
    const maxRequestsPerWindow = 60;   // 60 requests maximum

    if (!rateLimitStore[ip] || now > rateLimitStore[ip].resetTime) {
      rateLimitStore[ip] = {
        count: 1,
        resetTime: now + limitWindow
      };
    } else {
      rateLimitStore[ip].count++;
    }

    if (rateLimitStore[ip].count > maxRequestsPerWindow) {
      return res.status(429).json({
        error: 'Too many requests. Please cool down and try again in 10 minutes.'
      });
    }
    next();
  };

  // API Route: Verify whether GEMINI_API_KEY is configured on the server
  app.get('/api/verify-config', (req, res) => {
    const isConfigured = !!process.env.GEMINI_API_KEY;
    res.json({ apiConfigured: isConfigured });
  });

  // API Route: Real-time Empathetic conversational companion Aura (supports problem statement)
  app.post('/api/companion-chat', apiRateLimiter, async (req, res) => {
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(503).json({
          error: 'GEMINI_API_KEY environment variable is not configured. Please add it to your secrets or .env.local file to activate live AI chat.',
        });
      }

      const { message, history = [] } = req.body;

      if (!message || message.trim().length === 0) {
        return res.status(400).json({
          error: 'Message text cannot be empty.',
        });
      }

      if (message.length > 5000) {
        return res.status(400).json({
          error: 'Message is too long. Please restrict your text to 5000 characters.'
        });
      }

      // Initialize client using the modern, correct GoogleGenAI SDK
      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });

      // System instruction shaping Aura - the student's always-available mental well-being helper
      const systemInstruction = `You are Aura, an empathetic, safe, and always-available digital exam stress companion built for Indian competitive exam aspirants (NEET, JEE, UPSC, CUET, GATE, CAT).
The student is preparing for high-stakes milestones. They face severe stress, burnout, PG loneliness (e.g., in Kota, Delhi, or coaching hubs), late-night study fatigue, and acute self-doubt.

Today's context: The simulated current date is Saturday, June 13, 2026. Note that the critical NEET 2026 Re-exam is Scheduled for June 21, 2026 — only 8 DAYS AWAY. This re-exam triggered extreme mental panic. UPSC is 15 days away.

Your mission is to act as a loving, conversational, and highly safety-conscious digital companion:
- Provide short, comforting, conversational dialogue (1-3 sentences) to make it highly engaging and conversational. 
- Avoid any diagnostic language, clinical definitions, or medical advice. Safely direct them to grounding or breathing hacks if they express physical panic.
- Validate their feelings with profound empathy. Acknowledge local coaching realities (exhausting study schedules, PG mess food, pressure from parents, mock scores).
- Keep formatting clean. You can use markdown bullet points if they ask for study tips or breathing techniques, but keep general talk brief and dialogic.
- Speak directly and warmly as a human support companion. Do not use AI jargon or state that you are a model.`;

      // Map incoming historical turns into the required format for generateContent
      const contentsPayload = history.map((h: any) => ({
        role: h.sender === 'student' ? 'user' : 'model',
        parts: [{ text: h.text }]
      }));

      // Append user's current query
      contentsPayload.push({
        role: 'user',
        parts: [{ text: message }]
      });

      const result = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: contentsPayload,
        config: {
          systemInstruction,
          temperature: 0.70,
        },
      });

      const text = result.text || "I am right here with you. Take a slow, steady inhale. You are capable and you are not alone in this journey.";
      res.json({ text });
    } catch (err: any) {
      console.error('Companion Chat processing failed:', err);
      res.status(500).json({ error: `Companion processing failed: ${err.message}` });
    }
  });

  // API Route: Analyze student's journal entry via real Gemini API
  app.post('/api/analyze', apiRateLimiter, async (req, res) => {
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(503).json({
          error: 'GEMINI_API_KEY environment variable is not configured. Please add it to your secrets or .env.local file to activate live AI analysis.',
        });
      }

      const { journalText, previousEntries = [], city = 'Delhi' } = req.body;

      if (!journalText || journalText.trim().length < 10) {
        return res.status(400).json({
          error: 'Journal entry is too short. Please express yourself in at least 10 characters so Gemini can find emotional triggers.',
        });
      }

      // Initialize GoogleGenAI SDK with appropriate headers as required
      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });

      // Prepare text context from previous student sessions
      const contextEntries = previousEntries
        .slice(-3)
        .map((entry: any) => `Date: ${entry.date}\nMood: ${entry.moodScore}/10\nText: ${entry.text}\nTriggers: ${(entry.triggers || []).join(', ')}`)
        .join('\n---\n');

      const systemInstruction = `You are MindPulse AI — an empathetic, exam-aware student wellness companion built specifically for Indian students facing high-stakes examinations (like NEET, JEE, UPSC, CUET, GATE).

Today's Context: The current simulated date is Saturday, June 13, 2026. This is a highly critical moment: the unprecedented NEET 2026 Re-exam is scheduled for June 21, 2026 — exactly 8 DAYS AWAY. UPSC is 15 DAYS AWAY. This re-exam was triggered by paper leak scandals, putting 24 lakh Indian aspirants under extreme mental stress and self-doubt.

Your job is to read the student's personal journal entry and generate a deep emotional analysis in VALID JSON format.

JSON schema:
{
  "moodScore": <number from 1 to 10 where 1 is total panic/burnout, 10 is absolute confidence/serenity>,
  "sentiment": "<very_negative | negative | neutral | positive | very_positive>",
  "triggers": ["<exam stress trigger 1>", "<exam stress trigger 2>"],
  "summary": "<2-3 sentence empathetic analysis directly acknowledging the student's specific words and circumstances with warmth and deep validation>",
  "patterns": ["<detected recurrence, e.g., 'Anxiety spikes right before mocks' or 'Family pressure is inducing guilt'>"],
  "copingExercise": {
    "name": "<creative, actionable exercises, e.g., 'Square Breathing for Re-exam Panic' or 'The Cognitive Reframe Protocol'>",
    "description": "<why this particular exercise has been designated to ease their identified triggers>",
    "steps": ["<step 1>", "<step 2>", "<step 3>", "<step 4>", "<step 5>"],
    "duration": <number of seconds, e.g., 60 to 180>,
    "category": "<Grounding | CBT Reframe | Breathing | Mindfulness | Self-Compassion>",
    "rationale": "<brief explanation linking their current environment (e.g. June Delhi heat of 42°C or 8-day NEET countdown) to this breathing/coping suggestion>"
  },
  "followUpMessage": "<a supporting, short, empowering post-exercise quote or statement tailored to their exam context>"
}

Requirements:
- NEVER dismiss their distress as "just studies" or "normal competition". Validate their feelings.
- Incorporate Indian coaching hub realities (Kota isolation, Delhi PG fatigue, late night study, parental investment, mock leak anxieties) where appropriate.
- Return ONLY the raw JSON string; no markdown block tags like \`\`\`json, no trailing comments, no leading characters.`;

      // Request standard text generation using gemini-3.5-flash
      const result = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: `Journal Entry for analysis: "${journalText}"\nLocal City Location: ${city}\n\nPrevious History context:\n${contextEntries || 'No previous history recorded.'}`,
        config: {
          systemInstruction,
          temperature: 0.45,
          responseMimeType: 'application/json',
        },
      });

      const responseText = result.text;
      if (!responseText) {
        throw new Error('Gemini model response was completely empty.');
      }

      // Clean response block just in case Gemini accidentally returned markdown blocks
      let cleanedJson = responseText.trim();
      if (cleanedJson.startsWith('```')) {
        cleanedJson = cleanedJson.replace(/^```json\s*/i, '').replace(/```$/, '').trim();
      }

      const parsedAnalysis = JSON.parse(cleanedJson);
      res.json(parsedAnalysis);
    } catch (err: any) {
      console.error('Gemini processing failed:', err);
      res.status(500).json({ error: `AI analysis failed: ${err.message}` });
    }
  });

  // Handle building and static files
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`MindPulse Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
