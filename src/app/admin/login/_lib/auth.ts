import type { LoginResponse } from '@/types/auth'
import { setTokens, setUser } from '@/lib/utils/localStorage'
import { type TokenData } from '@/lib/utils/crypto'

// 토큰 유효성 검증 (Access Token 기준)
export const validateToken = async (token: string): Promise<boolean> => {
  try {
    const response = await fetch('/api/v1/auth/validate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    
    return response.ok;
  } catch (error) {
    console.error('토큰 검증 오류:', error);
    return false;
  }
};

// 로그인 함수
export const login = async (email: string, password: string): Promise<LoginResponse> => {
  try {
    const response = await fetch('/api/v1/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });
    
    const data = await response.json();
    
    if (data.success && data.tokens && data.user) {
      // 새로운 토큰 구조로 저장
      const tokenData: TokenData = {
        accessToken: data.tokens.accessToken,
        refreshToken: data.tokens.refreshToken,
        expiresAt: data.tokens.accessTokenExpiresAt,
        refreshExpiresAt: data.tokens.refreshTokenExpiresAt
      };
      
      setTokens(tokenData);
      setUser(data.user);
      
      return {
        success: true,
        user: data.user,
        tokens: data.tokens
      };
    }
    
    return {
      success: false,
      message: data.message || '로그인에 실패했습니다.'
    };
  } catch (error) {
    console.error('로그인 오류:', error);
    return { 
      success: false, 
      message: '로그인 중 오류가 발생했습니다.' 
    };
  }
}; 