import { Eye, Ear, MousePointer, Keyboard, Type, Palette } from 'lucide-react'

export default function AccessibilityPage() {
  return (
    <div className="container-main py-12">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-heading font-bold text-primary mb-4">Accessibility Statement</h1>
          <p className="text-lg text-neutral-600">
            Para Shooting Committee of India is committed to ensuring digital accessibility for people with disabilities.
          </p>
        </div>

        {/* Commitment Section */}
        <div className="card mb-6">
          <h2 className="text-xl font-heading font-semibold text-primary mb-4">Our Commitment</h2>
          <div className="space-y-4 text-neutral-700">
            <p>
              We are continually improving the user experience for everyone and applying the relevant accessibility standards
              to ensure we provide equal access to all of our users.
            </p>
            <p>
              This website strives to conform to Level AA of the World Wide Web Consortium (W3C) Web Content Accessibility
              Guidelines 2.1 (WCAG 2.1). These guidelines explain how to make web content more accessible for people with disabilities.
            </p>
          </div>
        </div>

        {/* Accessibility Features */}
        <div className="card mb-6">
          <h2 className="text-xl font-heading font-semibold text-primary mb-2">Accessibility Features</h2>
          <p className="text-sm text-neutral-500 mb-6">
            We have implemented the following features to improve accessibility
          </p>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="flex gap-3">
              <Eye className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-neutral-700 mb-1">Visual Accessibility</h3>
                <ul className="text-sm text-neutral-600 space-y-1">
                  <li>• High contrast color schemes</li>
                  <li>• Resizable text without loss of functionality</li>
                  <li>• Clear visual focus indicators</li>
                  <li>• Alternative text for images</li>
                </ul>
              </div>
            </div>

            <div className="flex gap-3">
              <Keyboard className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-neutral-700 mb-1">Keyboard Navigation</h3>
                <ul className="text-sm text-neutral-600 space-y-1">
                  <li>• Full keyboard accessibility</li>
                  <li>• Logical tab order</li>
                  <li>• Skip navigation links</li>
                  <li>• Keyboard shortcuts documented</li>
                </ul>
              </div>
            </div>

            <div className="flex gap-3">
              <Ear className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-neutral-700 mb-1">Screen Reader Support</h3>
                <ul className="text-sm text-neutral-600 space-y-1">
                  <li>• Semantic HTML structure</li>
                  <li>• ARIA labels and landmarks</li>
                  <li>• Descriptive link text</li>
                  <li>• Form labels and instructions</li>
                </ul>
              </div>
            </div>

            <div className="flex gap-3">
              <Type className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-neutral-700 mb-1">Content Readability</h3>
                <ul className="text-sm text-neutral-600 space-y-1">
                  <li>• Clear and simple language</li>
                  <li>• Consistent navigation</li>
                  <li>• Readable font sizes</li>
                  <li>• Proper heading hierarchy</li>
                </ul>
              </div>
            </div>

            <div className="flex gap-3">
              <MousePointer className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-neutral-700 mb-1">Interactive Elements</h3>
                <ul className="text-sm text-neutral-600 space-y-1">
                  <li>• Large clickable areas</li>
                  <li>• Clear error messages</li>
                  <li>• Form validation feedback</li>
                  <li>• Accessible modals and dialogs</li>
                </ul>
              </div>
            </div>

            <div className="flex gap-3">
              <Palette className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-neutral-700 mb-1">Color & Contrast</h3>
                <ul className="text-sm text-neutral-600 space-y-1">
                  <li>• WCAG AA contrast ratios</li>
                  <li>• Color is not the only indicator</li>
                  <li>• Dark mode support</li>
                  <li>• Reduced motion options</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Feedback Section */}
        <div className="card mb-6">
          <h2 className="text-xl font-heading font-semibold text-primary mb-4">Feedback and Contact</h2>
          <div className="space-y-4 text-neutral-700">
            <p>
              We welcome your feedback on the accessibility of this website. Please let us know if you encounter
              accessibility barriers:
            </p>
            <ul className="space-y-2 ml-4">
              <li>
                <strong>Email:</strong>{' '}
                <a href="mailto:accessibility@parashootingindia.org" className="text-interactive hover:underline">
                  accessibility@parashootingindia.org
                </a>
              </li>
              <li>
                <strong>Phone:</strong> +91 (011) XXXX-XXXX
              </li>
              <li>
                <strong>Address:</strong> Para Shooting Committee of India, New Delhi, India
              </li>
            </ul>
            <p className="text-sm text-neutral-500">
              We try to respond to accessibility feedback within 5 business days.
            </p>
          </div>
        </div>

        {/* Technical Specifications */}
        <div className="card mb-6">
          <h2 className="text-xl font-heading font-semibold text-primary mb-4">Technical Specifications</h2>
          <div className="space-y-4 text-neutral-700">
            <p>
              Accessibility of this website relies on the following technologies to work with the particular combination
              of web browser and any assistive technologies or plugins installed on your computer:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4 text-sm text-neutral-600">
              <li>HTML5</li>
              <li>WAI-ARIA</li>
              <li>CSS3</li>
              <li>JavaScript</li>
            </ul>
            <p className="text-sm text-neutral-500">
              These technologies are relied upon for conformance with the accessibility standards used.
            </p>
          </div>
        </div>

        {/* Limitations */}
        <div className="card mb-6">
          <h2 className="text-xl font-heading font-semibold text-primary mb-4">Known Limitations</h2>
          <div className="space-y-4 text-neutral-700">
            <p>
              Despite our best efforts to ensure accessibility, there may be some limitations. Below is a description
              of known limitations and potential solutions:
            </p>
            <ul className="space-y-3 ml-4">
              <li className="text-sm">
                <strong>Uploaded documents:</strong> Some PDF documents may not be fully accessible. We are working to
                ensure all future documents meet accessibility standards.
              </li>
              <li className="text-sm">
                <strong>Third-party content:</strong> Some embedded content from third-party sources may not meet our
                accessibility standards.
              </li>
              <li className="text-sm">
                <strong>Legacy content:</strong> Older content is being reviewed and updated to meet current standards.
              </li>
            </ul>
          </div>
        </div>

        {/* Assessment */}
        <div className="card">
          <h2 className="text-xl font-heading font-semibold text-primary mb-4">Assessment Approach</h2>
          <div className="space-y-4 text-neutral-700">
            <p>
              Para Shooting Committee of India assessed the accessibility of this website by the following approaches:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4 text-sm text-neutral-600">
              <li>Self-evaluation</li>
              <li>Automated testing tools</li>
              <li>Manual testing with assistive technologies</li>
              <li>User feedback and testing</li>
            </ul>
            <p className="text-sm text-neutral-500 mt-4">
              <strong>Last updated:</strong> January 2026
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
