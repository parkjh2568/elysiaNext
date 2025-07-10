import { User } from './user'

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  success: boolean
  message?: string
  user?: User
}

export interface AuthContextType {
  user: User | null
  isLoading: boolean
  isLoggedIn: boolean
  login: (user: User) => void
  logout: () => void
  checkAuth: () => boolean
} 