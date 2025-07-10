import { Elysia, t } from 'elysia';
import { jwt } from '@elysiajs/jwt';
import { authService } from './authService';

// JWT 설정
const jwtConfig = {
  name: 'jwt',
  secret: process.env.JWT_SECRET || 'your-secret-key',
  exp: '15m' // 15분
};

const refreshJwtConfig = {
  name: 'refreshJwt',
  secret: process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key',
  exp: '7d' // 7일
};

export const authRouter = new Elysia({ prefix: '/auth' })
  .use(jwt(jwtConfig))
  .use(jwt(refreshJwtConfig))
  .post('/login', async ({ body, set, jwt, refreshJwt }) => {
    try {
      const { email, password } = body;
      
      const jwtInstances = {
        accessJwt: jwt,
        refreshJwt: refreshJwt
      };
      
      const result = await authService.login(email, password, jwtInstances);
      
      if (!result.success) {
        set.status = 401;
        return {
          success: false,
          message: result.message || '로그인에 실패했습니다.'
        };
      }
      
      return {
        success: true,
        tokens: result.tokens,
        user: result.user
      };
    } catch (error) {
      console.error('Login error:', error);
      set.status = 500;
      return {
        success: false,
        message: '서버 오류가 발생했습니다.'
      };
    }
  }, {
    body: t.Object({
      email: t.String(),
      password: t.String()
    })
  })
  
  .post('/validate', async ({ headers, set, jwt, refreshJwt }) => {
    try {
      const authHeader = headers.authorization;
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        set.status = 401;
        return { success: false, message: '토큰이 필요합니다.' };
      }
      
      const token = authHeader.substring(7);
      const jwtInstances = {
        accessJwt: jwt,
        refreshJwt: refreshJwt
      };
      
      const isValid = await authService.validateAccessToken(token, jwtInstances);
      
      if (!isValid) {
        set.status = 401;
        return { success: false, message: '유효하지 않은 토큰입니다.' };
      }
      
      return { success: true };
    } catch (error) {
      console.error('Token validation error:', error);
      set.status = 500;
      return {
        success: false,
        message: '토큰 검증 중 오류가 발생했습니다.'
      };
    }
  })
  
  .get('/me', async ({ headers, set, jwt, refreshJwt }) => {
    try {
      const authHeader = headers.authorization;
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        set.status = 401;
        return { success: false, message: '토큰이 필요합니다.' };
      }
      
      const token = authHeader.substring(7);
      const jwtInstances = {
        accessJwt: jwt,
        refreshJwt: refreshJwt
      };
      
      const user = await authService.getUserFromAccessToken(token, jwtInstances);
      
      if (!user) {
        set.status = 401;
        return { success: false, message: '유효하지 않은 토큰입니다.' };
      }
      
      return { success: true, user };
    } catch (error) {
      console.error('Get user error:', error);
      set.status = 500;
      return {
        success: false,
        message: '사용자 정보 조회 중 오류가 발생했습니다.'
      };
    }
  })

  .post('/refresh', async ({ body, set, jwt, refreshJwt }) => {
    try {
      const { refreshToken } = body;
      
      if (!refreshToken) {
        set.status = 400;
        return { success: false, message: 'Refresh token이 필요합니다.' };
      }
      
      const jwtInstances = {
        accessJwt: jwt,
        refreshJwt: refreshJwt
      };
      
      const result = await authService.refreshTokens(refreshToken, jwtInstances);
      
      if (!result.success) {
        set.status = 401;
        return {
          success: false,
          message: result.message || 'Token 갱신에 실패했습니다.'
        };
      }
      
      return {
        success: true,
        tokens: result.tokens
      };
    } catch (error) {
      console.error('Refresh token error:', error);
      set.status = 500;
      return {
        success: false,
        message: 'Token 갱신 중 오류가 발생했습니다.'
      };
    }
  }, {
    body: t.Object({
      refreshToken: t.String()
    })
  })

  .post('/logout', async ({ body, set, jwt, refreshJwt }) => {
    try {
      const { refreshToken } = body;
      
      if (!refreshToken) {
        set.status = 400;
        return { success: false, message: 'Refresh token이 필요합니다.' };
      }
      
      const jwtInstances = {
        accessJwt: jwt,
        refreshJwt: refreshJwt
      };
      
      const result = await authService.logout(refreshToken, jwtInstances);
      
      return {
        success: result.success,
        message: result.message
      };
    } catch (error) {
      console.error('Logout error:', error);
      set.status = 500;
      return {
        success: false,
        message: '로그아웃 중 오류가 발생했습니다.'
      };
    }
  }, {
    body: t.Object({
      refreshToken: t.String()
    })
  }); 