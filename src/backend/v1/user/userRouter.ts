import { Elysia, t } from 'elysia'
import { node } from '@elysiajs/node'
import { UsersService } from './userService'

export const usersRouter = new Elysia({ prefix: '/user', adapter: node() })
  // 모든 유저 조회
  .get('/', () => {
    try {
      console.log('getAllUsers')
      const users = UsersService.getAll()
      console.log('users', users)
      return {
        success: true,
        data: users
      }
    } catch (error) {
      return {
        success: false,
        error: '유저 목록을 불러오는데 실패했습니다.'
      }
    }
  })

  // 특정 유저 조회
  .get('/:id', ({ params: { id } }) => {
    try {
      const user = UsersService.getById(id)
      if (!user) {
        return {
          success: false,
          error: '유저를 찾을 수 없습니다.'
        }
      }
      return {
        success: true,
        data: user
      }
    } catch (error) {
      return {
        success: false,
        error: '유저 정보를 불러오는데 실패했습니다.'
      }
    }
  })

  // 새 유저 생성
  .post('/', ({ body }) => {
    try {
      const { name, email, role } = body as any
      
      // 이메일 중복 확인
      const existingUser = UsersService.findByEmail(email)
      if (existingUser) {
        return {
          success: false,
          error: '이미 등록된 이메일입니다.'
        }
      }

      const newUser = UsersService.create({ name, email, role })
      return {
        success: true,
        data: newUser
      }
    } catch (error) {
      return {
        success: false,
        error: '유저 생성에 실패했습니다.'
      }
    }
  }, {
    schema: {
      body: t.Object({
        name: t.String({ minLength: 1 }),
        email: t.String({ format: 'email' }),
        role: t.Union([t.Literal('admin'), t.Literal('user')])
      })
    }
  })

  // 유저 정보 수정
  .put('/:id', ({ params: { id }, body }) => {
    try {
      const user = UsersService.getById(id)
      if (!user) {
        return {
          success: false,
          error: '유저를 찾을 수 없습니다.'
        }
      }

      const { name, email, role } = body as any
      
      // 이메일 중복 확인 (자기 자신 제외)
      if (email && email !== user.email) {
        const existingUser = UsersService.findByEmail(email)
        if (existingUser) {
          return {
            success: false,
            error: '이미 등록된 이메일입니다.'
          }
        }
      }

      const updatedUser = UsersService.update(id, { name, email, role })
      return {
        success: true,
        data: updatedUser
      }
    } catch (error) {
      return {
        success: false,
        error: '유저 수정에 실패했습니다.'
      }
    }
  }, {
    schema: {
      body: t.Object({
        name: t.Optional(t.String({ minLength: 1 })),
        email: t.Optional(t.String({ format: 'email' })),
        role: t.Optional(t.Union([t.Literal('admin'), t.Literal('user')]))
      })
    }
  })

  // 유저 삭제
  .delete('/:id', ({ params: { id } }) => {
    try {
      const success = UsersService.delete(id)
      if (!success) {
        return {
          success: false,
          error: '유저를 찾을 수 없습니다.'
        }
      }
      return {
        success: true,
        message: '유저가 성공적으로 삭제되었습니다.'
      }
    } catch (error) {
      return {
        success: false,
        error: '유저 삭제에 실패했습니다.'
      }
    }
  }) 