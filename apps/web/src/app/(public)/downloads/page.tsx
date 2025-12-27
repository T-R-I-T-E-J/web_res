import type { Metadata } from 'next'
import { FileText, Download, BookOpen, ClipboardList, Award, Shield } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Downloads',
  description: 'Download forms, circulars, rules, and guidelines for para shooting in India.',
}

const forms = [
  {
    title: 'New Shooter Registration Form',
    description: 'For athletes registering with PSCI for the first time',
    fileType: 'PDF',
    size: '245 KB',
    href: '/downloads/forms/registration-form.pdf',
  },
  {
    title: 'Event Entry Form',
    description: 'Standard entry form for national championships',
    fileType: 'PDF',
    size: '180 KB',
    href: '/downloads/forms/entry-form.pdf',
  },
  {
    title: 'Classification Request Form',
    description: 'Request for WSPS classification assessment',
    fileType: 'PDF',
    size: '156 KB',
    href: '/downloads/forms/classification-form.pdf',
  },
  {
    title: 'Equipment Declaration Form',
    description: 'Mandatory equipment registration for competitions',
    fileType: 'PDF',
    size: '134 KB',
    href: '/downloads/forms/equipment-form.pdf',
  },
  {
    title: 'Coach Accreditation Form',
    description: 'For coaches seeking official PSCI accreditation',
    fileType: 'PDF',
    size: '198 KB',
    href: '/downloads/forms/coach-form.pdf',
  },
  {
    title: 'State Association Affiliation Form',
    description: 'For state unit registration and renewal',
    fileType: 'PDF',
    size: '212 KB',
    href: '/downloads/forms/affiliation-form.pdf',
  },
]

const rulesAndGuidelines = [
  {
    title: 'ISSF/WSPS Rules 2024',
    description: 'Official rules for Paralympic shooting events',
    fileType: 'PDF',
    size: '2.4 MB',
    href: '/downloads/rules/issf-wsps-rules-2024.pdf',
  },
  {
    title: 'Classification Rules & Procedures',
    description: 'Complete guide to WSPS classification system',
    fileType: 'PDF',
    size: '890 KB',
    href: '/downloads/rules/classification-rules.pdf',
  },
  {
    title: 'Equipment Regulations',
    description: 'Specifications and regulations for rifles and pistols',
    fileType: 'PDF',
    size: '1.2 MB',
    href: '/downloads/rules/equipment-regulations.pdf',
  },
  {
    title: 'Anti-Doping Guidelines',
    description: 'WADA compliant anti-doping policies',
    fileType: 'PDF',
    size: '567 KB',
    href: '/downloads/rules/anti-doping.pdf',
  },
  {
    title: 'National Championship Regulations',
    description: 'Rules specific to NSCC events',
    fileType: 'PDF',
    size: '445 KB',
    href: '/downloads/rules/nscc-regulations.pdf',
  },
]

const circulars = [
  {
    title: 'Circular No. 45/2025 - Election Notice',
    description: 'Regarding upcoming elections for Executive Committee',
    date: 'Dec 20, 2025',
    fileType: 'PDF',
    href: '/downloads/circulars/45-2025-election.pdf',
  },
  {
    title: 'Circular No. 44/2025 - NSCC Dates',
    description: '68th National Championship schedule announcement',
    date: 'Dec 15, 2025',
    fileType: 'PDF',
    href: '/downloads/circulars/44-2025-nscc.pdf',
  },
  {
    title: 'Circular No. 43/2025 - Selection Policy',
    description: 'Updated selection criteria for international events',
    date: 'Dec 10, 2025',
    fileType: 'PDF',
    href: '/downloads/circulars/43-2025-selection.pdf',
  },
  {
    title: 'Circular No. 42/2025 - Fee Revision',
    description: 'Revised membership and entry fees for 2026',
    date: 'Dec 5, 2025',
    fileType: 'PDF',
    href: '/downloads/circulars/42-2025-fees.pdf',
  },
]

const DownloadCard = ({
  title,
  description,
  fileType,
  size,
  href,
  date,
}: {
  title: string
  description: string
  fileType: string
  size?: string
  href: string
  date?: string
}) => (
  <div className="card-hover group">
    <div className="flex items-start gap-4">
      <div className="w-12 h-12 bg-primary/10 rounded-card flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
        <FileText className="w-6 h-6 text-primary" />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-primary group-hover:text-interactive transition-colors">
          {title}
        </h3>
        <p className="text-sm text-neutral-600 mt-1">{description}</p>
        <div className="flex items-center gap-3 mt-2 text-xs text-neutral-400">
          <span className="uppercase font-medium">{fileType}</span>
          {size && <span>• {size}</span>}
          {date && <span>• {date}</span>}
        </div>
      </div>
    </div>
    <div className="mt-4 pt-4 border-t border-neutral-100">
      <a
        href={href}
        className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-accent transition-colors"
        download
      >
        <Download className="w-4 h-4" />
        Download {fileType}
      </a>
    </div>
  </div>
)

