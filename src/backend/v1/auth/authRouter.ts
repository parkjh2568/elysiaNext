import { Elysia, t } from 'elysia';
import { authService } from './authService';

export const authRouter = new Elysia({ prefix: '/auth' })
  .post('/login', async ({ body, set }) => {
    try {
      const { email, password } = body;
      
      const result = await authService.login(email, password);
      
      if (!result.success) {
        set.status = 401;
        return {
          success: false,
          message: result.message || '로그인에 실패했습니다.'
        };
      }
      
      return {
        success: true,
        token: result.token,
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
  
  .post('/validate', async ({ headers, set }) => {
    try {
      const authHeader = headers.authorization;
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        set.status = 401;
        return { success: false, message: '토큰이 필요합니다.' };
      }
      
      const token = authHeader.substring(7);
      const isValid = await authService.validateToken(token);
      
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
  
  .get('/user', async ({ headers, set }) => {
    try {
      const authHeader = headers.authorization;
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        set.status = 401;
        return { success: false, message: '토큰이 필요합니다.' };
      }
      
      const token = authHeader.substring(7);
      const user = await authService.getUserFromToken(token);
      
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
  }); 