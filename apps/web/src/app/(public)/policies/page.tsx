
import type { Metadata } from 'next'
import { FileText, Download, BookOpen, Calendar, Trophy, ClipboardList } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Policies',
  description: 'Download official rules, guidelines, and selection policies for para shooting in India.',
}

const categories = [
  { label: 'Rules & Guidelines', icon: BookOpen, id: 'rules' },
  { label: 'Selection Policies', icon: Trophy, id: 'selection' },
  { label: 'Event Calendar', icon: Calendar, id: 'calendar' },
  { label: 'Match Documents', icon: ClipboardList, id: 'match' },
]

interface DownloadItem {
  id: string
  title: string
  description: string
  fileType: string
  size?: string
  href: string
  category: string
  createdAt?: string
  date?: string // Some items might have explicit date if we added that field, but for now createdAt
}

async function getDownloads(): Promise<DownloadItem[]> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';
    console.log(`Fetching downloads from: ${apiUrl}/downloads`);
    
    const res = await fetch(`${apiUrl}/downloads`, {
      cache: 'no-store',
    })
    
    if (!res.ok) {
       console.error('Failed to fetch downloads:', res.status, await res.text())
       return []
    }

    const json = await res.json()
    // Handle potential response wrapping (Standard NestJS interceptors might wrap in { data: ... })
    const data = Array.isArray(json) ? json : (json.data || [])
    return Array.isArray(data) ? data : []
  } catch (error) {
    console.error('Error fetching downloads:', error)
    return []
  }
}

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
          {date && <span>• {new Date(date).toLocaleDateString()}</span>}
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
        {fileType === 'Link' ? 'Open Link' : `Download ${fileType}`}
      </a>
    </div>
  </div>
)

const DownloadsPage = async () => {
  const downloads = await getDownloads();
  
  const rules = downloads.filter(d => d.category === 'rules');
  const selection = downloads.filter(d => d.category === 'selection');
  const calendarItems = downloads.filter(d => d.category === 'calendar');
  const match = downloads.filter(d => d.category === 'match');

  return (
    <>


      {/* Breadcrumb */}
      <nav className="bg-neutral-100 py-3 text-sm" aria-label="Breadcrumb">
        <div className="container-main">
          <ol className="flex items-center gap-2">
            <li><a href="/" className="text-interactive hover:text-primary">Home</a></li>
            <li className="text-neutral-400">/</li>
            <li className="text-neutral-600">Policies</li>
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
      <section id="rules" className="section bg-white">
        <div className="container-main">
          <h2 className="section-title">Rules & Guidelines</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rules.length > 0 ? rules.map((rule) => (
              <DownloadCard 
                key={rule.id} 
                {...rule} 
                date={rule.createdAt} 
              />
            )) : (
              <p className="text-neutral-500">No documents found.</p>
            )}
          </div>
        </div>
      </section>

      {/* Selection Policies Section */}
      <section id="selection" className="section bg-neutral-50">
        <div className="container-main">
          <h2 className="section-title">Selection Policies</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {selection.length > 0 ? selection.map((policy) => (
              <DownloadCard 
                key={policy.id} 
                {...policy} 
                date={policy.createdAt}
              />
            )) : (
              <p className="text-neutral-500">No documents found.</p>
            )}
          </div>
        </div>
      </section>

      {/* Event Calendar Section */}
      <section id="calendar" className="section bg-white">
        <div className="container-main">
          <h2 className="section-title">Event Calendar</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {calendarItems.length > 0 ? calendarItems.map((item) => (
              <DownloadCard 
                key={item.id} 
                {...item} 
                date={item.createdAt}
              />
            )) : (
              <p className="text-neutral-500">No documents found.</p>
            )}
          </div>
        </div>
      </section>

      {/* Match Documents Section */}
      <section id="match" className="section bg-neutral-50">
        <div className="container-main">
          <h2 className="section-title">Match Documents</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {match.length > 0 ? match.map((doc) => (
              <DownloadCard 
                key={doc.id} 
                {...doc} 
                date={doc.createdAt}
              />
            )) : (
              <p className="text-neutral-500">No documents found.</p>
            )}
          </div>
        </div>
      </section>
    </>
  )
}

export default DownloadsPage
