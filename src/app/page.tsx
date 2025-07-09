import Image from "next/image";

export default function Home() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">대시보드</h1>
        <p className="text-gray-600 mt-2">관리자 대시보드에 오신 것을 환영합니다.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">전체 사용자</h3>
          <p className="text-3xl font-bold text-blue-600">1,234</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">활성 사용자</h3>
          <p className="text-3xl font-bold text-green-600">987</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">오늘 가입</h3>
          <p className="text-3xl font-bold text-purple-600">23</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">월간 성장률</h3>
          <p className="text-3xl font-bold text-orange-600">12.5%</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">최근 활동</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">새로운 사용자가 가입했습니다</span>
              <span className="text-xs text-gray-400">2분 전</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">시스템 업데이트가 완료되었습니다</span>
              <span className="text-xs text-gray-400">1시간 전</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">백업이 성공적으로 완료되었습니다</span>
              <span className="text-xs text-gray-400">3시간 전</span>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">빠른 액션</h3>
          <div className="space-y-3">
            <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
              새 사용자 추가
            </button>
            <button className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors">
              데이터 내보내기
            </button>
            <button className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors">
              시스템 설정
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
