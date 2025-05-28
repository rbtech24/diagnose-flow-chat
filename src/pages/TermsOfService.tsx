
import React from 'react';

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-white py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Terms of Service</h1>
        <div className="prose prose-lg max-w-none">
          <p className="text-gray-600 mb-6">Last updated: {new Date().toLocaleDateString()}</p>
          
          <h2 className="text-2xl font-bold mt-8 mb-4">1. Acceptance of Terms</h2>
          <p className="mb-4">
            By accessing and using TechFlow, you accept and agree to be bound by the terms and provision of this agreement.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">2. Use License</h2>
          <p className="mb-4">
            Permission is granted to temporarily download one copy of TechFlow per device for personal, non-commercial transitory viewing only.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">3. Disclaimer</h2>
          <p className="mb-4">
            The materials on TechFlow are provided on an 'as is' basis. TechFlow makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">4. Limitations</h2>
          <p className="mb-4">
            In no event shall TechFlow or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use TechFlow, even if TechFlow or a TechFlow authorized representative has been notified orally or in writing of the possibility of such damage.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">5. Contact Information</h2>
          <p className="mb-4">
            If you have any questions about these Terms of Service, please contact us at legal@techflow.com.
          </p>
        </div>
      </div>
    </div>
  );
}
