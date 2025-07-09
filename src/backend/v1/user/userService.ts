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

// 임시 메모리 저장소 (실제 프로덕션에서는 데이터베이스 사용)
let users: User[] = [
  {
    id: '1',
    name: '홍길동',
    email: 'hong@example.com',
    role: 'admin',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: '2',
    name: '김철수',
    email: 'kim@example.com',
    role: 'user',
    createdAt: new Date('2024-01-02'),
    updatedAt: new Date('2024-01-02')
  },
  {
    id: '3',
    name: '이영희',
    email: 'lee@example.com',
    role: 'user',
    createdAt: new Date('2024-01-03'),
    updatedAt: new Date('2024-01-03')
  }
]

export class UsersService {
  static getAll(): User[] {
    return users
  }

  static getById(id: string): User | null {
    return users.find(user => user.id === id) || null
  }

  static create(userData: CreateUserRequest): User {
    const newUser: User = {
      id: Date.now().toString(), // 임시 ID 생성
      ...userData,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    users.push(newUser)
    return newUser
  }

  static update(id: string, updateData: UpdateUserRequest): User | null {
    const userIndex = users.findIndex(user => user.id === id)
    if (userIndex === -1) return null

    const updatedUser = {
      ...users[userIndex],
      ...updateData,
      updatedAt: new Date()
    }
    users[userIndex] = updatedUser
    return updatedUser
  }

  static delete(id: string): boolean {
    const userIndex = users.findIndex(user => user.id === id)
    if (userIndex === -1) return false

    users.splice(userIndex, 1)
    return true
  }

  static findByEmail(email: string): User | null {
    return users.find(user => user.email === email) || null
  }
} 