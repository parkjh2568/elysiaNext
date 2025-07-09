// 토큰 관련 유틸리티 함수들
export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

export interface AuthResponse {
  success: boolean;
  token?: string;
  user?: User;
  message?: string;
}

// 로컬스토리지에서 토큰 관리
export const tokenStorage = {
  get: (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('auth_token');
  },
  
  set: (token: string): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('auth_token', token);
  },
  
  remove: (): void => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('auth_token');
  }
};

// 사용자 정보 관리
export const userStorage = {
  get: (): User | null => {
    if (typeof window === 'undefined') return null;
    const userStr = localStorage.getItem('user_info');
    return userStr ? JSON.parse(userStr) : null;
  },
  
  set: (user: User): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('user_info', JSON.stringify(user));
  },
  
  remove: (): void => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('user_info');
  }
};

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
export const login = async (email: string, password: string): Promise<AuthResponse> => {
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
      tokenStorage.set(data.token);
      userStorage.set(data.user);
    }
    
    return data;
  } catch (error) {
    console.error('로그인 오류:', error);
    return { success: false, message: '로그인 중 오류가 발생했습니다.' };
  }
};

// 로그아웃 함수
export const logout = (): void => {
  tokenStorage.remove();
  userStorage.remove();
  window.location.href = '/admin/login';
};

// 인증된 사용자 여부 확인
export const isAuthenticated = (): boolean => {
  const token = tokenStorage.get();
  return !!token;
};

// 현재 사용자 정보 가져오기
export const getCurrentUser = (): User | null => {
  return userStorage.get();
}; 