'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { 
  getCurrentUser, 
  isAuthenticated, 
  logout,
  hasValidAccessToken,
  getRefreshToken,
  setTokens,
  setUser as setStoredUser
} from '@/lib/utils/localStorage';
import { apiClient } from '@/lib/utils/apiClient';
import type { User } from '@/types/user';
import type { AuthContextType } from '@/types/auth';
import type { TokenData } from '@/lib/utils/crypto';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  /**
   * 토큰 갱신 시도
   */
  const attemptTokenRefresh = useCallback(async (): Promise<boolean> => {
    const refreshToken = getRefreshToken();
    
    if (!refreshToken) {
      console.log('Refresh token이 없습니다.');
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

      const data = await response.json();

      if (data.success && data.tokens) {
        // 새로운 토큰을 저장
        const tokenData: TokenData = {
          accessToken: data.tokens.accessToken,
          refreshToken: data.tokens.refreshToken,
          expiresAt: data.tokens.accessTokenExpiresAt,
          refreshExpiresAt: data.tokens.refreshTokenExpiresAt
        };
        
        setTokens(tokenData);
        
        // 사용자 정보 다시 가져오기
        await fetchUserInfo();
        
        console.log('토큰이 성공적으로 갱신되었습니다.');
        return true;
      } else {
        console.error('토큰 갱신 실패:', data.message);
        return false;
      }
    } catch (error) {
      console.error('토큰 갱신 중 오류:', error);
      return false;
    }
  }, []);

  /**
   * 사용자 정보 가져오기
   */
  const fetchUserInfo = useCallback(async (): Promise<User | null> => {
    try {
      const response = await apiClient.get('/api/v1/auth/me');
      
      if (response.success && response.user) {
        setUser(response.user);
        setStoredUser(response.user);
        return response.user;
      } else {
        console.error('사용자 정보 조회 실패:', response.message);
        return null;
      }
    } catch (error) {
      console.error('사용자 정보 조회 중 오류:', error);
      return null;
    }
  }, []);

  /**
   * 인증 상태 확인 및 초기화
   */
  const checkAuthStatus = useCallback(async () => {
    setIsLoading(true);
    
    try {
      // 인증 여부 확인 (Refresh Token 기준)
      if (!isAuthenticated()) {
        console.log('인증 정보가 없습니다.');
        setUser(null);
        setIsLoading(false);
        return;
      }

      // 저장된 사용자 정보 가져오기
      const storedUser = getCurrentUser();
      if (storedUser) {
        setUser(storedUser);
      }

      // Access Token이 유효한지 확인
      if (hasValidAccessToken()) {
        console.log('유효한 Access Token이 있습니다.');
        // 사용자 정보가 없다면 서버에서 가져오기
        if (!storedUser) {
          await fetchUserInfo();
        }
      } else {
        console.log('Access Token이 만료되었습니다. 갱신을 시도합니다.');
        // 토큰 갱신 시도
        const refreshSuccess = await attemptTokenRefresh();
        
        if (!refreshSuccess) {
          console.log('토큰 갱신에 실패했습니다. 로그아웃합니다.');
          handleLogout();
          setIsLoading(false);
          return;
        }
      }
      
      setIsLoading(false);
    } catch (error) {
      console.error('인증 상태 확인 중 오류:', error);
      handleLogout();
      setIsLoading(false);
    }
  }, [attemptTokenRefresh, fetchUserInfo]);

  /**
   * 정기적인 토큰 상태 확인
   */
  useEffect(() => {
    // 컴포넌트 마운트 시 인증 상태 확인
    checkAuthStatus();

    // 5분마다 토큰 상태 확인
    const tokenCheckInterval = setInterval(() => {
      if (isAuthenticated()) {
        if (!hasValidAccessToken()) {
          console.log('정기 확인: Access Token이 만료되었습니다. 갱신을 시도합니다.');
          attemptTokenRefresh().then(success => {
            if (!success) {
              console.log('정기 토큰 갱신 실패. 로그아웃합니다.');
              handleLogout();
            }
          });
        }
      }
    }, 5 * 60 * 1000); // 5분

    return () => {
      clearInterval(tokenCheckInterval);
    };
  }, [checkAuthStatus, attemptTokenRefresh]);

  /**
   * 로그인 처리
   */
  const handleLogin = useCallback(async (userData: User, tokenData: TokenData) => {
    try {
      // 토큰과 사용자 정보 저장
      setTokens(tokenData);
      setStoredUser(userData);
      setUser(userData);
      
      console.log('로그인이 완료되었습니다.');
    } catch (error) {
      console.error('로그인 처리 중 오류:', error);
    }
  }, []);

  /**
   * 로그아웃 처리
   */
  const handleLogout = useCallback(async () => {
    try {
      // API 클라이언트를 통한 서버 로그아웃
      await apiClient.logout();
    } catch (error) {
      console.error('로그아웃 중 오류:', error);
    } finally {
      setUser(null);
      // logout() 함수에서 리다이렉트도 처리됨
    }
  }, []);

  /**
   * 인증 상태 확인 (호환성)
   */
  const checkAuth = useCallback((): boolean => {
    return isAuthenticated();
  }, []);

  const value: AuthContextType = {
    user,
    isLoading,
    isLoggedIn: !!user && isAuthenticated(),
    login: handleLogin,
    logout: handleLogout,
    checkAuth,
    refreshTokens: attemptTokenRefresh,
    hasValidAccessToken: () => hasValidAccessToken()
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 