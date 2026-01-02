'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';

export default function SettingsPage() {
  const router = useRouter();
  const [folderId, setFolderId] = useState('');
  const [savedMessage, setSavedMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load folder ID from localStorage
    const saved = localStorage.getItem('googleDriveFolderId');
    if (saved) {
      setFolderId(saved);
    }
    setLoading(false);
  }, []);

  const handleSave = () => {
    if (!folderId.trim()) {
      setSavedMessage('❌ Vui lòng nhập folder ID');
      setTimeout(() => setSavedMessage(''), 3000);
      return;
    }

    localStorage.setItem('googleDriveFolderId', folderId.trim());
    setSavedMessage('✅ Đã lưu folder ID');
    setTimeout(() => setSavedMessage(''), 3000);
  };

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push('/auth/signin');
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-extrabold text-white">⚙️ Cấu Hình</h1>
          <Link
            href="/"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all"
          >
            ← Quay lại
          </Link>
        </div>

        {savedMessage && (
          <div className={`mb-6 px-6 py-4 rounded-lg text-center font-bold text-white ${
            savedMessage.includes('✅') ? 'bg-green-500' : 'bg-red-500'
          }`}>
            {savedMessage}
          </div>
        )}

        <div className="bg-white rounded-lg shadow-lg p-8 space-y-6">
          {/* Google Drive Folder ID */}
          <div>
            <label className="block text-lg font-bold text-slate-900 mb-3">
              📁 Google Drive Folder ID
            </label>
            <p className="text-sm text-slate-600 mb-4">
              Nhập ID của thư mục trên Google Drive chứa các CV của bạn. 
              <br />
              Cách lấy ID: Mở folder trên Drive, copy phần ID từ URL.
              <br />
              <span className="text-xs text-slate-500 mt-2 block">
                VD: https://drive.google.com/drive/folders/<span className="font-mono bg-slate-100 px-1">1z7sfz3jRazyk9aVjHfOaVoCslkerjBF3</span>
              </span>
            </p>
            
            <input
              type="text"
              value={folderId}
              onChange={(e) => setFolderId(e.target.value)}
              placeholder="Nhập folder ID..."
              className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg font-mono text-sm focus:outline-none focus:border-blue-500 transition-all"
            />

            <button
              onClick={handleSave}
              className="mt-4 w-full py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-all"
            >
              💾 Lưu Folder ID
            </button>
          </div>

          <hr className="my-6" />

          {/* Account Info */}
          <div>
            <h2 className="text-xl font-bold text-slate-900 mb-4">👤 Tài Khoản</h2>
            
            <button
              onClick={handleLogout}
              className="w-full py-3 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 transition-all"
            >
              🚪 Đăng Xuất
            </button>
          </div>

          <hr className="my-6" />

          {/* Help */}
          <div>
            <h2 className="text-xl font-bold text-slate-900 mb-4">❓ Trợ Giúp</h2>
            <div className="space-y-4 text-sm text-slate-700">
              <div>
                <h3 className="font-bold mb-2">Cách lấy Folder ID từ Google Drive:</h3>
                <ol className="list-decimal list-inside space-y-2 ml-2">
                  <li>Mở Google Drive</li>
                  <li>Tìm thư mục chứa CV của bạn</li>
                  <li>Mở thư mục đó</li>
                  <li>Sao chép phần ID từ thanh địa chỉ
                    <br />
                    <span className="font-mono bg-slate-100 px-2 py-1 rounded text-xs">
                      https://drive.google.com/drive/folders/[ID]
                    </span>
                  </li>
                  <li>Dán ID vào ô trên</li>
                  <li>Nhấn "Lưu Folder ID"</li>
                </ol>
              </div>

              <div>
                <h3 className="font-bold mb-2">Lưu ý:</h3>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Thư mục phải được chia sẻ hoặc sở hữu bởi tài khoản Google của bạn</li>
                  <li>Các file PDF, Word được hỗ trợ</li>
                  <li>Folder ID lưu trên thiết bị này, không được gửi lên server</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
