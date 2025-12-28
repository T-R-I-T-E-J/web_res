import type { Metadata } from 'next'
import Link from 'next/link'
import { FileText, Mail, Calendar, AlertCircle } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Terms of Service for Para Shooting Committee of India - Read our terms and conditions for using our website and services.',
  robots: 'index, follow',
}

const TermsOfServicePage = () => {
  const lastUpdated = '2025-12-28'

  return (
    <>
      {/* Hero Banner */}
      <section className="gradient-hero py-16 md:py-20">
        <div className="container-main text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 rounded-full mb-4">
            <FileText className="w-8 h-8 text-white" />
          </div>
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-white mb-4">
            Terms of Service
          </h1>
          <p className="text-white/90 max-w-2xl mx-auto">
            Please read these terms and conditions carefully before using our services.
          </p>
        </div>
      </section>

      {/* Breadcrumb */}
      <nav className="bg-neutral-100 py-3 text-sm" aria-label="Breadcrumb">
        <div className="container-main">
          <ol className="flex items-center gap-2">
            <li><Link href="/" className="text-interactive hover:text-primary">Home</Link></li>
            <li className="text-neutral-400">/</li>
            <li className="text-neutral-600">Terms of Service</li>
          </ol>
        </div>
      </nav>

      {/* Last Updated */}
      <section className="bg-white border-b border-neutral-200 py-4">
        <div className="container-main">
          <div className="flex items-center gap-2 text-sm text-neutral-600">
            <Calendar className="w-4 h-4" />
            <span>Last Updated: {lastUpdated}</span>
          </div>
        </div>
      </section>

      {/* Terms Content */}
      <section className="section bg-neutral-50">
        <div className="container-main max-w-4xl">
          <div className="card space-y-8">
            
            {/* Acceptance Notice */}
            <div className="bg-accent/10 border border-accent/20 rounded-card p-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-6 h-6 text-accent flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-lg text-accent mb-2">
                    Important Notice
                  </h3>
                  <p className="text-neutral-700 leading-relaxed">
                    By accessing and using this website, you accept and agree to be bound by the terms and provisions 
                    of this agreement. If you do not agree to these terms, please do not use this website.
                  </p>
                </div>
              </div>
            </div>

            {/* Introduction */}
            <div>
              <h2 className="font-heading font-bold text-2xl text-primary mb-4">
                1. Agreement to Terms
              </h2>
              <p className="text-neutral-700 leading-relaxed">
                These Terms of Service ("Terms") constitute a legally binding agreement between you and the Para Shooting 
                Committee of India ("PSCI", "we", "us", or "our") concerning your access to and use of our website and 
                services. By accessing or using our website, you agree to comply with and be bound by these Terms.
              </p>
            </div>

            {/* Use of Services */}
            <div>
              <h2 className="font-heading font-bold text-2xl text-primary mb-4">
                2. Use of Our Services
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg text-secondary mb-2">
                    2.1 Eligibility
                  </h3>
                  <p className="text-neutral-700 leading-relaxed">
                    You must be at least 13 years of age to use our services. If you are under 18, you must have 
                    parental or guardian consent to use our services and register for competitions.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-lg text-secondary mb-2">
                    2.2 Account Registration
                  </h3>
                  <p className="text-neutral-700 leading-relaxed mb-2">
                    When you create an account with us, you must provide accurate, complete, and current information. 
                    You are responsible for:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-neutral-700 ml-4">
                    <li>Maintaining the confidentiality of your account credentials</li>
                    <li>All activities that occur under your account</li>
                    <li>Notifying us immediately of any unauthorized use</li>
                    <li>Ensuring your contact information is up to date</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-lg text-secondary mb-2">
                    2.3 Acceptable Use
                  </h3>
                  <p className="text-neutral-700 leading-relaxed mb-2">
                    You agree not to:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-neutral-700 ml-4">
                    <li>Use our services for any illegal or unauthorized purpose</li>
                    <li>Violate any laws in your jurisdiction</li>
                    <li>Infringe upon the rights of others</li>
                    <li>Transmit any harmful or malicious code</li>
                    <li>Attempt to gain unauthorized access to our systems</li>
                    <li>Interfere with or disrupt our services</li>
                    <li>Impersonate any person or entity</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Competition Registration */}
            <div>
              <h2 className="font-heading font-bold text-2xl text-primary mb-4">
                3. Competition Registration and Participation
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg text-secondary mb-2">
                    3.1 Registration Requirements
                  </h3>
                  <p className="text-neutral-700 leading-relaxed">
                    To register for competitions, you must provide all required documentation including valid medical 
                    certificates, classification documents, and any other documents as specified in the competition 
                    guidelines. Registration fees are non-refundable unless the competition is cancelled by PSCI.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-lg text-secondary mb-2">
                    3.2 Competition Rules
                  </h3>
                  <p className="text-neutral-700 leading-relaxed">
                    All participants must comply with ISSF rules, IPC regulations, and PSCI competition guidelines. 
                    Violation of rules may result in disqualification and suspension from future events.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-lg text-secondary mb-2">
                    3.3 Results and Rankings
                  </h3>
                  <p className="text-neutral-700 leading-relaxed">
                    Competition results and rankings published on our website are official and final, subject to any 
                    appeals processed according to our appeals procedure. Results may be publicly displayed and shared 
                    with national and international shooting federations.
                  </p>
                </div>
              </div>
            </div>

            {/* Intellectual Property */}
            <div>
              <h2 className="font-heading font-bold text-2xl text-primary mb-4">
                4. Intellectual Property Rights
              </h2>
              <p className="text-neutral-700 leading-relaxed mb-4">
                All content on this website, including but not limited to text, graphics, logos, images, videos, and 
                software, is the property of PSCI or its content suppliers and is protected by Indian and international 
                copyright laws.
              </p>
              <p className="text-neutral-700 leading-relaxed">
                You may not reproduce, distribute, modify, create derivative works of, publicly display, or exploit any 
                content without our prior written permission. Limited use for personal, non-commercial purposes is permitted.
              </p>
            </div>

            {/* User Content */}
            <div>
              <h2 className="font-heading font-bold text-2xl text-primary mb-4">
                5. User-Generated Content
              </h2>
              <p className="text-neutral-700 leading-relaxed mb-4">
                By submitting content to our website (including photos, documents, or comments), you grant PSCI a 
                non-exclusive, worldwide, royalty-free license to use, reproduce, modify, and display such content for 
                the purposes of operating and promoting our services.
              </p>
              <p className="text-neutral-700 leading-relaxed">
                You represent and warrant that you own or have the necessary rights to submit such content and that it 
                does not violate any third-party rights or applicable laws.
              </p>
            </div>

            {/* Payment Terms */}
            <div>
              <h2 className="font-heading font-bold text-2xl text-primary mb-4">
                6. Payment and Fees
              </h2>
              <div className="space-y-4">
                <p className="text-neutral-700 leading-relaxed">
                  Registration fees for competitions and other services must be paid in full at the time of registration 
                  unless otherwise specified. We accept payment through the methods specified on our website.
                </p>
                <p className="text-neutral-700 leading-relaxed">
                  All fees are in Indian Rupees (INR) unless otherwise stated. Fees are subject to change with notice. 
                  Refunds are processed according to our refund policy, which may vary by event.
                </p>
              </div>
            </div>

            {/* Disclaimer of Warranties */}
            <div>
              <h2 className="font-heading font-bold text-2xl text-primary mb-4">
                7. Disclaimer of Warranties
              </h2>
              <p className="text-neutral-700 leading-relaxed mb-4">
                Our website and services are provided "as is" and "as available" without any warranties of any kind, 
                either express or implied. We do not warrant that:
              </p>
              <ul className="list-disc list-inside space-y-1 text-neutral-700 ml-4">
                <li>Our services will be uninterrupted, timely, secure, or error-free</li>
                <li>The results obtained from using our services will be accurate or reliable</li>
                <li>The quality of any products, services, or information obtained will meet your expectations</li>
                <li>Any errors in the software or content will be corrected</li>
              </ul>
            </div>

            {/* Limitation of Liability */}
            <div>
              <h2 className="font-heading font-bold text-2xl text-primary mb-4">
                8. Limitation of Liability
              </h2>
              <p className="text-neutral-700 leading-relaxed mb-4">
                To the maximum extent permitted by law, PSCI shall not be liable for any indirect, incidental, special, 
                consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or 
                indirectly, or any loss of data, use, goodwill, or other intangible losses resulting from:
              </p>
              <ul className="list-disc list-inside space-y-1 text-neutral-700 ml-4">
                <li>Your access to or use of or inability to access or use our services</li>
                <li>Any conduct or content of any third party on our services</li>
                <li>Any content obtained from our services</li>
                <li>Unauthorized access, use, or alteration of your transmissions or content</li>
              </ul>
            </div>

            {/* Indemnification */}
            <div>
              <h2 className="font-heading font-bold text-2xl text-primary mb-4">
                9. Indemnification
              </h2>
              <p className="text-neutral-700 leading-relaxed">
                You agree to indemnify, defend, and hold harmless PSCI, its officers, directors, employees, and agents 
                from and against any claims, liabilities, damages, losses, and expenses, including reasonable legal fees, 
                arising out of or in any way connected with your access to or use of our services, your violation of these 
                Terms, or your violation of any rights of another.
              </p>
            </div>

            {/* Termination */}
            <div>
              <h2 className="font-heading font-bold text-2xl text-primary mb-4">
                10. Termination
              </h2>
              <p className="text-neutral-700 leading-relaxed">
                We reserve the right to suspend or terminate your access to our services at any time, without notice, 
                for conduct that we believe violates these Terms or is harmful to other users, us, or third parties, or 
                for any other reason in our sole discretion.
              </p>
            </div>

            {/* Governing Law */}
            <div>
              <h2 className="font-heading font-bold text-2xl text-primary mb-4">
                11. Governing Law and Jurisdiction
              </h2>
              <p className="text-neutral-700 leading-relaxed">
                These Terms shall be governed by and construed in accordance with the laws of India, without regard to 
                its conflict of law provisions. Any disputes arising from these Terms or your use of our services shall 
                be subject to the exclusive jurisdiction of the courts in New Delhi, India.
              </p>
            </div>

            {/* Changes to Terms */}
            <div>
              <h2 className="font-heading font-bold text-2xl text-primary mb-4">
                12. Changes to Terms
              </h2>
              <p className="text-neutral-700 leading-relaxed">
                We reserve the right to modify or replace these Terms at any time. We will provide notice of any material 
                changes by posting the new Terms on this page and updating the "Last Updated" date. Your continued use of 
                our services after any such changes constitutes your acceptance of the new Terms.
              </p>
            </div>

            {/* Severability */}
            <div>
              <h2 className="font-heading font-bold text-2xl text-primary mb-4">
                13. Severability
              </h2>
              <p className="text-neutral-700 leading-relaxed">
                If any provision of these Terms is found to be unenforceable or invalid, that provision will be limited 
                or eliminated to the minimum extent necessary so that these Terms will otherwise remain in full force and 
                effect and enforceable.
              </p>
            </div>

            {/* Entire Agreement */}
            <div>
              <h2 className="font-heading font-bold text-2xl text-primary mb-4">
                14. Entire Agreement
              </h2>
              <p className="text-neutral-700 leading-relaxed">
                These Terms constitute the entire agreement between you and PSCI regarding the use of our services and 
                supersede all prior agreements and understandings, whether written or oral, regarding such subject matter.
              </p>
            </div>

            {/* Contact Information */}
            <div className="bg-neutral-50 border border-neutral-200 rounded-card p-6">
              <h2 className="font-heading font-bold text-2xl text-primary mb-4 flex items-center gap-2">
                <Mail className="w-6 h-6" />
                Contact Us
              </h2>
              <p className="text-neutral-700 leading-relaxed mb-4">
                If you have any questions about these Terms of Service, please contact us:
              </p>
              <div className="space-y-2 text-neutral-700">
                <p><strong>Para Shooting Committee of India</strong></p>
                <p>51-B, Tughlakabad Institutional Area</p>
                <p>New Delhi - 110062, India</p>
                <p>Email: <a href="mailto:info@parashooting.org" className="text-interactive hover:underline">info@parashooting.org</a></p>
                <p>Phone: +91-11-29964091/92/93</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section bg-white border-t border-neutral-200">
        <div className="container-main text-center max-w-2xl mx-auto">
          <h3 className="font-heading font-semibold text-xl text-primary mb-4">
            Questions About These Terms?
          </h3>
          <p className="text-neutral-600 mb-8">
            If you have any questions or need clarification about our Terms of Service, our team is here to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact" className="btn-primary">
              Contact Us
            </Link>
            <Link href="/privacy" className="btn-outline">
              View Privacy Policy
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}

export default TermsOfServicePage
