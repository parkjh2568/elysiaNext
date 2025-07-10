import type { User, CreateUserRequest, UpdateUserRequest } from '@/types/user'
import type { ApiResponse } from '@/types/api'
import { apiClient } from '@/lib/utils/apiClient'

const BASE_URL = '/api/v1/user'

// 모든 사용자 조회
export const getAllUsers = async (): Promise<ApiResponse<User[]>> => {
  try {
    const response = await apiClient.get<User[]>(BASE_URL)
    
    if (response.success) {
      return {
        success: true,
        data: response.data || response.users || []
      }
    } else {
      return {
        success: false,
        error: response.message || '사용자 목록을 불러오는데 실패했습니다.'
      }
    }
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
    const response = await apiClient.get<User>(`${BASE_URL}/${id}`)
    
    if (response.success) {
      return {
        success: true,
        data: response.data || response.user
      }
    } else {
      return {
        success: false,
        error: response.message || '사용자 정보를 불러오는데 실패했습니다.'
      }
    }
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
    const response = await apiClient.post<User>(BASE_URL, userData)
    
    if (response.success) {
      return {
        success: true,
        data: response.data || response.user
      }
    } else {
      return {
        success: false,
        error: response.message || '사용자 생성에 실패했습니다.'
      }
    }
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
    const response = await apiClient.put<User>(`${BASE_URL}/${id}`, updateData)
    
    if (response.success) {
      return {
        success: true,
        data: response.data || response.user
      }
    } else {
      return {
        success: false,
        error: response.message || '사용자 정보 수정에 실패했습니다.'
      }
    }
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
    const response = await apiClient.delete(`${BASE_URL}/${id}`)
    
    if (response.success) {
      return {
        success: true,
        data: true
      }
    } else {
      return {
        success: false,
        error: response.message || '사용자 삭제에 실패했습니다.'
      }
    }
  } catch (error) {
    console.error('사용자 삭제 오류:', error)
    return {
      success: false,
      error: '사용자 삭제에 실패했습니다.'
    }
  }
} 