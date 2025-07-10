import { User } from './user'
import { TokenData } from '@/lib/utils/crypto'

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  success: boolean
  message?: string
  user?: User
  tokens?: {
    accessToken: string
    refreshToken: string
    accessTokenExpiresAt: number
    refreshTokenExpiresAt: number
  }
}

export interface AuthContextType {
  user: User | null
  isLoading: boolean
  isLoggedIn: boolean
  login: (user: User, tokenData: TokenData) => Promise<void>
  logout: () => Promise<void>
  checkAuth: () => boolean
  refreshTokens?: () => Promise<boolean>
  hasValidAccessToken?: () => boolean
} 