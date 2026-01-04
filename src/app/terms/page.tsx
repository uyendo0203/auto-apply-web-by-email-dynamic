export const metadata = {
  title: 'Terms of Service | Auto Apply Tool',
  description: 'Terms of Service for Auto Apply Tool',
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-slate-50 py-12 px-4 md:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-4xl font-bold mb-8 text-slate-900">Terms of Service</h1>
        
        <div className="space-y-8 text-slate-700">
          <div className="text-sm text-slate-500 border-b pb-4">
            Last updated: January 2026
          </div>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-slate-900">1. Acceptance of Terms</h2>
            <p>
              By accessing and using Auto Apply Tool, you accept and agree to be bound by the terms and provision of this agreement.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-slate-900">2. Use License</h2>
            <p className="mb-4">
              Permission is granted to temporarily download one copy of the materials (information or software) on Auto Apply Tool for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title.
            </p>
            <p>
              You may not modify, copy, distribute, transmit, display, perform, reproduce, publish, license, create derivative works from, transfer, or sell any information obtained from this site.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-slate-900">3. Disclaimer</h2>
            <p>
              The materials on Auto Apply Tool are provided on an 'as is' basis. Auto Apply Tool makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-slate-900">4. Limitations</h2>
            <p>
              In no event shall Auto Apply Tool or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Auto Apply Tool.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-slate-900">5. Accuracy of Materials</h2>
            <p>
              The materials appearing on Auto Apply Tool could include technical, typographical, or photographic errors. Auto Apply Tool does not warrant that any of the materials on the website are accurate, complete, or current.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-slate-900">6. Links</h2>
            <p>
              Auto Apply Tool has not reviewed all of the sites linked to its website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by Auto Apply Tool of the site.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-slate-900">7. Modifications</h2>
            <p>
              Auto Apply Tool may revise these terms of service for the website at any time without notice. By using this website, you are agreeing to be bound by the then current version of these terms of service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-slate-900">8. User Responsibilities</h2>
            <p className="mb-4">
              You agree to:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Use this service only for lawful purposes and in a way that does not infringe upon the rights of others</li>
              <li>Not send unsolicited or spam emails using this service</li>
              <li>Not disclose false or misleading information in applications</li>
              <li>Keep your authentication credentials confidential</li>
              <li>Not attempt to gain unauthorized access to the service</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-slate-900">9. Limitation of Liability</h2>
            <p>
              Auto Apply Tool will not be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses resulting from your use of the service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-slate-900">10. Intellectual Property Rights</h2>
            <p>
              All content, features, and functionality of this service are owned by Auto Apply Tool, its licensors, or other providers of such material and are protected by United States and international copyright, trademark, and other intellectual property laws.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-slate-900">11. Governing Law</h2>
            <p>
              These terms and conditions are governed by and construed in accordance with the laws of the jurisdiction in which Auto Apply Tool operates, and you irrevocably submit to the exclusive jurisdiction of the courts in that location.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-slate-900">12. Severability</h2>
            <p>
              If any provision of these terms is found to be invalid or unenforceable, the remaining provisions will continue in full force and effect.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-slate-900">13. Contact Us</h2>
            <p className="mb-4">
              For any questions about these Terms of Service, please contact us at:
            </p>
            <div className="bg-slate-100 p-4 rounded-lg">
              <p className="font-semibold">Email:</p>
              <p className="text-blue-600">uyendo.0203@gmail.com</p>
            </div>
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
