import jwt from 'jsonwebtoken';

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

class AuthService {
  private readonly JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
  private readonly JWT_EXPIRES_IN = '24h';

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

  async login(email: string, password: string): Promise<AuthResponse> {
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

      // JWT 토큰 생성
      const token = jwt.sign(
        { 
          userId: user.id,
          email: user.email,
          role: user.role
        },
        this.JWT_SECRET,
        { expiresIn: this.JWT_EXPIRES_IN }
      );

      return {
        success: true,
        token,
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

  async validateToken(token: string): Promise<boolean> {
    try {
      const decoded = jwt.verify(token, this.JWT_SECRET);
      return !!decoded;
    } catch (error) {
      console.error('Token validation error:', error);
      return false;
    }
  }

  async getUserFromToken(token: string): Promise<User | null> {
    try {
      const decoded = jwt.verify(token, this.JWT_SECRET) as any;
      const user = this.users.find(u => u.id === decoded.userId);
      return user || null;
    } catch (error) {
      console.error('Get user from token error:', error);
      return null;
    }
  }

  async getUserById(userId: string): Promise<User | null> {
    return this.users.find(u => u.id === userId) || null;
  }
}

export const authService = new AuthService(); 