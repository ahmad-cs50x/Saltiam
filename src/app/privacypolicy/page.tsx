
import React from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { Link } from 'react-router-dom';


const PrivacyPolicy = () => {
  return (
    <div className="bg-[#ffd3b6] font-sans min-h-screen">

      {/* Main Content */}
      <main className="max-w-4xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <section className="bg-white p-6 rounded-2xl shadow-lg">
          <h2 className="text-3xl font-semibold text-pink-700 mb-6 text-center">
            Privacy Policy
          </h2>
          <p className="text-gray-600 mb-4 text-center">
            Last Updated: Wednesday, October 29, 2025, 10:58 PM PKT
          </p>

          <p className="text-gray-600 mb-6">
            Welcome to Saltiam, a global leader in exporting premium Himalayan pink salt, sea salt, and specialty salts. At Saltiam, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your data when you visit our website, use our services, or interact with us. By accessing or using our Website, you agree to the practices described in this policy. If you do not agree, please refrain from using our services.
          </p>

          <h3 className="text-2xl font-semibold text-pink-700 mb-4">1. Information We Collect</h3>
          <p className="text-gray-600 mb-4">
            We collect information to provide, improve, and personalize your experience with Saltiam. The types of data we gather include:
          </p>
          <ul className="list-disc list-inside mb-6 text-gray-600">
            <li><strong>1.1 Personal Information</strong>: Contact details, payment info, account credentials, and business info.</li>
            <li><strong>1.2 Non-Personal Information</strong>: Usage data, device info, cookies, and tracking technologies.</li>
            <li><strong>1.3 Information from Third Parties</strong>: Data from trusted partners or social logins.</li>
          </ul>

          <h3 className="text-2xl font-semibold text-pink-700 mb-4">2. How We Use Your Information</h3>
          <ul className="list-disc list-inside mb-6 text-gray-600">
            <li>Providing Services</li>
            <li>Customer Support</li>
            <li>Marketing and Promotions</li>
            <li>Website Improvement</li>
            <li>Fraud Prevention and Security</li>
            <li>Legal Compliance</li>
          </ul>

          <h3 className="text-2xl font-semibold text-pink-700 mb-4">3. Legal Basis for Processing</h3>
          <p className="text-gray-600 mb-4">
            Consent, contractual necessity, legitimate interests, and legal obligations.
          </p>

          <h3 className="text-2xl font-semibold text-pink-700 mb-4">4. How We Share Your Information</h3>
          <p className="text-gray-600 mb-4">
            We may share your data with service providers, business transfers, legal requirements, or with your consent.
          </p>

          <h3 className="text-2xl font-semibold text-pink-700 mb-4">5. Data Security</h3>
          <p className="text-gray-600 mb-4">
            We use encryption, security assessments, and access controls. No method is 100% secure; we notify affected users if there is a breach.
          </p>

          <h3 className="text-2xl font-semibold text-pink-700 mb-4">6. Data Retention</h3>
          <p className="text-gray-600 mb-4">
            Data is retained as long as necessary for orders, marketing, or legal requirements.
          </p>

          <h3 className="text-2xl font-semibold text-pink-700 mb-4">7. Your Rights and Choices</h3>
          <p className="text-gray-600 mb-4">
            You may have rights to access, correct, delete, restrict, port, object, or withdraw consent. Contact us at privacy@saltiam.com.
          </p>

          <h3 className="text-2xl font-semibold text-pink-700 mb-4">8. International Data Transfers</h3>
          <p className="text-gray-600 mb-4">
            Data may be transferred outside your region with appropriate safeguards.
          </p>

          <h3 className="text-2xl font-semibold text-pink-700 mb-4">9. Children’s Privacy</h3>
          <p className="text-gray-600 mb-4">
            Our website is not for children under 13. We delete or terminate accounts if discovered.
          </p>

          <h3 className="text-2xl font-semibold text-pink-700 mb-4">10. Third-Party Links</h3>
          <p className="text-gray-600 mb-4">
            We are not responsible for third-party site privacy practices. Review their policies.
          </p>

          <h3 className="text-2xl font-semibold text-pink-700 mb-4">11. Cookies and Tracking Technologies</h3>
          <p className="text-gray-600 mb-4">
            We use cookies for functionality and analytics. Manage preferences in your browser.
          </p>

          <h3 className="text-2xl font-semibold text-pink-700 mb-4">12. Changes to This Privacy Policy</h3>
          <p className="text-gray-600 mb-4">
            Updates will reflect changes in practices or laws. Significant changes will be notified via email or a notice.
          </p>

          <h3 className="text-2xl font-semibold text-pink-700 mb-4">13. Contact Us</h3>
          <p className="text-gray-600 mb-4">
            Email: privacy@saltiam.com, Phone: +92 (800) 123-4567, Address: Saltiam Headquarters, Khewra Salt Mines, Jhelum, Pakistan.
          </p>

          <h3 className="text-2xl font-semibold text-pink-700 mb-4">14. Acknowledgment</h3>
          <p className="text-gray-600 mb-4">
            By using Saltiam, you agree to this Privacy Policy.
          </p>
        </section>
      </main>

    </div>
  );
};

export default PrivacyPolicy;



