'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './AuthProvider';

interface AuthGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function AuthGuard({ children, fallback }: AuthGuardProps) {
  const { isLoggedIn, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    console.log("AuthGuard")
    if (!isLoading && !isLoggedIn) {
      router.push('/admin/login');
    }
  }, [isLoggedIn, isLoading, router]);

  // 로딩 중일 때 표시할 컴포넌트
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // 인증되지 않은 경우 fallback 또는 null 반환
  if (!isLoggedIn) {
    return fallback || null;
  }

  // 인증된 경우 children 렌더링
  return <>{children}</>;
} 