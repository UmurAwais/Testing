import React from 'react';
import { useNavigate } from 'react-router-dom';

const TermsOfService = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6 sm:p-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 text-center">
          Terms of Service
        </h1>
        <p className="text-sm sm:text-base text-gray-600 mb-6 italic text-center">
          Last updated: September 1, 2025
        </p>

        <section className="mb-8">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4">
            1. Acceptance of Terms
          </h2>
          <p className="text-sm sm:text-base text-gray-700 mb-4">
            By accessing or using Ecomlly, you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, you may not use our platform or services.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4">
            2. Description of Service
          </h2>
          <p className="text-sm sm:text-base text-gray-700 mb-4">
            Ecomlly provides an AI-powered solution for building and managing Shopify stores. Our services include store generation, niche selection, and automated product sourcing through authorized partners.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4">
            3. User Obligations
          </h2>
          <p className="text-sm sm:text-base text-gray-700 mb-4">
            You agree to:
          </p>
          <ul className="list-disc list-inside text-sm sm:text-base text-gray-600 space-y-2">
            <li>Provide accurate and complete information during registration.</li>
            <li>Maintain the security of your account credentials.</li>
            <li>Use the service only for lawful purposes and in compliance with Shopify's policies.</li>
            <li>Not attempt to reverse engineer, clone, or scrape data from our platform in an unauthorized manner.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4">
            4. Shopify Compliance
          </h2>
          <p className="text-sm sm:text-base text-gray-700 mb-4">
            Users must adhere to all Shopify App Store guidelines. Our app facilitates store creation but requires the merchant to have an active Shopify account and follow Shopify's merchant agreement.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4">
            5. Intellectual Property
          </h2>
          <p className="text-sm sm:text-base text-gray-700 mb-4">
            All content, technology, and AI algorithms power Ecomlly are the property of Ecomlly. You are granted a limited, non-exclusive license to use the service for your store's operation.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4">
            6. Limitation of Liability
          </h2>
          <p className="text-sm sm:text-base text-gray-700 mb-4">
            Ecomlly shall not be liable for any indirect, incidental, or consequential damages resulting from the use or inability to use the service, including store performance or sales metrics.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4">
            7. Termination
          </h2>
          <p className="text-sm sm:text-base text-gray-700 mb-4">
            We reserve the right to terminate or suspend access to our service immediately, without prior notice or liability, for any reason, including breach of these Terms.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4">
            8. Contact Us
          </h2>
          <p className="text-sm sm:text-base text-gray-700 mb-2">
            If you have any questions about these Terms, please contact us at:
          </p>
          <p className="text-sm sm:text-base text-gray-600">
            📧 <a href="mailto:support@ecomlly.com" className="text-blue-600 hover:underline">support@ecomlly.com</a>
          </p>
        </section>

        <div className="mt-8 flex justify-center">
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-300 text-sm sm:text-base"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
