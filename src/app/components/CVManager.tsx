'use client';
import { useState, useEffect } from 'react';

interface CV {
  name: string;
  url: string;
}

export default function CVManager() {
  const [cvList, setCvList] = useState<CV[]>([]);
  const [selectedCV, setSelectedCV] = useState<CV | null>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

  // Load danh sách CV khi component mount
  useEffect(() => {
    loadCVList();
  }, []);

  const loadCVList = async () => {
    try {
      const res = await fetch('/api/cvs');
      const data = await res.json();
      setCvList(data.cvs || []);
      
      // Select CV đầu tiên nếu có
      if (data.cvs && data.cvs.length > 0) {
        selectCV(data.cvs[0]);
      }
    } catch (error) {
      console.error('Error loading CV list:', error);
    }
  };

  const selectCV = (cv: CV) => {
    setSelectedCV(cv);
    // Lưu vào window global để page.tsx sử dụng
    const reader = new FileReader();
    fetch(cv.url)
      .then(res => res.blob())
      .then(blob => {
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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.currentTarget.files?.[0];
    if (!file) return;

    setUploading(true);
    setMessage('');

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(`✅ Uploaded: ${data.filename}`);
        loadCVList(); // Reload danh sách CV
      } else {
        setMessage(`❌ Error: ${data.error}`);
      }
    } catch (error) {
      setMessage('❌ Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleViewCV = () => {
    if (!selectedCV) return;
    
    const newWindow = window.open();
    if (newWindow) {
      newWindow.document.write(`
        <html>
          <head>
            <title>${selectedCV.name}</title>
            <style>
              body { margin: 0; padding: 0; }
              iframe { width: 100%; height: 100vh; border: none; }
            </style>
          </head>
          <body>
            <iframe src="${selectedCV.url}"></iframe>
          </body>
        </html>
      `);
      newWindow.document.close();
    }
  };

  return (
    <div className="fixed top-0 right-0 p-4 z-50 flex gap-2 flex-col">
      <div className="flex gap-2">
        {/* Select CV */}
        <select
          value={selectedCV?.name || ''}
          onChange={(e) => {
            const cv = cvList.find(c => c.name === e.target.value);
            if (cv) selectCV(cv);
          }}
          className="px-4 py-2 bg-white border-2 border-blue-500 rounded-lg text-slate-900 font-semibold text-sm focus:outline-none"
        >
          <option value="">-- Chọn CV --</option>
          {cvList.map(cv => (
            <option key={cv.name} value={cv.name}>
              {cv.name}
            </option>
          ))}
        </select>

        {/* Upload CV */}
        <label className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all font-semibold text-sm cursor-pointer">
          📄 Tải CV
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            style={{ display: 'none' }}
            onChange={handleFileUpload}
            disabled={uploading}
          />
        </label>

        {/* View CV */}
        {selectedCV && (
          <button
            onClick={handleViewCV}
            className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-all font-semibold text-sm"
          >
            👁️ Xem CV
          </button>
        )}
      </div>

      {message && (
        <div className={`px-4 py-2 rounded-lg text-sm font-semibold text-white ${
          message.includes('✅') ? 'bg-green-500' : 'bg-red-500'
        }`}>
          {message}
        </div>
      )}
    </div>
  );
}