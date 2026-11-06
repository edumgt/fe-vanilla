export interface GlossaryItem {
  id: number;
  en: string;
  ko: string;
  desc: string;
  img?: string;
  createdAt: string;
}

export interface CeoArticleItem {
  title: string;
  date: string;
  time: string;
  summary: string;
  source: string;
  link: string;
  country: string;
}

export interface CeoNewsResponse {
  ticker: string;
  articles: CeoArticleItem[];
}

export interface VideoForensicIndicator {
  label: string;
  score: number;
  description: string;
}

export interface VideoForensicAnalysis {
  success: boolean;
  verdict: string;
  tone: 'ai' | 'real' | 'uncertain';
  badge: string;
  summary: string;
  aiProbability: number;
  confidence: number;
  averageFrameScore: number;
  frameAverages: { temporalDelta: number };
  highlights: Array<{ label: string; score: number; detail: string }>;
  indicators: VideoForensicIndicator[];
  frameSeries: Array<{ label: string; score: number }>;
}
