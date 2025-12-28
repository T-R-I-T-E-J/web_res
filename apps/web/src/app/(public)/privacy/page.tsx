import type { Metadata } from 'next'
import Link from 'next/link'
import { Shield, Mail, Calendar } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy Policy for Para Shooting Committee of India - Learn how we collect, use, and protect your personal information.',
  robots: 'index, follow',
}

const PrivacyPolicyPage = () => {
  const lastUpdated = '2025-12-28'

  return (
    <>
      {/* Hero Banner */}
      <section className="gradient-hero py-16 md:py-20">
        <div className="container-main text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 rounded-full mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-white mb-4">
            Privacy Policy
          </h1>
          <p className="text-white/90 max-w-2xl mx-auto">
            Your privacy is important to us. This policy explains how we collect, use, and protect your information.
          </p>
        </div>
      </section>

      {/* Breadcrumb */}
      <nav className="bg-neutral-100 py-3 text-sm" aria-label="Breadcrumb">
        <div className="container-main">
          <ol className="flex items-center gap-2">
            <li><Link href="/" className="text-interactive hover:text-primary">Home</Link></li>
            <li className="text-neutral-400">/</li>
            <li className="text-neutral-600">Privacy Policy</li>
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

      {/* Privacy Policy Content */}
      <section className="section bg-neutral-50">
        <div className="container-main max-w-4xl">
          <div className="card space-y-8">
            
            {/* Introduction */}
            <div>
              <h2 className="font-heading font-bold text-2xl text-primary mb-4">
                1. Introduction
              </h2>
              <p className="text-neutral-700 leading-relaxed">
                Para Shooting Committee of India ("we", "our", or "us") is committed to protecting your privacy. 
                This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you 
                visit our website or use our services.
              </p>
            </div>

            {/* Information We Collect */}
            <div>
              <h2 className="font-heading font-bold text-2xl text-primary mb-4">
                2. Information We Collect
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg text-secondary mb-2">
                    2.1 Personal Information
                  </h3>
                  <p className="text-neutral-700 leading-relaxed mb-2">
                    We may collect personal information that you voluntarily provide to us, including but not limited to:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-neutral-700 ml-4">
                    <li>Name and contact information (email, phone number, address)</li>
                    <li>Date of birth and age</li>
                    <li>Shooting classification and disability information</li>
                    <li>Competition registration details</li>
                    <li>Payment information for event registrations</li>
                    <li>Medical certificates and related documents</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-lg text-secondary mb-2">
                    2.2 Automatically Collected Information
                  </h3>
                  <p className="text-neutral-700 leading-relaxed mb-2">
                    When you visit our website, we may automatically collect:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-neutral-700 ml-4">
                    <li>IP address and browser type</li>
                    <li>Device information and operating system</li>
                    <li>Pages visited and time spent on our website</li>
                    <li>Referring website addresses</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* How We Use Your Information */}
            <div>
              <h2 className="font-heading font-bold text-2xl text-primary mb-4">
                3. How We Use Your Information
              </h2>
              <p className="text-neutral-700 leading-relaxed mb-2">
                We use the information we collect for the following purposes:
              </p>
              <ul className="list-disc list-inside space-y-1 text-neutral-700 ml-4">
                <li>To process competition registrations and manage events</li>
                <li>To communicate with athletes, coaches, and officials</li>
                <li>To maintain shooter rankings and records</li>
                <li>To publish competition results and achievements</li>
                <li>To improve our website and services</li>
                <li>To comply with legal obligations and regulations</li>
                <li>To send important updates and notifications</li>
              </ul>
            </div>

            {/* Information Sharing */}
            <div>
              <h2 className="font-heading font-bold text-2xl text-primary mb-4">
                4. Information Sharing and Disclosure
              </h2>
              <p className="text-neutral-700 leading-relaxed mb-2">
                We may share your information in the following circumstances:
              </p>
              <ul className="list-disc list-inside space-y-1 text-neutral-700 ml-4">
                <li><strong>Public Results:</strong> Competition results, rankings, and achievements may be published publicly</li>
                <li><strong>Sports Organizations:</strong> With national and international shooting federations (ISSF, IPC, etc.)</li>
                <li><strong>Service Providers:</strong> With trusted third-party service providers who assist in our operations</li>
                <li><strong>Legal Requirements:</strong> When required by law or to protect our rights and safety</li>
              </ul>
            </div>

            {/* Data Security */}
            <div>
              <h2 className="font-heading font-bold text-2xl text-primary mb-4">
                5. Data Security
              </h2>
              <p className="text-neutral-700 leading-relaxed">
                We implement appropriate technical and organizational security measures to protect your personal information 
                against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over 
                the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
              </p>
            </div>

            {/* Your Rights */}
            <div>
              <h2 className="font-heading font-bold text-2xl text-primary mb-4">
                6. Your Rights
              </h2>
              <p className="text-neutral-700 leading-relaxed mb-2">
                You have the following rights regarding your personal information:
              </p>
              <ul className="list-disc list-inside space-y-1 text-neutral-700 ml-4">
                <li><strong>Access:</strong> Request access to your personal information</li>
                <li><strong>Correction:</strong> Request correction of inaccurate or incomplete information</li>
                <li><strong>Deletion:</strong> Request deletion of your personal information (subject to legal requirements)</li>
                <li><strong>Objection:</strong> Object to processing of your personal information</li>
                <li><strong>Data Portability:</strong> Request transfer of your data to another organization</li>
              </ul>
              <p className="text-neutral-700 leading-relaxed mt-4">
                To exercise these rights, please contact us using the information provided below.
              </p>
            </div>

            {/* Cookies */}
            <div>
              <h2 className="font-heading font-bold text-2xl text-primary mb-4">
                7. Cookies and Tracking Technologies
              </h2>
              <p className="text-neutral-700 leading-relaxed">
                We use cookies and similar tracking technologies to enhance your browsing experience, analyze website traffic, 
                and understand user preferences. You can control cookie settings through your browser preferences.
              </p>
            </div>

            {/* Children's Privacy */}
            <div>
              <h2 className="font-heading font-bold text-2xl text-primary mb-4">
                8. Children's Privacy
              </h2>
              <p className="text-neutral-700 leading-relaxed">
                Our services may be used by minors under parental or guardian supervision. We require parental consent for 
                registration of athletes under 18 years of age. Parents and guardians have the right to review, modify, or 
                delete their child's personal information.
              </p>
            </div>

            {/* Data Retention */}
            <div>
              <h2 className="font-heading font-bold text-2xl text-primary mb-4">
                9. Data Retention
              </h2>
              <p className="text-neutral-700 leading-relaxed">
                We retain your personal information for as long as necessary to fulfill the purposes outlined in this Privacy 
                Policy, comply with legal obligations, resolve disputes, and enforce our agreements. Competition results and 
                historical records may be retained indefinitely for archival purposes.
              </p>
            </div>

            {/* Changes to Privacy Policy */}
            <div>
              <h2 className="font-heading font-bold text-2xl text-primary mb-4">
                10. Changes to This Privacy Policy
              </h2>
              <p className="text-neutral-700 leading-relaxed">
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new 
                Privacy Policy on this page and updating the "Last Updated" date. We encourage you to review this Privacy 
                Policy periodically for any changes.
              </p>
            </div>

            {/* Contact Information */}
            <div className="bg-neutral-50 border border-neutral-200 rounded-card p-6">
              <h2 className="font-heading font-bold text-2xl text-primary mb-4 flex items-center gap-2">
                <Mail className="w-6 h-6" />
                Contact Us
              </h2>
              <p className="text-neutral-700 leading-relaxed mb-4">
                If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, 
                please contact us:
              </p>
              <div className="space-y-2 text-neutral-700">
                <p><strong>Para Shooting Committee of India</strong></p>
                <p>51-B, Tughlakabad Institutional Area</p>
                <p>New Delhi - 110062, India</p>
                <p>Email: <a href="mailto:info@parashooting.org" className="text-interactive hover:underline">info@parashooting.org</a></p>
                <p>Phone: +91-11-29964091/92/93</p>
              </div>
            </div>

            {/* Governing Law */}
            <div>
              <h2 className="font-heading font-bold text-2xl text-primary mb-4">
                11. Governing Law
              </h2>
              <p className="text-neutral-700 leading-relaxed">
                This Privacy Policy is governed by and construed in accordance with the laws of India. Any disputes arising 
                from this Privacy Policy shall be subject to the exclusive jurisdiction of the courts in New Delhi, India.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section bg-white border-t border-neutral-200">
        <div className="container-main text-center max-w-2xl mx-auto">
          <h3 className="font-heading font-semibold text-xl text-primary mb-4">
            Questions About Your Privacy?
          </h3>
          <p className="text-neutral-600 mb-8">
            We're here to help. If you have any questions or concerns about how we handle your personal information, 
            please don't hesitate to reach out to us.
          </p>
          <Link href="/contact" className="btn-primary">
            Contact Us
          </Link>
        </div>
      </section>
    </>
  )
}

export default PrivacyPolicyPage
