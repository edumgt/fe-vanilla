export interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean>;
}

export class ApiClient {
  private static baseUrl = typeof window !== 'undefined' ? (window as any).APP_API_BASE || '' : '';

  public static setBaseUrl(url: string) {
    ApiClient.baseUrl = url;
  }

  private static getToken(): string | null {
    if (typeof window !== 'undefined' && window.localStorage) {
      return localStorage.getItem('token') || localStorage.getItem('accessToken');
    }
    return null;
  }

  public static async request<T = any>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const { params, headers = {}, ...rest } = options;
    let url = `${ApiClient.baseUrl}${endpoint}`;

    if (params) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, val]) => {
        searchParams.append(key, String(val));
      });
      url += (url.includes('?') ? '&' : '?') + searchParams.toString();
    }

    const token = ApiClient.getToken();
    const reqHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(headers as Record<string, string>),
    };

    const res = await fetch(url, {
      ...rest,
      headers: reqHeaders,
    });

    if (!res.ok) {
      const errBody = await res.json().catch(() => ({}));
      throw new Error(errBody.detail || errBody.message || `HTTP error ${res.status}`);
    }

    return res.json();
  }

  public static get<T = any>(endpoint: string, params?: Record<string, string | number | boolean>) {
    return ApiClient.request<T>(endpoint, { method: 'GET', params });
  }

  public static post<T = any>(endpoint: string, body?: any) {
    return ApiClient.request<T>(endpoint, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  public static put<T = any>(endpoint: string, body?: any) {
    return ApiClient.request<T>(endpoint, {
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  public static delete<T = any>(endpoint: string) {
    return ApiClient.request<T>(endpoint, { method: 'DELETE' });
  }
}