const DownloadsPage = () => {
  return (
    <>
      {/* Hero Banner */}
      <section className="gradient-hero py-16 md:py-20">
        <div className="container-main text-center">
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-white mb-4">
            Downloads
          </h1>
          <p className="text-white/90 max-w-2xl mx-auto">
            Access official forms, rules, circulars, and guidelines for para shooting in India
          </p>
        </div>
      </section>

      {/* Breadcrumb */}
      <nav className="bg-neutral-100 py-3 text-sm" aria-label="Breadcrumb">
        <div className="container-main">
          <ol className="flex items-center gap-2">
            <li><a href="/" className="text-interactive hover:text-primary">Home</a></li>
            <li className="text-neutral-400">/</li>
            <li className="text-neutral-600">Downloads</li>
          </ol>
        </div>
      </nav>

      {/* Quick Access Categories */}
      <section className="py-8 bg-white border-b border-neutral-200">
        <div className="container-main">
          <div className="flex flex-wrap justify-center gap-4">
            {[
              { label: 'Forms', icon: ClipboardList, href: '#forms' },
              { label: 'Rules & Guidelines', icon: BookOpen, href: '#rules' },
              { label: 'Circulars', icon: FileText, href: '#circulars' },
              { label: 'Results', icon: Award, href: '/results' },
            ].map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="flex items-center gap-2 px-6 py-3 bg-neutral-50 rounded-card hover:bg-primary/10 hover:text-primary transition-colors"
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Forms Section */}
      <section id="forms" className="section bg-neutral-50">
        <div className="container-main">
          <h2 className="section-title">Forms</h2>
          <p className="text-neutral-600 mb-8 max-w-2xl">
            Download official forms for registration, competition entries, and administrative purposes.
            All forms must be submitted to the PSCI office or uploaded through the shooter portal.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {forms.map((form) => (
              <DownloadCard key={form.title} {...form} />
            ))}
          </div>
        </div>
      </section>

      {/* Rules & Guidelines Section */}
      <section id="rules" className="section bg-white">
        <div className="container-main">
          <h2 className="section-title">Rules & Guidelines</h2>
          <p className="text-neutral-600 mb-8 max-w-2xl">
            Official rules, regulations, and guidelines governing para shooting in India.
            These documents follow ISSF and WSPS international standards.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rulesAndGuidelines.map((rule) => (
              <DownloadCard key={rule.title} {...rule} />
            ))}
          </div>
        </div>
      </section>

      {/* Circulars Section */}
      <section id="circulars" className="section bg-neutral-50">
        <div className="container-main">
          <h2 className="section-title">Circulars & Notifications</h2>
          <p className="text-neutral-600 mb-8 max-w-2xl">
            Latest circulars, notifications, and official communications from PSCI.
          </p>
          <div className="space-y-4">
            {circulars.map((circular) => (
              <div key={circular.title} className="card-hover">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-accent/10 rounded-card flex items-center justify-center flex-shrink-0">
                      <FileText className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-primary">{circular.title}</h3>
                      <p className="text-sm text-neutral-600">{circular.description}</p>
                      <span className="text-xs text-neutral-400 mt-1 block">{circular.date}</span>
                    </div>
                  </div>
                  <a
                    href={circular.href}
                    className="btn-primary text-sm py-2 self-start sm:self-center"
                    download
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </a>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <a href="/circulars" className="text-interactive hover:text-primary font-semibold">
              View All Circulars →
            </a>
          </div>
        </div>
      </section>

      {/* Help Section */}
      <section className="section bg-white">
        <div className="container-main">
          <div className="card bg-primary/5 border-primary/20">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                <Shield className="w-8 h-8 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-heading font-semibold text-lg text-primary mb-2">
                  Need Help with Downloads?
                </h3>
                <p className="text-neutral-600">
                  If you're having trouble accessing any documents or need assistance with forms, 
                  please contact our support team. We're here to help.
                </p>
              </div>
              <a href="/contact" className="btn-primary whitespace-nowrap">
                Contact Support
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default DownloadsPage

