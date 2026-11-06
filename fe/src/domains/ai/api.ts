import { ApiClient } from '../../shared/api/client.js';
import { GlossaryItem, CeoNewsResponse, VideoForensicAnalysis } from './types.js';

export const AiApi = {
  // Glossary
  getGlossary: () => ApiClient.get<GlossaryItem[]>('/api/glos'),
  createGlossaryItem: (payload: { en: string; ko: string; desc: string; img?: string }) =>
    ApiClient.post<{ success: boolean; id: number }>('/api/setGlos', payload),
  updateGlossaryItem: (id: number, payload: Partial<GlossaryItem>) =>
    ApiClient.put(`/api/glos/${id}`, payload),
  deleteGlossaryItems: (ids: number[]) => ApiClient.post('/api/glos/delete', { ids }),

  // CEO Intelligence
  getCeoNews: (ticker: string = 'NVDA') =>
    ApiClient.get<CeoNewsResponse>('/api/ceo-news', { ticker }),

  // Video Forensics
  analyzeVideo: (payload: { videoName?: string; duration?: number; frameSamples?: number }) =>
    ApiClient.post<VideoForensicAnalysis>('/api/video-forensics/analyze', payload),
};
