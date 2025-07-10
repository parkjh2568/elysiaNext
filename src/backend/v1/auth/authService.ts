import crypto from 'crypto';

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresAt: number;
  refreshTokenExpiresAt: number;
}

export interface AuthResponse {
  success: boolean;
  tokens?: TokenPair;
  user?: User;
  message?: string;
}

export interface RefreshResponse {
  success: boolean;
  tokens?: TokenPair;
  message?: string;
}

export interface JWTInstances {
  accessJwt: any; // Elysia JWT 인스턴스
  refreshJwt: any; // Elysia Refresh JWT 인스턴스
}

class AuthService {
  // 활성 Refresh Token 저장소 (실제로는 Redis나 데이터베이스 사용)
  private readonly activeRefreshTokens = new Set<string>();

  // 임시 사용자 데이터 (실제로는 데이터베이스에서 조회)
  private readonly users: User[] = [
    {
      id: '1',
      email: 'admin@example.com',
      name: '관리자',
      role: 'admin'
    }
  ];

  // 임시 비밀번호 저장소 (실제로는 해시된 비밀번호를 데이터베이스에 저장)
  private readonly passwords: Record<string, string> = {
    'admin@example.com': 'password123'
  };

  /**
   * Access Token과 Refresh Token 쌍 생성
   */
  async generateTokenPair(user: User, jwtInstances: JWTInstances): Promise<TokenPair> {
    const now = Date.now();
    const accessTokenExpiresAt = now + (15 * 60 * 1000); // 15분
    const refreshTokenExpiresAt = now + (7 * 24 * 60 * 60 * 1000); // 7일

    // Access Token 생성
    const accessToken = await jwtInstances.accessJwt.sign({
      userId: user.id,
      email: user.email,
      role: user.role,
      type: 'access'
    });

    // Refresh Token 생성 (랜덤 ID 포함)
    const refreshTokenId = crypto.randomUUID();
    const refreshToken = await jwtInstances.refreshJwt.sign({
      userId: user.id,
      tokenId: refreshTokenId,
      type: 'refresh'
    });

    // 활성 Refresh Token으로 등록
    this.activeRefreshTokens.add(refreshTokenId);

    return {
      accessToken,
      refreshToken,
      accessTokenExpiresAt,
      refreshTokenExpiresAt
    };
  }

  async login(email: string, password: string, jwtInstances: JWTInstances): Promise<AuthResponse> {
    try {
      // 사용자 조회
      const user = this.users.find(u => u.email === email);
      if (!user) {
        return {
          success: false,
          message: '사용자를 찾을 수 없습니다.'
        };
      }

      // 비밀번호 확인
      const storedPassword = this.passwords[email];
      if (!storedPassword || storedPassword !== password) {
        return {
          success: false,
          message: '이메일 또는 비밀번호가 잘못되었습니다.'
        };
      }

      // 토큰 쌍 생성
      const tokens = await this.generateTokenPair(user, jwtInstances);

      return {
        success: true,
        tokens,
        user
      };
    } catch (error) {
      console.error('Login service error:', error);
      return {
        success: false,
        message: '로그인 처리 중 오류가 발생했습니다.'
      };
    }
  }

  async validateAccessToken(token: string, jwtInstances: JWTInstances): Promise<boolean> {
    try {
      const decoded = await jwtInstances.accessJwt.verify(token);
      return decoded && decoded.type === 'access';
    } catch (error) {
      console.error('Access token validation error:', error);
      return false;
    }
  }

  async getUserFromAccessToken(token: string, jwtInstances: JWTInstances): Promise<User | null> {
    try {
      const decoded = await jwtInstances.accessJwt.verify(token);
      if (!decoded || decoded.type !== 'access') {
        return null;
      }
      const user = this.users.find(u => u.id === decoded.userId);
      return user || null;
    } catch (error) {
      console.error('Get user from access token error:', error);
      return null;
    }
  }

  async refreshTokens(refreshToken: string, jwtInstances: JWTInstances): Promise<RefreshResponse> {
    try {
      // Refresh Token 검증
      const decoded = await jwtInstances.refreshJwt.verify(refreshToken);
      
      if (!decoded || decoded.type !== 'refresh') {
        return {
          success: false,
          message: '유효하지 않은 refresh token 타입입니다.'
        };
      }

      // 토큰이 활성 상태인지 확인
      if (!this.activeRefreshTokens.has(decoded.tokenId)) {
        return {
          success: false,
          message: '만료되거나 무효한 refresh token입니다.'
        };
      }

      // 사용자 조회
      const user = this.users.find(u => u.id === decoded.userId);
      if (!user) {
        return {
          success: false,
          message: '사용자를 찾을 수 없습니다.'
        };
      }

      // 기존 Refresh Token 무효화
      this.activeRefreshTokens.delete(decoded.tokenId);

      // 새로운 토큰 쌍 생성
      const tokens = await this.generateTokenPair(user, jwtInstances);

      return {
        success: true,
        tokens
      };
    } catch (error) {
      console.error('Refresh token error:', error);
      return {
        success: false,
        message: 'Refresh token 처리 중 오류가 발생했습니다.'
      };
    }
  }

  async logout(refreshToken: string, jwtInstances: JWTInstances): Promise<{ success: boolean; message?: string }> {
    try {
      const decoded = await jwtInstances.refreshJwt.verify(refreshToken);
      
      if (decoded && decoded.type === 'refresh' && decoded.tokenId) {
        // Refresh Token 무효화
        this.activeRefreshTokens.delete(decoded.tokenId);
      }

      return {
        success: true,
        message: '로그아웃이 완료되었습니다.'
      };
    } catch (error) {
      console.error('Logout error:', error);
      return {
        success: false,
        message: '로그아웃 처리 중 오류가 발생했습니다.'
      };
    }
  }

  // 호환성을 위해 기존 메서드들 유지 (deprecated)
  async validateToken(token: string, jwtInstances: JWTInstances): Promise<boolean> {
    return this.validateAccessToken(token, jwtInstances);
  }

  async getUserFromToken(token: string, jwtInstances: JWTInstances): Promise<User | null> {
    return this.getUserFromAccessToken(token, jwtInstances);
  }
}

export const authService = new AuthService(); 