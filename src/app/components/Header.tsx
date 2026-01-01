'use client';

export default function Header() {
  return (
    <header className="fixed top-0 right-0 p-4 z-50 flex gap-2">
      <button
        onClick={(e) => {
          e.preventDefault();
          document.getElementById('cv-input')?.click();
        }}
        className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all font-semibold text-sm cursor-pointer border-none"
      >
        📄 Tải CV
      </button>
      <a
        id="cv-link"
        target="_blank"
        rel="noopener noreferrer"
        className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-all font-semibold text-sm"
        style={{ display: 'none' }}
      >
        👁️ Xem CV
      </a>
      <input
        id="cv-input"
        type="file"
        accept=".pdf,.doc,.docx"
        style={{ display: 'none' }}
        onChange={(e) => {
          const file = e.currentTarget.files?.[0];
          if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
              (window as any).cvFileData = {
                name: file.name,
                base64: event.target?.result,
                type: file.type,
              };
              const cvLink = document.getElementById('cv-link') as HTMLAnchorElement;
              if (cvLink && event.target?.result) {
                cvLink.href = event.target.result as string;
                cvLink.download = file.name;
                cvLink.style.display = 'inline-block';
              }
            };
            reader.readAsDataURL(file);
          }
        }}
      />
    </header>
  );
}
