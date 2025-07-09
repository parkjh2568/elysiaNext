'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/(auth)/(components)/AuthProvider';

export default function Home() {
  const router = useRouter();
  const { isLoggedIn, isLoading } = useAuth();

  useEffect(() => {
    // 로딩이 완료된 후에만 리다이렉트 실행
    if (!isLoading) {
      if (isLoggedIn) {
        // 로그인된 상태면 관리자 대시보드로 리다이렉트
        router.push('/admin/dashboard');
      } else {
        // 로그인되지 않은 상태면 로그인 페이지로 리다이렉트
        router.push('/admin/login');
      }
    }
  }, [isLoggedIn, isLoading, router]);

  // 리다이렉트 중 로딩 표시
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">
          {isLoading ? '인증 상태를 확인하는 중입니다...' : '페이지를 이동 중입니다...'}
        </p>
      </div>
    </div>
  );
}
