export interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'user'
  createdAt: Date
  updatedAt: Date
}

export interface CreateUserRequest {
  name: string
  email: string
  role: 'admin' | 'user'
}

export interface UpdateUserRequest {
  name?: string
  email?: string
  role?: 'admin' | 'user'
}

export type UserRole = 'admin' | 'user' 