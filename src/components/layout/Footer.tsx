export function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            © 2024 관리자 대시보드. All rights reserved.
          </div>
          <div className="flex space-x-6">
            <a href="#" className="text-sm text-gray-600 hover:text-gray-900">
              고객지원
            </a>
            <a href="#" className="text-sm text-gray-600 hover:text-gray-900">
              개인정보처리방침
            </a>
            <a href="#" className="text-sm text-gray-600 hover:text-gray-900">
              이용약관
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
} 