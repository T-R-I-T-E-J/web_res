import type { Metadata } from 'next'
import { FileText, Download, BookOpen } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Downloads',
  description: 'Download official rules and guidelines for para shooting in India.',
}

const categories = [
  { label: 'Rules & Guidelines', icon: BookOpen, id: 'rules' },
]

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
        Download {fileType}
      </a>
    </div>
  </div>
)

const DownloadsPage = () => {
  return (
    <>
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
            {categories.map((item) => (
              <a
                key={item.label}
                href={`#${item.id}`}
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
      <section id="rules" className="section bg-neutral-50">
        <div className="container-main">
          <h2 className="section-title">Rules & Guidelines</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rulesAndGuidelines.map((rule) => (
              <DownloadCard key={rule.title} {...rule} />
            ))}
          </div>
        </div>
      </section>

    </>
  )
}

export default DownloadsPage
