import { expect, test, describe, vi } from 'vitest';
import { verifyConfig, analyzeStress, sendCompanionMessage } from './apiService';
import axiosClient from './axiosClient';

// Mock axiosClient
vi.mock('./axiosClient', () => {
  return {
    default: {
      get: vi.fn(),
      post: vi.fn(),
    },
  };
});

describe('apiService operations', () => {
  test('verifyConfig successfully returns apiConfigured status', async () => {
    const mockData = { apiConfigured: true };
    vi.mocked(axiosClient.get).mockResolvedValueOnce({ data: mockData });

    const result = await verifyConfig();
    expect(axiosClient.get).toHaveBeenCalledWith('/api/verify-config');
    expect(result).toEqual(mockData);
    expect(result.apiConfigured).toBe(true);
  });

  test('analyzeStress successfully returns processed AIStressAnalysis results', async () => {
    const mockModelResponse = {
      moodScore: 4,
      sentiment: 'negative',
      triggers: ['Kota isolation', 'Mock Stress'],
      summary: 'High cortisol and performance tension centered on national standard evaluations.',
      patterns: ['Continuous 14h study pacing risk'],
      copingExercise: {
        name: 'Vagal Release',
        description: 'Soothes exam panic triggers.',
        steps: ['Inhale 4s', 'Exhale 6s'],
        duration: 120,
        category: 'Grounding',
        rationale: 'Calms muscle tremors.'
      },
      followUpMessage: 'Rest and proceed.'
    };
    
    vi.mocked(axiosClient.post).mockResolvedValueOnce({ data: mockModelResponse });

    const result = await analyzeStress('Mock score drop feeling restless', []);
    expect(axiosClient.post).toHaveBeenCalledWith('/api/analyze', {
      journalText: 'Mock score drop feeling restless',
      previousEntries: [],
      city: 'Delhi',
    });
    expect(result).toEqual(mockModelResponse);
    expect(result.moodScore).toBe(4);
    expect(result.triggers).toContain('Kota isolation');
  });

  test('sendCompanionMessage parses conversational dialogues correctly', async () => {
    const mockText = { text: 'You are moving forward beautifully. Focus on the organic chemistry steps.' };
    vi.mocked(axiosClient.post).mockResolvedValueOnce({ data: mockText });

    const result = await sendCompanionMessage('Help me revise biology', [
      { id: '1', sender: 'student', text: 'I am so down', timestamp: '10:00 AM' }
    ]);

    expect(axiosClient.post).toHaveBeenCalledWith('/api/companion-chat', {
      message: 'Help me revise biology',
      history: [{ sender: 'student', text: 'I am so down' }],
    });
    expect(result.text).toBe(mockText.text);
  });
});
