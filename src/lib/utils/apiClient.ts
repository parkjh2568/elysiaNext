import {
  getAccessToken,
  getRefreshToken,
  setTokens,
  logout,
  hasValidAccessToken
} from './localStorage';
import { type TokenData } from './crypto';

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  [key: string]: any;
}

interface RefreshTokenResponse {
  success: boolean;
  tokens?: {
    accessToken: string;
    refreshToken: string;
    accessTokenExpiresAt: number;
    refreshTokenExpiresAt: number;
  };
  message?: string;
}

class ApiClient {
  private isRefreshing = false;
  private refreshPromise: Promise<boolean> | null = null;

  /**
   * 토큰 갱신
   */
  private async refreshTokens(): Promise<boolean> {
    // 이미 갱신 중이면 대기
    if (this.isRefreshing && this.refreshPromise) {
      return this.refreshPromise;
    }

    this.isRefreshing = true;
    this.refreshPromise = this.performTokenRefresh();

    try {
      const result = await this.refreshPromise;
      return result;
    } finally {
      this.isRefreshing = false;
      this.refreshPromise = null;
    }
  }

  /**
   * 실제 토큰 갱신 작업
   */
  private async performTokenRefresh(): Promise<boolean> {
    const refreshToken = getRefreshToken();
    
    if (!refreshToken) {
      console.error('Refresh token이 없습니다.');
      logout();
      return false;
    }

    try {
      const response = await fetch('/api/v1/auth/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ refreshToken })
      });

      const data: RefreshTokenResponse = await response.json();

      if (data.success && data.tokens) {
        // 새로운 토큰을 localStorage에 저장
        const tokenData: TokenData = {
          accessToken: data.tokens.accessToken,
          refreshToken: data.tokens.refreshToken,
          expiresAt: data.tokens.accessTokenExpiresAt,
          refreshExpiresAt: data.tokens.refreshTokenExpiresAt
        };
        
        setTokens(tokenData);
        console.log('토큰이 성공적으로 갱신되었습니다.');
        return true;
      } else {
        console.error('토큰 갱신 실패:', data.message);
        logout();
        return false;
      }
    } catch (error) {
      console.error('토큰 갱신 중 오류:', error);
      logout();
      return false;
    }
  }

  /**
   * 인증이 필요한 API 요청
   */
  async request<T = any>(
    url: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    // Access Token 유효성 확인
    let accessToken = getAccessToken();
    
    if (!hasValidAccessToken()) {
      console.log('Access Token이 만료되었습니다. 갱신을 시도합니다.');
      const refreshSuccess = await this.refreshTokens();
      
      if (!refreshSuccess) {
        return {
          success: false,
          message: '인증이 만료되었습니다. 다시 로그인해주세요.'
        };
      }
      
      accessToken = getAccessToken();
    }

    // 요청 헤더에 토큰 추가
    const headers: any = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers
      });

      // 401 에러 시 토큰 갱신 재시도
      if (response.status === 401) {
        console.log('401 에러 발생. 토큰 갱신을 재시도합니다.');
        const refreshSuccess = await this.refreshTokens();
        
        if (refreshSuccess) {
          // 갱신된 토큰으로 재요청
          const newAccessToken = getAccessToken();
          if (newAccessToken) {
            const retryHeaders: any = {
              ...headers,
              'Authorization': `Bearer ${newAccessToken}`
            };
            const retryResponse = await fetch(url, {
              ...options,
              headers: retryHeaders
            });
            return retryResponse.json();
          }
        }
        
        // 갱신 실패 시 로그아웃
        logout();
        return {
          success: false,
          message: '인증이 만료되었습니다. 다시 로그인해주세요.'
        };
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API 요청 오류:', error);
      return {
        success: false,
        message: '네트워크 오류가 발생했습니다.'
      };
    }
  }

  /**
   * GET 요청
   */
  async get<T = any>(url: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    return this.request<T>(url, { ...options, method: 'GET' });
  }

  /**
   * POST 요청
   */
  async post<T = any>(url: string, data?: any, options: RequestInit = {}): Promise<ApiResponse<T>> {
    return this.request<T>(url, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined
    });
  }

  /**
   * PUT 요청
   */
  async put<T = any>(url: string, data?: any, options: RequestInit = {}): Promise<ApiResponse<T>> {
    return this.request<T>(url, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined
    });
  }

  /**
   * DELETE 요청
   */
  async delete<T = any>(url: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    return this.request<T>(url, { ...options, method: 'DELETE' });
  }

  /**
   * 로그아웃 (서버에 refresh token 무효화 요청)
   */
  async logout(): Promise<void> {
    const refreshToken = getRefreshToken();
    
    if (refreshToken) {
      try {
        await fetch('/api/v1/auth/logout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ refreshToken })
        });
      } catch (error) {
        console.error('서버 로그아웃 요청 실패:', error);
      }
    }
    
    // 로컬 로그아웃
    logout();
  }
}

// 싱글톤 인스턴스 생성 및 export
export const apiClient = new ApiClient();

// 편의 함수들
export const { get, post, put, delete: del } = apiClient;

// 기본 export
export default apiClient; 