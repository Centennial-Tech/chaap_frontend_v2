import { useState } from "react";
import { X } from "lucide-react";

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TermsModal = ({ isOpen, onClose }: TermsModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-lg shadow-xl overflow-hidden flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 flex-shrink-0">
            <h2 className="text-2xl font-bold text-gray-900">
              Terms and Conditions
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Content */}
          <div className="overflow-y-auto flex-1 p-6 space-y-6">
            <p className="text-gray-600 text-sm">
              Last updated: {new Date().toLocaleDateString()}
            </p>

            <section>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                1. Acceptance of Terms
              </h3>
              <p className="text-gray-700 leading-relaxed">
                By accessing and using the Centennial Healthcare AgenticAI Platform (CHAAP), 
                you accept and agree to be bound by the terms and provision of this agreement. 
                If you do not agree to abide by the above, please do not use this service.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                2. Description of Service
              </h3>
              <p className="text-gray-700 leading-relaxed mb-3">
                CHAAP is a modular, AI-powered platform designed to simplify and accelerate 
                regulatory submission processes across healthcare, biotech, diagnostics, and 
                digital therapeutics. Our platform provides:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                <li>AI-assisted content generation for regulatory submissions</li>
                <li>Pre-submission strategy planning and consultation</li>
                <li>Document preparation and validation services</li>
                <li>FDA meeting preparation assistance</li>
                <li>Post-market surveillance support</li>
                <li>Regulatory compliance monitoring and updates</li>
              </ul>
            </section>

            <section>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                3. User Accounts and Registration
              </h3>
              <p className="text-gray-700 leading-relaxed mb-3">
                To access certain features of CHAAP, you must create an account. You agree to:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                <li>Provide accurate, current, and complete information during registration</li>
                <li>Maintain and promptly update your account information</li>
                <li>Maintain the security of your password and account</li>
                <li>Accept responsibility for all activities under your account</li>
                <li>Notify us immediately of any unauthorized use of your account</li>
              </ul>
            </section>

            <section>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                4. Acceptable Use Policy
              </h3>
              <p className="text-gray-700 leading-relaxed mb-3">
                You agree not to use CHAAP to:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                <li>Violate any applicable laws or regulations</li>
                <li>Infringe upon the rights of others</li>
                <li>Transmit harmful, offensive, or inappropriate content</li>
                <li>Attempt to gain unauthorized access to our systems</li>
                <li>Interfere with the proper functioning of the platform</li>
                <li>Use the service for any commercial purpose without authorization</li>
              </ul>
            </section>

            <section>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                5. Privacy and Data Protection
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Your privacy is important to us. Our collection and use of personal information 
                is governed by our Privacy Policy, which is incorporated into these Terms by 
                reference. We are committed to protecting your data and maintaining compliance 
                with applicable data protection regulations.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                6. Intellectual Property Rights
              </h3>
              <p className="text-gray-700 leading-relaxed mb-3">
                CHAAP and its original content, features, and functionality are owned by 
                Centennial Healthcare and are protected by international copyright, trademark, 
                patent, trade secret, and other intellectual property laws.
              </p>
              <p className="text-gray-700 leading-relaxed">
                You retain ownership of any content you submit to the platform, but you grant 
                us a license to use, modify, and display such content in connection with 
                providing our services.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                7. Disclaimers and Limitations
              </h3>
              <p className="text-gray-700 leading-relaxed mb-3">
                CHAAP is provided "as is" without warranties of any kind. We do not guarantee:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                <li>Uninterrupted or error-free operation</li>
                <li>Accuracy of AI-generated content or recommendations</li>
                <li>Compliance with all regulatory requirements</li>
                <li>Approval of regulatory submissions</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mt-3">
                Users are responsible for reviewing and validating all AI-generated content 
                before submission to regulatory authorities.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                8. Limitation of Liability
              </h3>
              <p className="text-gray-700 leading-relaxed">
                In no event shall Centennial Healthcare be liable for any indirect, incidental, 
                special, consequential, or punitive damages, including without limitation, loss 
                of profits, data, use, goodwill, or other intangible losses, resulting from 
                your use of CHAAP.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                9. Termination
              </h3>
              <p className="text-gray-700 leading-relaxed">
                We may terminate or suspend your account and access to CHAAP immediately, 
                without prior notice, for any reason, including breach of these Terms. Upon 
                termination, your right to use the service will cease immediately.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                10. Changes to Terms
              </h3>
              <p className="text-gray-700 leading-relaxed">
                We reserve the right to modify these Terms at any time. We will notify users 
                of any material changes via email or through the platform. Your continued use 
                of CHAAP after such modifications constitutes acceptance of the updated Terms.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                11. Governing Law
              </h3>
              <p className="text-gray-700 leading-relaxed">
                These Terms shall be governed by and construed in accordance with the laws of 
                the jurisdiction in which Centennial Healthcare operates, without regard to 
                its conflict of law provisions.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                12. Contact Information
              </h3>
              <p className="text-gray-700 leading-relaxed mb-3">
                If you have any questions about these Terms and Conditions, please contact us at:
              </p>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-gray-700">
                  <strong>Centennial Healthcare</strong><br />
                  Email: legal@chaap.ai<br />
                  Address: [Your Business Address]<br />
                  Phone: [Your Phone Number]
                </p>
              </div>
            </section>
          </div>

          {/* Footer */}
          <div className="flex justify-end p-6 border-t border-gray-200 flex-shrink-0">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-white bg-gray-600 border border-gray-600 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors duration-200"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsModal; 