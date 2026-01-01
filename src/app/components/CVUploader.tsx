'use client';
import { useState, useEffect } from 'react';

export default function CVUploader() {
  const [cvFile, setCvFile] = useState<{ name: string; base64: string; type: string } | null>(null);

  // Load default CV từ public/mycv.pdf khi component mount
  useEffect(() => {
    const loadDefaultCV = async () => {
      try {
        const response = await fetch('/mycv.pdf');
        if (!response.ok) {
          console.log('ℹ️ No default CV found - please upload a CV');
          return;
        }
        
        const blob = await response.blob();
        console.log('blob',blob);
        
        const reader = new FileReader();
        reader.onload = (event) => {
          const base64 = event.target?.result as string;
          const defaultCV = {
            name: 'mycv.pdf',
            base64: base64,
            type: 'application/pdf',
          };
          setCvFile(defaultCV);
          (window as any).cvFileData = defaultCV;
          console.log('✅ Default CV loaded successfully');
        };
        reader.readAsDataURL(blob);
      } catch (error) {
        console.log('ℹ️ Default CV not available - use "Tải CV" button');
      }
    };
    console.log(111);
    
    loadDefaultCV();
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.currentTarget.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        const newCV = {
          name: file.name,
          base64: base64,
          type: file.type,
        };
        setCvFile(newCV);
        (window as any).cvFileData = newCV;
        console.log('✅ New CV uploaded:', file.name);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed top-0 right-0 p-4 z-50 flex gap-2">
      <label className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all font-semibold text-sm cursor-pointer">
        📄 Tải CV
        <input
          id="cv-input"
          type="file"
          accept=".pdf,.doc,.docx"
          style={{ display: 'none' }}
          onChange={handleFileUpload}
        />
      </label>
      {cvFile ? (
        <a
          href={cvFile.base64}
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-all font-semibold text-sm"
        >
          👁️ Xem CV
        </a>
      ) : (
        <span className="px-4 py-2 bg-gray-400 text-white rounded-lg font-semibold text-sm cursor-not-allowed">
          👁️ Chưa có CV
        </span>
      )}
    </div>
  );
}