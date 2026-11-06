export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  timestamp: string;
}

export type DomainType = 'general' | 'ai' | 'game';

export interface UserProfile {
  id: string;
  username: string;
  role: 'admin' | 'manager' | 'guest';
  name: string;
  avatarUrl?: string;
}

export interface MenuItem {
  id: string;
  domain: DomainType;
  label: string;
  path: string;
  icon: string;
  badge?: string;
  roles: Array<'admin' | 'manager' | 'guest'>;
}
