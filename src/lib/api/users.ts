import type { User, CreateUserRequest, UpdateUserRequest } from '@/types/user'
import type { ApiResponse } from '@/types/api'

const BASE_URL = '/api/v1/user'

// 모든 사용자 조회
export const getAllUsers = async (): Promise<ApiResponse<User[]>> => {
  try {
    const response = await fetch(BASE_URL)
    const data = await response.json()
    return data
  } catch (error) {
    console.error('사용자 목록 조회 오류:', error)
    return {
      success: false,
      error: '사용자 목록을 불러오는데 실패했습니다.'
    }
  }
}

// 특정 사용자 조회
export const getUserById = async (id: string): Promise<ApiResponse<User>> => {
  try {
    const response = await fetch(`${BASE_URL}/${id}`)
    const data = await response.json()
    return data
  } catch (error) {
    console.error('사용자 조회 오류:', error)
    return {
      success: false,
      error: '사용자 정보를 불러오는데 실패했습니다.'
    }
  }
}

// 새 사용자 생성
export const createUser = async (userData: CreateUserRequest): Promise<ApiResponse<User>> => {
  try {
    const response = await fetch(BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    })
    const data = await response.json()
    return data
  } catch (error) {
    console.error('사용자 생성 오류:', error)
    return {
      success: false,
      error: '사용자 생성에 실패했습니다.'
    }
  }
}

// 사용자 정보 수정
export const updateUser = async (id: string, updateData: UpdateUserRequest): Promise<ApiResponse<User>> => {
  try {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updateData)
    })
    const data = await response.json()
    return data
  } catch (error) {
    console.error('사용자 수정 오류:', error)
    return {
      success: false,
      error: '사용자 정보 수정에 실패했습니다.'
    }
  }
}

// 사용자 삭제
export const deleteUser = async (id: string): Promise<ApiResponse<boolean>> => {
  try {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: 'DELETE'
    })
    const data = await response.json()
    return data
  } catch (error) {
    console.error('사용자 삭제 오류:', error)
    return {
      success: false,
      error: '사용자 삭제에 실패했습니다.'
    }
  }
} 