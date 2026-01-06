'use client';
import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import Link from 'next/link';

function ErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-center mb-6">Auto Apply Web</h1>
        
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded">
          <p className="text-red-700 font-semibold mb-2">⚠️ Lỗi Xác Thực</p>
          <p className="text-red-600 text-sm">
            {error === 'OAuthCallback' && 'Không thể kết nối với Google. Vui lòng thử lại.'}
            {error === 'OAuthSignin' && 'Lỗi khi bắt đầu đăng nhập. Vui lòng thử lại.'}
            {error === 'OAuthAccountNotLinked' && 'Email này chưa được liên kết. Vui lòng thử lại.'}
            {!error && 'Đã xảy ra lỗi. Vui lòng thử lại.'}
          </p>
        </div>

        <button
          onClick={() => signIn('google', { redirect: true, callbackUrl: '/' })}
          className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
        >
          Thử lại - Đăng Nhập với Google
        </button>

        <div className="mt-4 text-center">
          <Link href="/" className="text-blue-600 hover:text-blue-700 text-sm">
            ← Quay lại trang chủ
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function ErrorPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
      <ErrorContent />
    </Suspense>
  );
}
