'use client';
import { useSession } from 'next-auth/react';

export default function TestPage() {
  const { data: session, status } = useSession();
  const extendedSession = session as any;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-6">
        <h1 className="text-3xl font-bold mb-6">🧪 Session Debug</h1>
        
        <div className="space-y-4">
          <div className="p-4 bg-gray-100 rounded">
            <p className="font-semibold mb-2">Status: {status}</p>
            <p className="text-sm text-gray-600">Current session status</p>
          </div>

          <div className="p-4 bg-gray-100 rounded">
            <p className="font-semibold mb-2">User Email: {session?.user?.email || "No email"}</p>
            <p className="text-sm text-gray-600">Authenticated user</p>
          </div>

          <div className="p-4 bg-gray-100 rounded">
            <p className="font-semibold mb-2">Has AccessToken: {extendedSession?.accessToken ? "✅ Yes" : "❌ No"}</p>
            <p className="text-sm text-gray-600">Google API access token available</p>
          </div>

          {extendedSession?.accessToken && (
            <div className="p-4 bg-green-50 border border-green-200 rounded">
              <p className="font-semibold text-green-900 mb-2">✅ Ready for API calls</p>
              <p className="text-sm text-green-800">You can now access Google Drive and Gmail APIs</p>
            </div>
          )}

          {!extendedSession?.accessToken && session?.user?.email && (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded">
              <p className="font-semibold text-yellow-900 mb-2">⏳ Waiting for token...</p>
              <p className="text-sm text-yellow-800">Session exists but token not yet available. Try refreshing the page.</p>
            </div>
          )}

          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded">
            <p className="font-semibold text-blue-900 mb-2">Session Object:</p>
            <pre className="text-xs text-blue-800 overflow-auto max-h-60">
              {JSON.stringify(session, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
