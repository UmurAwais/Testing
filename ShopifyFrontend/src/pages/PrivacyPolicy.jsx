import React from 'react';
import { useNavigate } from 'react-router-dom';

const PrivacyPolicy = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6 sm:p-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 text-center">
          Privacy Policy
        </h1>
        <p className="text-sm sm:text-base text-gray-600 mb-6 italic text-center">
          Last updated: September 1, 2025
        </p>
        <p className="text-sm sm:text-base text-gray-700 mb-8">
          This Privacy Policy explains how Ecomlly collects, uses, and protects your personal information when you use our services. We are committed to safeguarding your data and ensuring transparency about how it is handled. By using our services, you agree to the practices described in this Privacy Policy.
        </p>

        <section className="mb-8">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4">
            1. Interpretation and Definitions
          </h2>
          <h3 className="text-lg sm:text-xl font-medium text-gray-700 mb-2">Interpretation</h3>
          <p className="text-sm sm:text-base text-gray-600 mb-4">
            Capitalized terms have meanings as defined in this section, and they apply whether singular or plural.
          </p>
          <h3 className="text-lg sm:text-xl font-medium text-gray-700 mb-2">Definitions</h3>
          <ul className="list-disc list-inside text-sm sm:text-base text-gray-600 space-y-2">
            <li><strong>Company</strong> (“we”, “our”, “us”) refers to Ecomlly.</li>
            <li><strong>Service</strong> means our website and app available at <a href="https://ecomlly.com" className="text-blue-600 hover:underline">https://ecomlly.com</a>.</li>
            <li><strong>Personal Data</strong> means any information that identifies or can identify you as an individual (e.g., name, email, IP address).</li>
            <li><strong>Usage Data</strong> means data collected automatically, such as browser type, device information, and website interactions.</li>
            <li><strong>Cookies</strong> are small files stored on your device to enhance your browsing experience.</li>
            <li><strong>Account</strong> means a registered profile created by you to access our services.</li>
            <li><strong>You</strong> refers to the user accessing or using our service.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4">
            2. Information We Collect
          </h2>
          <p className="text-sm sm:text-base text-gray-600 mb-4">
            We may collect the following information:
          </p>
          <ul className="list-disc list-inside text-sm sm:text-base text-gray-600 space-y-2">
            <li><strong>Personal Data:</strong> Name, email address, and any details you provide during registration.</li>
            <li><strong>Usage Data:</strong> Browser type, IP address, device information, and pages visited.</li>
            <li><strong>Cookies & Tracking:</strong> To improve user experience, track performance, and deliver relevant content.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4">
            3. How We Use Your Data
          </h2>
          <p className="text-sm sm:text-base text-gray-600 mb-4">
            We use collected information for:
          </p>
          <ul className="list-disc list-inside text-sm sm:text-base text-gray-600 space-y-2">
            <li>Providing and maintaining our services.</li>
            <li>Managing your account and enabling store setup.</li>
            <li>Sending updates, promotional offers, and support messages.</li>
            <li>Improving our AI technology, website, and customer experience.</li>
            <li>Ensuring compliance with legal obligations.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4">
            4. Cookies and Tracking Technologies
          </h2>
          <p className="text-sm sm:text-base text-gray-600 mb-4">
            We use cookies to:
          </p>
          <ul className="list-disc list-inside text-sm sm:text-base text-gray-600 space-y-2">
            <li>Keep you logged in.</li>
            <li>Remember your preferences (e.g., language, login details).</li>
            <li>Track service performance and analytics.</li>
          </ul>
          <p className="text-sm sm:text-base text-gray-600 mt-4">
            You can disable cookies in your browser, but some parts of our service may not function properly without them.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4">
            5. Data Retention
          </h2>
          <p className="text-sm sm:text-base text-gray-600">
            We will retain your personal data only as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required by law.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4">
            6. Data Sharing
          </h2>
          <p className="text-sm sm:text-base text-gray-600 mb-4">
            We do not sell your personal data. However, we may share information with:
          </p>
          <ul className="list-disc list-inside text-sm sm:text-base text-gray-600 space-y-2">
            <li><strong>Service Providers:</strong> To operate and improve our platform.</li>
            <li><strong>Business Partners:</strong> When necessary to deliver features you request.</li>
            <li><strong>Legal Authorities:</strong> If required by law.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4">
            7. Security of Your Data
          </h2>
          <p className="text-sm sm:text-base text-gray-600">
            We use commercially acceptable methods to protect your personal data. However, no online method of transmission or storage is 100% secure, and we cannot guarantee absolute security.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4">
            8. Children’s Privacy
          </h2>
          <p className="text-sm sm:text-base text-gray-600">
            Our services are not intended for children under 13 years of age, and we do not knowingly collect personal data from them. If you believe your child has provided us data, please contact us so we can remove it.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4">
            9. Links to Other Websites
          </h2>
          <p className="text-sm sm:text-base text-gray-600">
            Our service may contain links to external websites. We are not responsible for their content, policies, or practices. Please review their privacy policies when visiting those sites.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4">
            10. Changes to This Privacy Policy
          </h2>
          <p className="text-sm sm:text-base text-gray-600">
            We may update this Privacy Policy from time to time. If changes are significant, we will notify you via email or a notice on our website. The updated version will include the “Last Updated” date.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4">
            11. Contact Us
          </h2>
          <p className="text-sm sm:text-base text-gray-600">
            If you have any questions about this Privacy Policy, you can contact us:
          </p>
          <p className="text-sm sm:text-base text-gray-600 mt-2">
            📧 <a href="mailto:support@ecomlly.com" className="text-blue-600 hover:underline">support@ecomlly.com</a>
          </p>
        </section>

        <div className="mt-8 flex justify-center">
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300 text-sm sm:text-base"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;