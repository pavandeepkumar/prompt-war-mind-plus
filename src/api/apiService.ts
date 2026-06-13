import axiosClient from './axiosClient';
import type { JournalEntry, AIAnalysisResult } from '../lib/types';

/**
 * Verifies whether the server has a valid and active Gemini API Key configuration
 */
export async function verifyConfig(): Promise<{ apiConfigured: boolean }> {
  const { data } = await axiosClient.get<{ apiConfigured: boolean }>('/api/verify-config');
  return data;
}

/**
 * Initiates an AI-powered diagnostic and sentiment analysis of the student's journal entry via Gemini
 */
export async function analyzeStress(
  journalText: string,
  previousEntries: JournalEntry[]
): Promise<AIAnalysisResult> {
  const { data } = await axiosClient.post<AIAnalysisResult>('/api/analyze', {
    journalText,
    previousEntries,
    city: 'Delhi',
  });
  return data;
}

export interface ChatMessage {
  id: string;
  sender: 'student' | 'companion';
  text: string;
  timestamp: string;
}

/**
 * Sends a chat message to Aura, the MindPulse AI student stress companion, passing optional history
 */
export async function sendCompanionMessage(
  message: string,
  history: ChatMessage[]
): Promise<{ text: string }> {
  const { data } = await axiosClient.post<{ text: string }>('/api/companion-chat', {
    message,
    history: history.map(h => ({ sender: h.sender, text: h.text })),
  });
  return data;
}
