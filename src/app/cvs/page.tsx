'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

interface CV {
  name: string;
  url: string;
  uploadedAt: string;
}

export default function CVsPage() {
  const [cvs, setCvs] = useState<CV[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCV, setSelectedCV] = useState<CV | null>(null);
  const [deleteMessage, setDeleteMessage] = useState('');

  useEffect(() => {
    loadCVs();
  }, []);

  const loadCVs = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/cv-list');
      const data = await res.json();
      setCvs(data.cvs || []);
      if (data.cvs && data.cvs.length > 0) {
        setSelectedCV(data.cvs[0]);
      }
    } catch (error) {
      console.error('Error loading CVs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCV = async (filename: string) => {
    if (!confirm(`Bạn chắc chắn muốn xóa CV: ${filename}?`)) return;

    try {
      const res = await fetch(`/api/cv-list?filename=${encodeURIComponent(filename)}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setDeleteMessage(`✅ Đã xóa ${filename}`);
        if (selectedCV?.name === filename) {
          setSelectedCV(null);
        }
        loadCVs();
        setTimeout(() => setDeleteMessage(''), 3000);
      } else {
        const data = await res.json();
        setDeleteMessage(`❌ Lỗi: ${data.error}`);
      }
    } catch (error) {
      setDeleteMessage('❌ Xóa CV thất bại');
    }
  };

  const handleSelectCV = (cv: CV) => {
    setSelectedCV(cv);
    // Lưu vào window global để form sử dụng
    fetch(cv.url)
      .then(res => res.blob())
      .then(blob => {
        const reader = new FileReader();
        reader.onload = (event) => {
          (window as any).cvFileData = {
            name: cv.name,
            base64: event.target?.result,
            type: blob.type || 'application/octet-stream',
          };
        };
        reader.readAsDataURL(blob);
      });
  };

  return (
    <main className="min-h-screen bg-slate-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
          <h1 className="text-4xl font-extrabold text-slate-900">📄 Quản Lý CV</h1>
          <div className="flex gap-3">
            <Link
              href="/emails"
              className="px-6 py-3 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700 transition-all"
            >
              📧 Quản Lý Mail
            </Link>
            <Link
              href="/"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all"
            >
              ← Quay lại Form
            </Link>
          </div>
        </div>

        {deleteMessage && (
          <div className={`mb-6 px-6 py-4 rounded-lg text-center font-bold text-white ${
            deleteMessage.includes('✅') ? 'bg-green-500' : 'bg-red-500'
          }`}>
            {deleteMessage}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* CV List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">
                {loading ? '⏳ Đang tải...' : `📋 Danh Sách CV (${cvs.length})`}
              </h2>

              {loading ? (
                <div className="text-center text-slate-500 py-8">
                  ⏳ Đang tải danh sách CV...
                </div>
              ) : cvs.length === 0 ? (
                <div className="text-center text-slate-500 py-8">
                  📭 Chưa có CV nào. Hãy upload CV ở trang chính.
                </div>
              ) : (
                <div className="space-y-3">
                  {cvs.map((cv, index) => (
                    <div
                      key={cv.name}
                      onClick={() => handleSelectCV(cv)}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        selectedCV?.name === cv.name
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-slate-300 bg-white hover:border-slate-400'
                      }`}
                    >
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xl">#{index + 1}</span>
                            <h3 className="font-bold text-slate-900 text-lg break-all">
                              {cv.name}
                            </h3>
                          </div>
                          <p className="text-sm text-slate-500">
                            {cv.uploadedAt}
                          </p>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteCV(cv.name);
                          }}
                          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all font-semibold text-sm whitespace-nowrap"
                        >
                          🗑️ Xóa
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* CV Preview */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-20">
              <h2 className="text-xl font-bold text-slate-900 mb-4">
                👁️ Xem Trước
              </h2>

              {selectedCV ? (
                <div className="space-y-3">
                  <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                    <p className="text-xs font-semibold text-slate-600 mb-2">
                      CV Được Chọn:
                    </p>
                    <p className="text-sm text-slate-900 font-mono break-all">
                      {selectedCV.name}
                    </p>
                  </div>

                  <a
                    href={selectedCV.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full text-center py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all"
                  >
                    👁️ Xem CV
                  </a>

                  <a
                    href={selectedCV.url}
                    download={selectedCV.name}
                    className="block w-full text-center py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-all"
                  >
                    ⬇️ Tải Xuống
                  </a>
                </div>
              ) : (
                <div className="text-center text-slate-500 py-8">
                  📭 Chưa chọn CV
                </div>
              )}
            </div>
          </div>
        </div>

        
      </div>
    </main>
  );
}