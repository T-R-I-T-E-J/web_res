import type { Metadata } from 'next'
import { FileText, Download, BookOpen, ClipboardList, Award, Shield } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Downloads',
  description: 'Download official rules and guidelines for para shooting in India.',
}

const rulesAndGuidelines = [
  {
    title: 'WSPS Rulebook 2026',
    description: 'Official World Shooting Para Sport Rulebook - Final Version',
    fileType: 'PDF',
    size: 'External',
    href: 'https://www.paralympic.org/sites/default/files/2025-12/WSPS%20Rulebook%202026_vFinal_0.pdf',
  },
  {
    title: 'WSPS Rulebook Appendices 2026',
    description: 'Appendices to the Official WSPS Rulebook 2026',
    fileType: 'PDF',
    size: 'External',
    href: 'https://www.paralympic.org/sites/default/files/2025-12/WSPS%20Rulebook%20Appendices%202026_vFinal.pdf',
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
        target="_blank"
        rel="noopener noreferrer"
      >
        <Download className="w-4 h-4" />
        View {fileType}
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
            Access official rules and guidelines for para shooting in India
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
              { label: 'Rules & Guidelines', icon: BookOpen, href: '#rules' },
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
                  If you're having trouble accessing any documents or need assistance, 
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

