export const metadata = {
  title: 'Privacy Policy | Auto Apply Tool',
  description: 'Privacy policy for Auto Apply Tool',
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-slate-50 py-12 px-4 md:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-4xl font-bold mb-8 text-slate-900">Privacy Policy</h1>
        
        <div className="space-y-8 text-slate-700">
          {/* Last Updated */}
          <div className="text-sm text-slate-500 border-b pb-4">
            Last updated: January 2026
          </div>

          {/* Introduction */}
          <section>
            <h2 className="text-2xl font-bold mb-4 text-slate-900">1. Introduction</h2>
            <p className="mb-4">
              Auto Apply Tool ("we", "our", or "us") operates the Auto Apply Tool website and application.
            </p>
            <p>
              This page informs you of our policies regarding the collection, use, and disclosure of personal data when you use our Service and the choices you have associated with that data.
            </p>
          </section>

          {/* Data We Collect */}
          <section>
            <h2 className="text-2xl font-bold mb-4 text-slate-900">2. Information We Collect</h2>
            
            <h3 className="text-xl font-semibold mb-2 text-slate-800">2.1 Google Account Information</h3>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Email address</li>
              <li>Google Drive access token</li>
              <li>Refresh token for continued access</li>
            </ul>

            <h3 className="text-xl font-semibold mb-2 text-slate-800">2.2 Application Data</h3>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Company names you apply to</li>
              <li>Job titles and descriptions</li>
              <li>Contact names and email addresses</li>
              <li>Email content you compose</li>
              <li>CV file names from your Google Drive</li>
              <li>Timestamps of sent applications</li>
            </ul>

            <h3 className="text-xl font-semibold mb-2 text-slate-800">2.3 Automatic Information</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>IP address</li>
              <li>Browser type and version</li>
              <li>Pages visited and time spent</li>
            </ul>
          </section>

          {/* How We Use Data */}
          <section>
            <h2 className="text-2xl font-bold mb-4 text-slate-900">3. How We Use Your Data</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>To provide the service:</strong> Sending job applications on your behalf</li>
              <li><strong>To improve the service:</strong> Understanding how users interact with the tool</li>
              <li><strong>To maintain security:</strong> Detecting fraud and maintaining data integrity</li>
              <li><strong>To communicate:</strong> Responding to your inquiries</li>
              <li><strong>To comply with law:</strong> Meeting legal obligations</li>
            </ul>
          </section>

          {/* Google Drive Access */}
          <section>
            <h2 className="text-2xl font-bold mb-4 text-slate-900">4. Google Drive Access</h2>
            <p className="mb-4">
              We request access to your Google Drive to:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>List your CV files</li>
              <li>Download CVs to attach to emails</li>
              <li>Send emails through Gmail on your behalf</li>
            </ul>
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
              <p className="font-semibold text-blue-900">We do NOT:</p>
              <ul className="list-disc pl-6 mt-2 space-y-1 text-blue-900">
                <li>Store your CV files</li>
                <li>Share your files with third parties</li>
                <li>Access files other than your CVs</li>
              </ul>
            </div>
          </section>

          {/* Data Storage */}
          <section>
            <h2 className="text-2xl font-bold mb-4 text-slate-900">5. Data Storage & Security</h2>
            <p className="mb-4">
              Your application data is stored securely in our PostgreSQL database. We implement industry-standard security measures including:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>HTTPS encryption for all data in transit</li>
              <li>Database encryption at rest</li>
              <li>Regular security audits</li>
              <li>Limited access to personal data</li>
            </ul>
          </section>

          {/* Data Retention */}
          <section>
            <h2 className="text-2xl font-bold mb-4 text-slate-900">6. Data Retention</h2>
            <p>
              We retain your application history for 12 months. You can request deletion of your data at any time by contacting us. Upon account deletion, all your personal data will be permanently removed within 30 days.
            </p>
          </section>

          {/* Third Parties */}
          <section>
            <h2 className="text-2xl font-bold mb-4 text-slate-900">7. Third-Party Services</h2>
            <p className="mb-4">
              We use the following third-party services:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Google:</strong> Authentication and Drive/Gmail access</li>
              <li><strong>Vercel:</strong> Application hosting and PostgreSQL database</li>
              <li><strong>Nodemailer:</strong> Email delivery service</li>
            </ul>
            <p className="mt-4">
              These services have their own privacy policies which we recommend you review.
            </p>
          </section>

          {/* User Rights */}
          <section>
            <h2 className="text-2xl font-bold mb-4 text-slate-900">8. Your Rights</h2>
            <p className="mb-4">
              You have the right to:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Access:</strong> Request a copy of your personal data</li>
              <li><strong>Correction:</strong> Update inaccurate information</li>
              <li><strong>Deletion:</strong> Request deletion of your data (Right to be forgotten)</li>
              <li><strong>Revoke consent:</strong> Disconnect your Google account anytime</li>
              <li><strong>Data portability:</strong> Receive your data in a portable format</li>
            </ul>
          </section>

          {/* Cookies */}
          <section>
            <h2 className="text-2xl font-bold mb-4 text-slate-900">9. Cookies & Tracking</h2>
            <p className="mb-4">
              We use cookies to:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Maintain your authentication session</li>
              <li>Remember your preferences</li>
              <li>Analyze usage patterns</li>
            </ul>
            <p className="mt-4">
              You can disable cookies in your browser settings, but some features may not work properly.
            </p>
          </section>

          {/* GDPR & CCPA */}
          <section>
            <h2 className="text-2xl font-bold mb-4 text-slate-900">10. GDPR & CCPA Compliance</h2>
            <p className="mb-4">
              <strong>For EU Users (GDPR):</strong> We comply with the General Data Protection Regulation. You have enhanced rights regarding your personal data.
            </p>
            <p>
              <strong>For California Users (CCPA):</strong> We comply with the California Consumer Privacy Act. You have the right to know, delete, and opt-out of sale of personal information.
            </p>
          </section>

          {/* Contact */}
          <section>
            <h2 className="text-2xl font-bold mb-4 text-slate-900">11. Contact Us</h2>
            <p className="mb-4">
              If you have questions about this Privacy Policy or our privacy practices, please contact us at:
            </p>
            <div className="bg-slate-100 p-4 rounded-lg">
              <p className="font-semibold">Email:</p>
              <p className="text-blue-600">uyendo.0203@gmail.com</p>
            </div>
          </section>

          {/* Changes */}
          <section>
            <h2 className="text-2xl font-bold mb-4 text-slate-900">12. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
            </p>
          </section>
        </div>

        {/* Back Button */}
        <div className="mt-12 pt-8 border-t">
          <a 
            href="/"
            className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            ← Back to Home
          </a>
        </div>
      </div>
    </main>
  );
}
