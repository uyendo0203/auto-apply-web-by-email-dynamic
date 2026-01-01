'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

interface SentEmail {
  id: number;
  company_name: string;
  job_title: string;
  contact_name: string | null;
  recipient_email: string;
  email_content: string;
  cv_filename: string | null;
  sent_at: string;
  status: string;
}

interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export default function EmailsPage() {
  const [emails, setEmails] = useState<SentEmail[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedId, setExpandedId] = useState<number | null>(null);

  useEffect(() => {
    loadEmails();
  }, [page]);

  const loadEmails = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/emails?page=${page}&limit=10`);
      const data = await res.json();
      setEmails(data.emails || []);
      setPagination(data.pagination);
    } catch (error) {
      console.error('Error loading emails:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteEmail = async (id: number) => {
    if (!confirm('Bạn chắc chắn muốn xóa email này?')) return;

    try {
      await fetch(`/api/emails?id=${id}`, { method: 'DELETE' });
      loadEmails();
    } catch (error) {
      console.error('Error deleting email:', error);
    }
  };

  const filteredEmails = emails.filter(email =>
    email.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    email.job_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    email.recipient_email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-slate-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
          <h1 className="text-4xl font-extrabold text-slate-900">📧 Quản Lý Mail Gửi Đi</h1>
          <Link
            href="/"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all"
          >
            ← Quay lại Form
          </Link>
        </div>

        {/* Search */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Tìm kiếm theo công ty, vị trí, hoặc email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
          />
        </div>

        {/* Stats */}
        {pagination && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg shadow border-l-4 border-green-500">
              <p className="text-slate-600 text-sm">Tổng số mail gửi</p>
              <p className="text-3xl font-bold text-green-600">{pagination.total}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow border-l-4 border-blue-500">
              <p className="text-slate-600 text-sm">Trang hiện tại</p>
              <p className="text-3xl font-bold text-blue-600">{page} / {pagination.totalPages}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow border-l-4 border-purple-500">
              <p className="text-slate-600 text-sm">Kết quả hiển thị</p>
              <p className="text-3xl font-bold text-purple-600">{filteredEmails.length}</p>
            </div>
          </div>
        )}

        {/* Table */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-slate-500">
              ⏳ Đang tải dữ liệu...
            </div>
          ) : filteredEmails.length === 0 ? (
            <div className="p-8 text-center text-slate-500">
              📭 Không có mail nào
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-900 text-white">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold">ID</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Công Ty</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Vị Trí</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Email Nhận</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">CV</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Ngày Gửi</th>
                    <th className="px-6 py-3 text-center text-sm font-semibold">Hành Động</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filteredEmails.map((email) => (
                    <tr
                      key={email.id}
                      className="hover:bg-slate-50 transition-colors cursor-pointer"
                      onClick={() =>
                        setExpandedId(expandedId === email.id ? null : email.id)
                      }
                    >
                      <td className="px-6 py-4 text-sm font-semibold text-slate-900">
                        #{email.id}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-900 font-medium">
                        {email.company_name}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-700">
                        {email.job_title}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {email.recipient_email}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {email.cv_filename ? (
                          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
                            ✅ {email.cv_filename}
                          </span>
                        ) : (
                          <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                            ❌ Không có
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {new Date(email.sent_at).toLocaleString('vi-VN')}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteEmail(email.id);
                          }}
                          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all text-sm font-semibold"
                        >
                          🗑️ Xóa
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Expanded Content */}
        {expandedId && (
          <div className="mt-6 bg-white rounded-lg shadow-lg p-6 border-l-4 border-blue-500">
            {emails.find(e => e.id === expandedId) && (
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-4">
                  📧 Chi tiết email #{expandedId}
                </h3>
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                  <div className="mb-4">
                    <p className="text-sm font-semibold text-slate-600 mb-2">Nội dung email:</p>
                    <div
                      className="prose prose-sm max-w-none bg-white p-4 rounded border border-slate-200"
                      dangerouslySetInnerHTML={{
                        __html: emails.find(e => e.id === expandedId)?.email_content || '',
                      }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-8">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="px-4 py-2 bg-slate-600 text-white rounded-lg disabled:bg-gray-400 disabled:cursor-not-allowed hover:bg-slate-700"
            >
              ← Trước
            </button>
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(p => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`px-4 py-2 rounded-lg font-semibold ${
                  page === p
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-300 text-slate-900 hover:bg-slate-400'
                }`}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => setPage(Math.min(pagination.totalPages, page + 1))}
              disabled={page === pagination.totalPages}
              className="px-4 py-2 bg-slate-600 text-white rounded-lg disabled:bg-gray-400 disabled:cursor-not-allowed hover:bg-slate-700"
            >
              Sau →
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
