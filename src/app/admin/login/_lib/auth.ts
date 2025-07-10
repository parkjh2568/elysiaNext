import type { LoginResponse } from '@/types/auth'

// 토큰 유효성 검증
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
    
    if (data.success && data.token && data.user) {
      // Storage는 utils에서 처리
      const { setToken, setUser } = await import('../../../../lib/utils/storage');
      setToken(data.token);
      setUser(data.user);
    }
    
    return data;
  } catch (error) {
    console.error('로그인 오류:', error);
    return { success: false, message: '로그인 중 오류가 발생했습니다.' };
  }
}; 