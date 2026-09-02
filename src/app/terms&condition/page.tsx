"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect } from 'react';


const TermsConditions = () => {
  return (
    <div className="bg-[#ffd3b6] font-sans min-h-screen">

      {/* Main Content */}
      <main className="max-w-4xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <section className="bg-white p-6 rounded-2xl shadow-lg">
          <h2 className="text-3xl font-semibold text-pink-700 mb-6 text-center">
            Terms and Conditions
          </h2>
          <p className="text-gray-600 mb-4 text-center">
            Last Updated: Wednesday, October 29, 2025, 11:08 PM PKT
          </p>

          <p className="text-gray-600 mb-6">
            Welcome to Saltiam, a global leader in exporting premium Himalayan pink salt, sea salt, and specialty salts. These Terms and Conditions ("Terms") govern your use of our website, including purchases, account management, and interactions with our services. By accessing or using the Website, you agree to be bound by these Terms. If you do not agree, please refrain from using our services.
          </p>

          <h3 className="text-2xl font-semibold text-pink-700 mb-4">1. Acceptance of Terms</h3>
          <p className="text-gray-600 mb-4">
            By using the Website, you confirm that you are at least 18 years old or have parental consent. These Terms constitute a legally binding agreement between you and Saltiam. We may update these Terms at any time, and continued use after updates signifies your acceptance.
          </p>

          <h3 className="text-2xl font-semibold text-pink-700 mb-4">2. Account Registration</h3>
          <p className="text-gray-600 mb-4">
            You must create an account to purchase products or access features. You are responsible for your account and all activity under it.
          </p>

          <h3 className="text-2xl font-semibold text-pink-700 mb-4">3. Orders and Purchases</h3>
          <p className="text-gray-600 mb-4">
            Orders are subject to availability and acceptance by Saltiam. Errors in pricing or stock may result in order refusal or cancellation.
          </p>

          <h3 className="text-2xl font-semibold text-pink-700 mb-4">4. Pricing and Payments</h3>
          <p className="text-gray-600 mb-4">
            Prices include applicable taxes where required. Payment is processed securely via third-party gateways. All sales are final unless authorized by our Return Policy.
          </p>

          <h3 className="text-2xl font-semibold text-pink-700 mb-4">5. Shipping and Delivery</h3>
          <p className="text-gray-600 mb-4">
            Shipping costs and delivery times vary by location. Risk of loss transfers to you upon delivery.
          </p>

          <h3 className="text-2xl font-semibold text-pink-700 mb-4">6. Intellectual Property</h3>
          <p className="text-gray-600 mb-4">
            All content on the Website is owned by Saltiam or its licensors. You may not reproduce, distribute, or modify without written consent.
          </p>

          <h3 className="text-2xl font-semibold text-pink-700 mb-4">7. Returns and Refunds</h3>
          <p className="text-gray-600 mb-4">
            Returns are accepted within 14 days if products are defective or damaged. Refunds issued within 10 business days minus shipping costs.
          </p>

          <h3 className="text-2xl font-semibold text-pink-700 mb-4">8. Limitation of Liability</h3>
          <p className="text-gray-600 mb-4">
            Saltiam is not liable for indirect or consequential damages. Liability is limited to the purchase price.
          </p>

          <h3 className="text-2xl font-semibold text-pink-700 mb-4">9. User Conduct</h3>
          <p className="text-gray-600 mb-4">
            Do not use the Website for illegal purposes, transmit malware, or interfere with operations.
          </p>

          <h3 className="text-2xl font-semibold text-pink-700 mb-4">10. Third-Party Links</h3>
          <p className="text-gray-600 mb-4">
            We are not responsible for third-party sites or their content.
          </p>

          <h3 className="text-2xl font-semibold text-pink-700 mb-4">11. Termination</h3>
          <p className="text-gray-600 mb-4">
            We may suspend or terminate your account for breach of these Terms.
          </p>

          <h3 className="text-2xl font-semibold text-pink-700 mb-4">12. Governing Law</h3>
          <p className="text-gray-600 mb-4">
            These Terms are governed by the laws of Pakistan. Disputes resolved in Jhelum courts.
          </p>

          <h3 className="text-2xl font-semibold text-pink-700 mb-4">13. Changes to These Terms</h3>
          <p className="text-gray-600 mb-4">
            Terms may be updated to reflect changes in practices or legal requirements.
          </p>

          <h3 className="text-2xl font-semibold text-pink-700 mb-4">14. Contact Us</h3>
          <p className="text-gray-600 mb-4">
            Email: support@saltiam.com, Phone: +92 (800) 123-4567, Address: Saltiam Headquarters, Khewra Salt Mines, Jhelum, Pakistan.
          </p>

          <h3 className="text-2xl font-semibold text-pink-700 mb-4">15. Acknowledgment</h3>
          <p className="text-gray-600 mb-4">
            By using Saltiam, you acknowledge that you have read, understood, and agree to these Terms and Conditions.
          </p>
        </section>
      </main>

    </div>
  );
};

export default TermsConditions;