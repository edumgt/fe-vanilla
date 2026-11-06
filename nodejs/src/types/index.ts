export type UserRole = 'admin' | 'manager' | 'guest';

export interface UserSession {
  username: string;
  role: UserRole;
  token: string;
  loginAt: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  timestamp: string;
}

export interface CodeItem {
  id: string;
  tpCd: string;
  tpNm: string;
  descCntn: string;
  useYn: 'Y' | 'N';
  creDt: string;
}

export interface CalendarEvent {
  event_id: string;
  date_id: string;
  time: string;
  description: string;
}

export interface CeoArticle {
  id: string;
  title: string;
  source: string;
  date: string;
  activity: string;
  country: string;
  url: string;
  summary: string;
}

export interface VideoForensicResult {
  aiProbability: number;
  confidence: number;
  verdict: string;
  summary: string;
  indicators: Array<{ label: string; score: number; description: string }>;
  frameSeries: Array<{ label: string; score: number }>;
}
