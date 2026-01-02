'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

interface CV {
  name: string;
  url: string;
}

export default function Home() {
  // Mẫu Template gốc để dùng làm căn cứ thay thế
  const templateBase = `<p>Dear <strong>[HR Name]</strong>,</p>
<p>My name is Uyen Do, and I am a Frontend Developer with over 6 years of experience building user-friendly and performant web applications. I am very interested in applying for the <strong>[Job Title]</strong> position at <strong>[Company Name]</strong>.</p>
<p>In my previous roles, I have developed and optimized multiple web projects using technologies such as HTML5, CSS3/SCSS, JavaScript, React.js, Next.js, Nuxt.js, and Tailwind CSS. I am also experienced with creating engaging UI/UX using GSAP, Three.js, and implementing analytics and SEO optimization. I have worked closely with both designers and backend developers, as well as integrated APIs and CMS systems to deliver complete solutions.</p>
<p>I believe my technical expertise, problem-solving skills, and ability to collaborate effectively in teams will allow me to contribute positively to your projects. I would be grateful for the opportunity to further discuss how my skills can support your company's goals.</p>
<p>Please find my CV attached for your review.<br>Thank you for your time and consideration.</p>
<p>Best regards,<br><br><strong>Uyen Do</strong><br>Frontend Developer<br>Phone: (+84) 938 822 524</p>`;

  const [formData, setFormData] = useState({
    companyName: '',
    jobTitle: 'Frontend Developer',
    contactName: 'HR Department',
    recipientEmail: '',
    emailContent: '' // Sẽ được cập nhật tự động qua useEffect
  });

  // LOGIC QUAN TRỌNG: Tự động cập nhật Email Content khi các Input thay đổi
  useEffect(() => {
    let updatedContent = templateBase
      .replace(/\[HR Name\]/g, formData.contactName || 'HR Team')
      .replace(/\[Job Title\]/g, formData.jobTitle || 'Frontend Developer');
    
    // Xử lý Company Name khác nhau
    if (formData.companyName) {
      updatedContent = updatedContent.replace(/\[Company Name\]/g, formData.companyName);
    } else {
      // Nếu không có company name, hiển thị plain text mà không strong
      updatedContent = updatedContent.replace(/<strong>\[Company Name\]<\/strong>/g, 'your company');
    }
    
    setFormData(prev => ({ ...prev, emailContent: updatedContent }));
  }, [formData.companyName, formData.jobTitle, formData.contactName]);

  // --- GIỮ NGUYÊN PHẦN LOGIC CV MANAGER CỦA BẠN ---
  const [cvList, setCvList] = useState<CV[]>([]);
  const [selectedCV, setSelectedCV] = useState<CV | null>(null);
  const [cvFileData, setCvFileData] = useState<any>(null);
  const [status, setStatus] = useState<{ type: 'success' | 'error' | ''; message: string }>({ type: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState('');

  useEffect(() => {
    loadCVList();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const cv = (window as any).cvFileData;
      if (cv && cv.base64) {
        setCvFileData(cv);
        clearInterval(interval);
      }
    }, 300);
    return () => clearInterval(interval);
  }, []);

  const loadCVList = async () => {
    try {
      const res = await fetch('/api/cvs');
      const data = await res.json();
      setCvList(data.cvs || []);
      if (data.cvs && data.cvs.length > 0) selectCV(data.cvs[0]);
    } catch (error) { console.error('Error:', error); }
  };

  const selectCV = (cv: CV) => {
    setSelectedCV(cv);
    fetch(cv.url).then(res => res.blob()).then(blob => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const cvData = { name: cv.name, base64: event.target?.result, type: blob.type };
        setCvFileData(cvData);
        (window as any).cvFileData = cvData;
      };
      reader.readAsDataURL(blob);
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.currentTarget.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: fd });
      const data = await res.json();
      if (res.ok) {
        setUploadMessage(`✅ Uploaded: ${data.filename}`);
        loadCVList();
        setTimeout(() => setUploadMessage(''), 3000);
      }
    } finally { setUploading(false); }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEmailContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, emailContent: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ message: '', type: '' });

    try {
      const res = await fetch('/api/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': 'uyen_auto_apply_2025_secret_key_12345', // ← Thêm API Key
        },
        body: JSON.stringify({
          companyName: formData.companyName,
          jobTitle: formData.jobTitle,
          contactName: formData.contactName,
          recipientEmail: formData.recipientEmail,
          emailContent: formData.emailContent,
          cvFile: cvFileData?.base64 || null,
          cvFileName: cvFileData?.name || null,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus({ message: '✅ Email sent successfully!', type: 'success' });
        // Reset form
        setFormData({
          companyName: '',
          jobTitle: 'Frontend Developer',
          contactName: 'HR Department',
          recipientEmail: '',
          emailContent: '',
        });
        setCvFileData(null);
      } else {
        setStatus({ 
          message: data.error || '❌ Failed to send email', 
          type: 'error' 
        });
      }
    } catch (error) {
      setStatus({ message: '❌ Error sending email', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-100 p-4 md:p-8 flex justify-center items-center">
      <form onSubmit={handleSubmit} className="bg-white p-6 md:p-10 rounded-3xl shadow-2xl w-full max-w-5xl space-y-5 border border-slate-200">
        <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
          <div className="text-center flex-1">
            <h1 className="text-3xl font-extrabold text-slate-900 flex justify-center items-center gap-2">
              Auto Apply Tool <span className="text-4xl">🚀</span>
            </h1>
            <p className="text-slate-500 mt-2">Gửi CV chuyên nghiệp chỉ trong tích tắc</p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/cvs"
              className="px-4 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-all whitespace-nowrap"
            >
              📄 Quản Lý CV
            </Link>
            <Link
              href="/emails"
              className="px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-all whitespace-nowrap"
            >
              📊 Quản Lý Mail
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4 order-2 lg:order-1">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Tên công ty</label>
              <input name="companyName" value={formData.companyName} onChange={handleChange} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none border-slate-300" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Vị trí ứng tuyển</label>
              <input name="jobTitle" value={formData.jobTitle} onChange={handleChange} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none border-slate-300" required />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Tên HR</label>
                <input name="contactName" value={formData.contactName} onChange={handleChange} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none border-slate-300" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Email nhận (HR)</label>
                <input name="recipientEmail" type="email" value={formData.recipientEmail} onChange={handleChange} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none border-slate-300" required />
              </div>
            </div>

            <div className="mt-6">
              <div className="flex justify-between items-center mb-3">
                <label className="block text-sm font-bold text-slate-700">Nội dung email</label>
                <button type="button" onClick={() => setShowPreview(!showPreview)} className="text-sm px-4 py-2 bg-blue-500 text-white rounded-lg font-semibold">{showPreview ? '✏️ Sửa' : '👁️ Xem thử'}</button>
              </div>
              {!showPreview ? (
                <textarea value={formData.emailContent} onChange={handleEmailContentChange} className="w-full h-64 p-4 border-2 border-slate-300 rounded-lg outline-none font-mono text-sm" />
              ) : (
                <div className="bg-slate-50 border-2 border-slate-300 rounded-lg p-6 min-h-64 overflow-y-auto prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: formData.emailContent }} />
              )}
            </div>


            <button disabled={loading} type="submit" className="sticky bottom-4 w-full bg-blue-600 text-white py-3 rounded-lg font-bold text-lg hover:bg-blue-700 shadow-lg">{loading ? '⏳ Đang gửi...' : '📧 Gửi Email Ứng Tuyển'}</button>
            {status.message && <div className={`p-4 rounded-lg text-center font-bold ${status.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{status.message}</div>}
          </div>

          {/* --- GIỮ NGUYÊN UI CV MANAGER --- */}
          <div className="lg:col-span-1 order-1 lg:order-2">
            <div className="bg-slate-50 border-2 border-slate-300 rounded-lg p-4 sticky top-20">
              <h3 className="font-bold text-slate-900 mb-4">📄 Quản lý CV</h3>
              <div className="space-y-3">
                <select value={selectedCV?.name || ''} onChange={(e) => { const cv = cvList.find(c => c.name === e.target.value); if (cv) selectCV(cv); }} className="w-full px-3 py-2 border-2 border-blue-500 rounded-lg text-sm font-semibold">
                  <option value="">-- Chọn CV --</option>
                  {cvList.map(cv => <option key={cv.name} value={cv.name}>{cv.name}</option>)}
                </select>
                <label className="block w-full px-4 py-2 bg-green-500 text-white rounded-lg font-semibold text-sm cursor-pointer text-center hover:bg-green-600 transition-all">📤 Tải CV mới<input type="file" className="hidden" onChange={handleFileUpload} disabled={uploading} /></label>
                {selectedCV && <a href={selectedCV.url} target="_blank" className="block w-full text-center py-2 bg-purple-500 text-white rounded-lg font-semibold text-sm">👁️ Xem CV</a>}
                {uploadMessage && <div className={`px-3 py-2 rounded-lg text-xs font-semibold text-white text-center ${uploadMessage.includes('✅') ? 'bg-green-500' : 'bg-red-500'}`}>{uploadMessage}</div>}
                {selectedCV && <div className="bg-white p-3 rounded border border-slate-200"><p className="text-xs font-semibold text-slate-600 mb-1">File hiện tại:</p><p className="text-sm text-slate-900 font-mono truncate">{selectedCV.name}</p></div>}
              </div>
            </div>
          </div>
        </div>
      </form>
    </main>
  );
}