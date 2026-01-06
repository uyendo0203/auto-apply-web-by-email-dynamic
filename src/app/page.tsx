'use client';
import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import type { Session } from 'next-auth';

interface CV {
  id: string;
  name: string;
  mimeType: string;
}

const templateBase = `<p>Dear <strong>[HR Name]</strong>,</p>
<p>My name is Uyen Do, and I am a Frontend Developer with over 6 years of experience building user-friendly and performant web applications. I am very interested in applying for the <strong>[Job Title]</strong> position at <strong>[Company Name]</strong>.</p>
<p>In my previous roles, I have developed and optimized multiple web projects using technologies such as HTML5, CSS3/SCSS, JavaScript, React.js, Next.js, Nuxt.js, and Tailwind CSS. I am also experienced with creating engaging UI/UX using GSAP, Three.js, and implementing analytics and SEO optimization. I have worked closely with both designers and backend developers, as well as integrated APIs and CMS systems to deliver complete solutions.</p>
<p>I believe my technical expertise, problem-solving skills, and ability to collaborate effectively in teams will allow me to contribute positively to your projects. I would be grateful for the opportunity to further discuss how my skills can support your company's goals.</p>
<p>Please find my CV attached for your review.<br>Thank you for your time and consideration.</p>
<p>Best regards,<br><br><strong>Uyen Do</strong><br>Frontend Developer<br>Phone: (+84) 938 822 524</p>`;

