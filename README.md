# Next.js + Elysia 보안 인증 시스템

**안전하고 대중적인 토큰 관리 시스템**이 적용된 Next.js + Elysia 프로젝트입니다.

## 🔒 보안 기능

### 토큰 관리 시스템
- **Access Token + Refresh Token** 방식 적용
- **Access Token**: 15분 만료 (API 요청용)
- **Refresh Token**: 7일 만료 (토큰 갱신용)
- **자동 토큰 갱신**: 만료 시 자동으로 새로운 토큰 발급
- **ddunigma/node**를 이용한 토큰 암호화

### 보안 강화 기능
- localStorage에 암호화된 토큰 저장
- 매 API 요청마다 토큰 유효성 자동 검증
- 토큰 만료 시 자동 갱신 또는 로그아웃
- 5분마다 정기적인 토큰 상태 확인
- 서버 측 Refresh Token 무효화 지원

## 🚀 시작하기

### 1. 환경 변수 설정

프로젝트 루트에 `.env.local` 파일을 생성하고 다음 환경 변수를 설정하세요:

```bash
# JWT 시크릿 키들 (프로덕션에서는 강력한 랜덤 키 사용)
JWT_SECRET=your-strong-jwt-secret-key-here-32-characters
JWT_REFRESH_SECRET=your-strong-jwt-refresh-secret-key-here-32-characters

# 암호화 키 (토큰과 사용자 데이터 암호화용)
NEXT_PUBLIC_ENCRYPTION_KEY=your-encryption-key-32-characters!!
```

**⚠️ 주의사항:**
- 프로덕션 환경에서는 반드시 강력한 랜덤 키를 사용하세요
- 키는 최소 32자 이상으로 설정하세요
- 소스 코드에 실제 키를 커밋하지 마세요

### 2. 의존성 설치 및 개발 서버 실행

```bash
npm install
# 그리고
npm run dev
```

[http://localhost:3000](http://localhost:3000)에서 결과를 확인할 수 있습니다.

### 3. 테스트 계정

```
이메일: admin@example.com
비밀번호: password123
```

## 🏗️ 프로젝트 구조

```
src/
├── app/
│   ├── admin/           # 관리자 페이지
│   │   ├── login/       # 로그인 페이지
│   │   ├── dashboard/   # 대시보드
│   │   └── user/        # 사용자 관리
│   └── api/
│       └── [[...slugs]]/# Elysia API 라우터
├── backend/
│   ├── elysia.ts        # Elysia 서버 설정
│   └── v1/
│       ├── auth/        # 인증 API
│       └── user/        # 사용자 API
├── components/
│   └── features/
│       └── auth/        # 인증 관련 컴포넌트
├── lib/
│   └── utils/
│       ├── apiClient.ts # 자동 토큰 갱신 API 클라이언트
│       ├── crypto.ts    # 암호화/복호화 유틸리티
│       └── localStorage.ts # 안전한 로컬 저장소
└── types/               # TypeScript 타입 정의
```

## 🔧 주요 기능

### 인증 시스템
- **자동 토큰 갱신**: Access Token 만료 시 Refresh Token으로 자동 갱신
- **암호화된 저장**: localStorage에 암호화된 형태로 토큰 저장
- **매 요청 검증**: API 요청마다 토큰 유효성 자동 확인
- **보안 로그아웃**: 서버에서 Refresh Token 무효화 후 로컬 데이터 삭제

### API 클라이언트
```typescript
import { apiClient } from '@/lib/utils/apiClient';

// 자동 토큰 갱신이 적용된 API 호출
const response = await apiClient.get('/api/v1/users');
const result = await apiClient.post('/api/v1/users', userData);
```

### 인증 상태 관리
```typescript
import { useAuth } from '@/components/features/auth/AuthProvider';

const { user, isLoggedIn, logout, hasValidAccessToken } = useAuth();
```

## 🛡️ 보안 고려사항

1. **토큰 만료 시간**: Access Token은 15분, Refresh Token은 7일로 설정
2. **자동 갱신**: 토큰 만료 5분 전부터 자동 갱신 시도
3. **암호화**: ddunigma/node를 이용한 토큰 암호화
4. **무효화**: 로그아웃 시 서버에서 Refresh Token 무효화
5. **정기 확인**: 5분마다 토큰 상태 자동 확인

## 📚 기술 스택

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Backend**: Elysia, Node.js
- **인증**: JWT (Access + Refresh Token)
- **암호화**: @ddunigma/node
- **상태 관리**: React Context API

## 🔄 API 엔드포인트

### 인증 API
- `POST /api/v1/auth/login` - 로그인
- `POST /api/v1/auth/refresh` - 토큰 갱신
- `POST /api/v1/auth/logout` - 로그아웃
- `POST /api/v1/auth/validate` - 토큰 검증
- `GET /api/v1/auth/me` - 현재 사용자 정보

### 사용자 API
- `GET /api/v1/user` - 사용자 목록
- `POST /api/v1/user` - 사용자 생성
- `PUT /api/v1/user/:id` - 사용자 수정
- `DELETE /api/v1/user/:id` - 사용자 삭제

## 📖 학습 자료

- [Next.js Documentation](https://nextjs.org/docs)
- [Elysia Documentation](https://elysiajs.com)
- [JWT Best Practices](https://auth0.com/blog/a-look-at-the-latest-draft-for-jwt-bcp/)

## 🚀 배포

Vercel에서의 배포가 가장 쉽습니다:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

배포 시 환경 변수를 반드시 설정해주세요!
