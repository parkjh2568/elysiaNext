'use client'

import { useState, useEffect } from 'react'
import { Plus, RefreshCw } from 'lucide-react'
import type { User } from '@/types/user'
import { UserTable } from './_components/UserTable'
import { UserModal } from './_components/UserModal'
import { getAllUsers, createUser, updateUser, deleteUser } from '@/app/admin/user/_lib/users'
import { AuthGuard } from '@/components/features/auth/AuthGuard'

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | undefined>(undefined)
  const [error, setError] = useState<string | null>(null)

  // 유저 목록 불러오기
  const fetchUsers = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await getAllUsers()
      if (response.success && response.data) {
        setUsers(response.data)
      } else {
        setError(response.error || '유저 목록을 불러오는데 실패했습니다.')
      }
    } catch (error) {
      setError('유저 목록을 불러오는데 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  // 새 유저 추가 모달 열기
  const handleAddUser = () => {
    setSelectedUser(undefined)
    setIsModalOpen(true)
  }

  // 유저 편집 모달 열기
  const handleEditUser = (user: User) => {
    setSelectedUser(user)
    setIsModalOpen(true)
  }

  // 유저 저장 (생성 또는 수정)
  const handleSaveUser = async (userData: any) => {
    try {
      let response
      if (selectedUser) {
        // 수정
        response = await updateUser(selectedUser.id, userData)
      } else {
        // 생성
        response = await createUser(userData)
      }

      if (response.success) {
        await fetchUsers() // 목록 새로고침
        setIsModalOpen(false)
      } else {
        alert(response.error || '유저 저장에 실패했습니다.')
      }
    } catch (error) {
      alert('유저 저장에 실패했습니다.')
    }
  }

  // 유저 삭제
  const handleDeleteUser = async (id: string) => {
    if (!confirm('정말로 이 유저를 삭제하시겠습니까?')) {
      return
    }

    try {
      const response = await deleteUser(id)
      if (response.success) {
        await fetchUsers() // 목록 새로고침
      } else {
        alert(response.error || '유저 삭제에 실패했습니다.')
      }
    } catch (error) {
      alert('유저 삭제에 실패했습니다.')
    }
  }

  return (
    <AuthGuard>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">유저 관리</h1>
            <p className="text-gray-600 mt-2">시스템 사용자를 관리할 수 있습니다.</p>
          </div>
        <div className="flex space-x-3">
          <button
            onClick={fetchUsers}
            disabled={loading}
            className="flex items-center px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 transition-colors"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            새로고침
          </button>
          <button
            onClick={handleAddUser}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            새 유저 추가
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            전체 유저 ({users.length}명)
          </h2>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
            <span className="ml-2 text-gray-600">로딩 중...</span>
          </div>
        ) : (
          <UserTable
            users={users}
            onEdit={handleEditUser}
            onDelete={handleDeleteUser}
          />
        )}
      </div>

      <UserModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        user={selectedUser}
        onSave={handleSaveUser}
        title={selectedUser ? '유저 수정' : '새 유저 추가'}
      />
      </div>
    </AuthGuard>
  )
} 