export default function Home() {
  const { data: session, status } = useSession();
  const [cvList, setCvList] = useState<CV[]>([]);
  const [selectedCV, setSelectedCV] = useState<CV | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(true);
  
  const [formData, setFormData] = useState({
    companyName: '',
    jobTitle: 'Frontend Developer',
    contactName: 'HR Department',
    recipientEmail: 'nhatrang234@hotmail.com',
    emailContent: templateBase,
  });
  const [status_msg, setStatus] = useState<{ type: 'success' | 'error' | ''; message: string }>({ type: '', message: '' });

  // Redirect if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      redirect('/auth/signin');
    }
  }, [status]);

  // Load CVs from Google Drive
  useEffect(() => {
    const extendedSession = session as Session & { accessToken?: string };
    console.log("Session updated:", { 
      hasSession: !!session,
      hasAccessToken: !!extendedSession?.accessToken,
      user: session?.user?.email
    });
    if (extendedSession?.accessToken) {
      loadCVs();
    } else if (session?.user?.email) {
      console.log("Session exists but no accessToken yet");
    }
  }, [session]);

  // Auto-update email content when form data changes
  useEffect(() => {
    let updatedContent = templateBase
      .replace(/\[HR Name\]/g, formData.contactName || 'HR Team')
      .replace(/\[Job Title\]/g, formData.jobTitle || 'Frontend Developer');
    
    if (formData.companyName) {
      updatedContent = updatedContent.replace(/\[Company Name\]/g, formData.companyName);
    } else {
      updatedContent = updatedContent.replace(/<strong>\[Company Name\]<\/strong>/g, 'your company');
    }
    
    setFormData(prev => ({ ...prev, emailContent: updatedContent }));
  }, [formData.companyName, formData.jobTitle, formData.contactName]);

  const loadCVs = async () => {
    try {
      const folderId = localStorage.getItem('googleDriveFolderId');
      let url = '/api/google-drive-cvs';
      if (folderId) {
        url += `?folderId=${encodeURIComponent(folderId)}`;
      }
      const res = await fetch(url);
      const data = await res.json();
      setCvList(data.cvs || []);
      if (data.cvs?.[0]) {
        setSelectedCV(data.cvs[0]);
      }
    } catch (error) {
      console.error('Error loading CVs:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ message: '', type: '' });

    try {
      const res = await fetch('/api/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          cvFileId: selectedCV?.id || null,
          cvFileName: selectedCV?.name || null,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus({ message: '✅ Email sent successfully!', type: 'success' });
        setFormData({
          companyName: '',
          jobTitle: 'Frontend Developer',
          contactName: 'HR Department',
          recipientEmail: '',
          emailContent: templateBase,
        });
      } else {
        setStatus({ message: data.error || '❌ Failed to send', type: 'error' });
      }
    } catch (error) {
      setStatus({ message: '❌ Error sending email', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading') {
    return <div className="min-h-screen flex items-center justify-center">⏳ Loading...</div>;
  }

  // Show landing page if not authenticated
  if (status === 'unauthenticated') {
    return (
      <main className="min-h-screen bg-gradient-to-b from-blue-600 to-blue-800 text-white">
        {/* Navigation Bar */}
        <nav className="flex justify-between items-center p-4 md:p-6 max-w-7xl mx-auto">
          <div className="text-2xl font-bold flex items-center gap-2">
            🚀 Auto Apply Web V2
          </div>
          <div className="flex gap-4">
            <a href="/privacy" className="text-sm hover:text-blue-200 transition">Privacy</a>
            <a href="/terms" className="text-sm hover:text-blue-200 transition">Terms</a>
          </div>
        </nav>

        {/* Hero Section */}
        <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 py-20">
          <div className="max-w-3xl text-center space-y-8">
            <h1 className="text-5xl md:text-6xl font-bold leading-tight">
              Ứng Tuyển Công Việc<br />Chỉ Trong Tích Tắc
            </h1>
            
            <p className="text-lg md:text-xl text-blue-100">
              Gửi CV chuyên nghiệp với email được thiết kế sẵn. Kết nối Google Drive, chọn CV, và gửi ứng tuyển ngay!
            </p>

            <div className="grid md:grid-cols-3 gap-6 my-12">
              <div className="bg-white/10 backdrop-blur p-6 rounded-lg">
                <div className="text-4xl mb-3">📁</div>
                <h3 className="font-bold text-lg mb-2">Google Drive</h3>
                <p className="text-sm text-blue-100">Kết nối với Google Drive để quản lý CV</p>
              </div>
              <div className="bg-white/10 backdrop-blur p-6 rounded-lg">
                <div className="text-4xl mb-3">✉️</div>
                <h3 className="font-bold text-lg mb-2">Email Tự động</h3>
                <p className="text-sm text-blue-100">Template email chuẩn mà bạn có thể tùy chỉnh</p>
              </div>
              <div className="bg-white/10 backdrop-blur p-6 rounded-lg">
                <div className="text-4xl mb-3">🏃</div>
                <h3 className="font-bold text-lg mb-2">Gửi Nhanh</h3>
                <p className="text-sm text-blue-100">Gửi ứng tuyển chuyên nghiệp ngay lập tức</p>
              </div>
            </div>

            {/* Login Button - Redirects to signin */}
            <div className="pt-8">
              <a
                href="/auth/signin"
                className="inline-block px-8 py-4 bg-white text-blue-600 font-bold text-lg rounded-lg hover:bg-blue-50 transition-all shadow-lg"
              >
                🔐 Đăng Nhập với Google
              </a>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="bg-blue-900 text-center py-6 text-blue-200 text-sm">
          <p>© 2026 Auto Apply Web V2. All rights reserved.</p>
        </footer>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-100 p-4 md:p-8 flex justify-center items-center">
      <form onSubmit={handleSubmit} className="bg-white p-6 md:p-10 rounded-3xl shadow-2xl w-full max-w-5xl space-y-5 border border-slate-200">
        <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
          <div className="text-center flex-1">
            <h1 className="text-3xl font-extrabold text-slate-900 flex justify-center items-center gap-2">
              Auto Apply Tool <span className="text-4xl">🚀</span>
            </h1>
            <p className="text-slate-500 mt-2">Gửi CV chuyên nghiệp chỉ trong tích tắc</p>
            <p className="text-sm text-slate-400 mt-1">Welcome, {session?.user?.email}</p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/cvs"
              className="px-4 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-all whitespace-nowrap"
            >
              📄 Quản Lý CV
            </Link>
            <Link
              href="/settings"
              className="px-4 py-2 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 transition-all whitespace-nowrap"
            >
              ⚙️ Cấu Hình
            </Link>
            <Link
              href="/emails"
              className="px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-all whitespace-nowrap"
            >
              📊 Quản Lý Mail
            </Link>
            <button
              onClick={() => signOut()}
              className="px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-all whitespace-nowrap"
            >
              🚪 Logout
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4 order-2 lg:order-1">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Tên công ty</label>
              <input 
                name="companyName" 
                value={formData.companyName} 
                onChange={handleChange} 
                className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Vị trí ứng tuyển</label>
              <input 
                name="jobTitle" 
                value={formData.jobTitle} 
                onChange={handleChange} 
                className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                required 
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Tên HR</label>
                <input 
                  name="contactName" 
                  value={formData.contactName} 
                  onChange={handleChange} 
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Email nhận (HR)</label>
                <input 
                  name="recipientEmail" 
                  type="email" 
                  value={formData.recipientEmail} 
                  onChange={handleChange} 
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                  required 
                />
              </div>
            </div>

            <div className="mt-6">
              <div className="flex justify-between items-center mb-3">
                <label className="block text-sm font-bold text-slate-700">Nội dung email</label>
                <button 
                  type="button" 
                  onClick={() => setShowPreview(!showPreview)} 
                  className="text-sm px-4 py-2 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-all"
                >
                  {showPreview ? '✏️ Sửa' : '👁️ Xem thử'}
                </button>
              </div>
              {!showPreview ? (
                <textarea 
                  value={formData.emailContent} 
                  onChange={handleChange} 
                  name="emailContent"
                  className="w-full h-64 p-4 border-2 border-slate-300 rounded-lg outline-none font-mono text-sm focus:ring-2 focus:ring-blue-500" 
                />
              ) : (
                <div 
                  className="bg-slate-50 border-2 border-slate-300 rounded-lg p-6 min-h-64 overflow-y-auto prose prose-sm max-w-none" 
                  dangerouslySetInnerHTML={{ __html: formData.emailContent }} 
                />
              )}
            </div>

            <button 
              disabled={loading} 
              type="submit" 
              className="sticky bottom-4 w-full bg-blue-600 text-white py-3 rounded-lg font-bold text-lg hover:bg-blue-700 disabled:bg-gray-400 shadow-lg transition-all"
            >
              {loading ? '⏳ Đang gửi...' : '📧 Gửi Email Ứng Tuyển'}
            </button>
            
            {status_msg.message && (
              <div className={`p-4 rounded-lg text-center font-bold ${
                status_msg.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {status_msg.message}
              </div>
            )}
          </div>

          {/* CV Manager Sidebar */}
          <div className="lg:col-span-1 order-1 lg:order-2">
            <div className="bg-slate-50 border-2 border-slate-300 rounded-lg p-4 sticky top-20">
              <h3 className="font-bold text-slate-900 mb-4">📄 Quản lý CV</h3>
              <div className="space-y-3">
                <select 
                  value={selectedCV?.id || ''} 
                  onChange={(e) => {
                    const cv = cvList.find(c => c.id === e.target.value);
                    if (cv) setSelectedCV(cv);
                  }} 
                  className="w-full px-3 py-2 border-2 border-blue-500 rounded-lg text-sm font-semibold focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="">-- Chọn CV từ Google Drive --</option>
                  {cvList.map(cv => (
                    <option key={cv.id} value={cv.id}>{cv.name}</option>
                  ))}
                </select>
                
                {selectedCV && (
                  <div className="bg-white p-3 rounded border border-slate-200">
                    <p className="text-xs font-semibold text-slate-600 mb-1">✓ File hiện tại:</p>
                    <p className="text-sm text-slate-900 font-mono truncate">{selectedCV.name}</p>
                  </div>
                )}
                
                {!selectedCV && cvList.length === 0 && (
                  <div className="bg-yellow-50 border border-yellow-200 p-3 rounded text-xs text-yellow-800">
                    <p className="font-semibold">⚠️ Không tìm thấy CV</p>
                    <p className="mt-1">Kiểm tra Google Drive của bạn có file CV không?</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </form>
    </main>
  );
}