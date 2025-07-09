'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import Header from './Header'
import Sidebar from './Sidebar'
import Footer from './Footer'

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const pathname = usePathname()

  // 로그인 페이지에서는 레이아웃을 적용하지 않음
  const isLoginPage = pathname === '/admin/login'

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  const closeSidebar = () => {
    setIsSidebarOpen(false)
  }

  // 로그인 페이지인 경우 레이아웃 없이 children만 렌더링
  if (isLoginPage) {
    return <>{children}</>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onMenuToggle={toggleSidebar} isSidebarOpen={isSidebarOpen} />
      
      <div className="flex">
        <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
        
        <main className="flex-1 lg:ml-64">
          <div className="pt-16">
            <div className="min-h-[calc(100vh-4rem)] flex flex-col">
              <div className="flex-1 p-6">
                {children}
              </div>
              <Footer />
            </div>
          </div>
        </main>
      </div>
    </div>
  )
} 