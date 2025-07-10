import type { User } from '@/types/user';
import { 
  encryptToken, 
  decryptToken, 
  encryptUserData, 
  decryptUserData,
  isAccessTokenExpired,
  isRefreshTokenExpired,
  type TokenData 
} from './crypto';

// 토큰 데이터 저장소 관리
export const tokenStorage = {
  get: (): TokenData | null => {
    if (typeof window === 'undefined') return null;
    try {
      const encryptedToken = localStorage.getItem('auth_token_data');
      if (!encryptedToken) return null;
      
      const tokenData = decryptToken(encryptedToken);
      if (!tokenData) {
        // 복호화 실패 시 (형식 변경 등) 기존 데이터 클리어
        console.log('토큰 복호화 실패. 기존 데이터를 클리어합니다.');
        tokenStorage.remove();
        return null;
      }

      // Refresh Token도 만료되었다면 null 반환
      if (isRefreshTokenExpired(tokenData)) {
        tokenStorage.remove();
        return null;
      }

      return tokenData;
    } catch (error) {
      console.error('Token storage get error:', error);
      console.log('토큰 저장소 오류로 인해 기존 데이터를 클리어합니다.');
      tokenStorage.remove();
      userStorage.remove(); // 사용자 데이터도 함께 클리어
      return null;
    }
  },
  
  set: (tokenData: TokenData): void => {
    if (typeof window === 'undefined') return;
    try {
      const encryptedToken = encryptToken(tokenData);
      localStorage.setItem('auth_token_data', encryptedToken);
    } catch (error) {
      console.error('Token storage set error:', error);
    }
  },
  
  remove: (): void => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('auth_token_data');
  },

  // Access Token이 만료되었는지 확인
  isAccessTokenExpired: (): boolean => {
    const tokenData = tokenStorage.get();
    if (!tokenData) return true;
    return isAccessTokenExpired(tokenData);
  },

  // Refresh Token이 만료되었는지 확인
  isRefreshTokenExpired: (): boolean => {
    const tokenData = tokenStorage.get();
    if (!tokenData) return true;
    return isRefreshTokenExpired(tokenData);
  },

  // 유효한 Access Token 가져오기
  getAccessToken: (): string | null => {
    const tokenData = tokenStorage.get();
    if (!tokenData || isAccessTokenExpired(tokenData)) {
      return null;
    }
    return tokenData.accessToken;
  },

  // Refresh Token 가져오기
  getRefreshToken: (): string | null => {
    const tokenData = tokenStorage.get();
    if (!tokenData || isRefreshTokenExpired(tokenData)) {
      return null;
    }
    return tokenData.refreshToken;
  }
};

// 사용자 정보 관리 (암호화 적용)
export const userStorage = {
  get: (): User | null => {
    if (typeof window === 'undefined') return null;
    try {
      const encryptedUser = localStorage.getItem('user_info');
      if (!encryptedUser) return null;
      
      const userData = decryptUserData(encryptedUser);
      if (!userData) {
        // 복호화 실패 시 기존 데이터 클리어
        console.log('사용자 데이터 복호화 실패. 기존 데이터를 클리어합니다.');
        userStorage.remove();
        return null;
      }
      
      return userData;
    } catch (error) {
      console.error('User storage get error:', error);
      console.log('사용자 저장소 오류로 인해 기존 데이터를 클리어합니다.');
      userStorage.remove();
      return null;
    }
  },
  
  set: (user: User): void => {
    if (typeof window === 'undefined') return;
    try {
      const encryptedUser = encryptUserData(user);
      localStorage.setItem('user_info', encryptedUser);
    } catch (error) {
      console.error('User storage set error:', error);
    }
  },
  
  remove: (): void => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('user_info');
  }
};

// 편의 함수들 (새로운 토큰 구조에 맞게 업데이트)
export const setTokens = (tokenData: TokenData): void => tokenStorage.set(tokenData);
export const getTokens = (): TokenData | null => tokenStorage.get();
export const removeTokens = (): void => tokenStorage.remove();

export const getAccessToken = (): string | null => tokenStorage.getAccessToken();
export const getRefreshToken = (): string | null => tokenStorage.getRefreshToken();

export const setUser = (user: User): void => userStorage.set(user);
export const getUser = (): User | null => userStorage.get();
export const removeUser = (): void => userStorage.remove();

// 인증된 사용자 여부 확인 (Refresh Token 기준)
export const isAuthenticated = (): boolean => {
  const tokenData = tokenStorage.get();
  return !!tokenData && !isRefreshTokenExpired(tokenData);
};

// Access Token이 유효한지 확인
export const hasValidAccessToken = (): boolean => {
  const tokenData = tokenStorage.get();
  return !!tokenData && !isAccessTokenExpired(tokenData);
};

// 현재 사용자 정보 가져오기
export const getCurrentUser = (): User | null => {
  return getUser();
};

// 완전한 로그아웃 함수 (토큰 및 사용자 정보 모두 삭제)
export const logout = (): void => {
  removeTokens();
  removeUser();
  
  // 기존 형식의 데이터도 클리어 (호환성)
  if (typeof window !== 'undefined') {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_info');
  }
  
  // 로그인 페이지로 리다이렉트
  if (typeof window !== 'undefined') {
    window.location.href = '/admin/login';
  }
};

// 호환성을 위한 레거시 함수들 (deprecated)
export const setToken = (token: string): void => {
  console.warn('setToken is deprecated. Use setTokens instead.');
};

export const getToken = (): string | null => {
  console.warn('getToken is deprecated. Use getAccessToken instead.');
  return getAccessToken();
};

export const removeToken = (): void => {
  console.warn('removeToken is deprecated. Use removeTokens instead.');
  removeTokens();
}; 