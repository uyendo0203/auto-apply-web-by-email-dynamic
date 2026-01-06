'use client';

export default function DebugPage() {
  const nextAuthUrl = "https://auto-apply-web-by-email-v2.vercel.app";
  const callbackUrl = `${nextAuthUrl}/api/auth/callback/google`;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">🔧 Configuration Debug</h1>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Google OAuth Redirect URI</h2>
          <p className="text-gray-600 mb-4">
            Copy this URL and add it to your Google Cloud Console OAuth 2.0 Client:
          </p>
          <div className="bg-gray-100 p-4 rounded border border-gray-300 font-mono text-sm break-all">
            {callbackUrl}
          </div>
          <ol className="mt-6 space-y-2 text-sm">
            <li>1. Go to: <a href="https://console.cloud.google.com/apis/credentials" target="_blank" className="text-blue-600 underline">Google Cloud Console</a></li>
            <li>2. Click your OAuth 2.0 Client ID</li>
            <li>3. Scroll to "Authorized redirect URIs"</li>
            <li>4. Click "Add URI" and paste the URL above</li>
            <li>5. Click Save</li>
            <li>6. Wait 1-2 minutes for changes to propagate</li>
            <li>7. Try signing in again</li>
          </ol>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold text-blue-900 mb-2">Environment Variables Check</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>✓ NEXTAUTH_URL: {nextAuthUrl}</li>
            <li>✓ Expected Callback: {callbackUrl}</li>
            <li>⚠️ Check console logs for GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
