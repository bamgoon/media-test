import { Link } from "react-router-dom";
import pages from "../pages";

export default function MainPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* 헤더 */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Media Test Tools</h1>
          <p className="text-lg text-gray-600">미디어 관련 브라우저 지원 기능을 테스트해보세요</p>
        </div>

        {/* 페이지 목록 */}
        <div className="space-y-4">
          {pages.map((page) => (
            <Link
              key={page.path}
              to={page.path}
              className="block bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md hover:border-gray-300 transition-all duration-200 group"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                    {page.name}
                  </h3>
                  <p className="mt-2 text-sm text-gray-500">{page.description}</p>
                </div>
                <div className="ml-4">
                  <svg
                    className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* 푸터 */}
        <div className="mt-16 text-center">
          <p className="text-sm text-gray-500">각 도구를 클릭하여 테스트를 시작하세요</p>
        </div>
      </div>
    </div>
  );
}
