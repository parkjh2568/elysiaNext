import type { User } from '@/types/user'

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

// 편의 함수들
export const setToken = (token: string): void => tokenStorage.set(token);
export const getToken = (): string | null => tokenStorage.get();
export const removeToken = (): void => tokenStorage.remove();

export const setUser = (user: User): void => userStorage.set(user);
export const getUser = (): User | null => userStorage.get();
export const removeUser = (): void => userStorage.remove();

// 인증된 사용자 여부 확인
export const isAuthenticated = (): boolean => {
  const token = getToken();
  return !!token;
};

// 현재 사용자 정보 가져오기
export const getCurrentUser = (): User | null => {
  return getUser();
};

// 로그아웃 함수
export const logout = (): void => {
  removeToken();
  removeUser();
  window.location.href = '/admin/login';
}; 