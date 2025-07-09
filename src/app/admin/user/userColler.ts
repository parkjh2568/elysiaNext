import { User, CreateUserRequest, UpdateUserRequest } from '@/backend/v1/user/userService'

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export async function getAllUsers(): Promise<ApiResponse<User[]>> {
  try {
    const response = await fetch('/api/v1/user')
    return await response.json()
  } catch (error) {
    return {
      success: false,
      error: '유저 목록을 불러오는데 실패했습니다.'
    }
  }
}

export async function getUserById(id: string): Promise<ApiResponse<User>> {
  try {
    const response = await fetch(`/api/v1/user/${id}`)
    return await response.json()
  } catch (error) {
    return {
      success: false,
      error: '유저 정보를 불러오는데 실패했습니다.'
    }
  }
}

export async function createUser(userData: CreateUserRequest): Promise<ApiResponse<User>> {
  try {
    const response = await fetch('/api/v1/user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    })
    return await response.json()
  } catch (error) {
    return {
      success: false,
      error: '유저 생성에 실패했습니다.'
    }
  }
}

export async function updateUser(id: string, userData: UpdateUserRequest): Promise<ApiResponse<User>> {
  try {
    const response = await fetch(`/api/v1/user/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    })
    return await response.json()
  } catch (error) {
    return {
      success: false,
      error: '유저 수정에 실패했습니다.'
    }
  }
}

export async function deleteUser(id: string): Promise<ApiResponse<null>> {
  try {
    const response = await fetch(`/api/v1/user/${id}`, {
      method: 'DELETE',
    })
    return await response.json()
  } catch (error) {
    return {
      success: false,
      error: '유저 삭제에 실패했습니다.'
    }
  }
} 