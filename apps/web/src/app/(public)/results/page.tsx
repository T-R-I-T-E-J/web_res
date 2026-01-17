import type { Metadata } from 'next'
import Link from 'next/link'
import { Trophy, Calendar, MapPin, Download, ChevronRight, Medal, Search } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Results',
  description: 'View results from para shooting competitions - national and international events.',
}

export const dynamic = 'force-dynamic'

const getResults = async () => {
  try {
    // Construct absolute URL for SSR
    // Vercel automatically provides VERCEL_URL during deployment
    const baseUrl = process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}`
      : process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
    
    const url = `${baseUrl}/api/v1/results`
    console.log('[Results Page] Fetching from:', url)
    
    const res = await fetch(url, {
      cache: 'no-store',
    })
    
    if (!res.ok) {
       console.error('[Results Page] Fetch failed:', res.status, res.statusText)
       return []
    }

    const json = await res.json()
    console.log('[Results Page] Results count:', Array.isArray(json.data) ? json.data.length : 0)
    const data = json.data || json
    return Array.isArray(data) ? data : []
  } catch (error) {
    console.error('[Results Page] Error fetching results:', error)
    return []
  }
}

const ResultsPage = async () => {
  const results = await getResults()

  // Map API data to UI format if needed, or use directly if variable names match
  // API returns: { id, title, date, fileName, url, ... }
  // UI expects: { title, date, fileName (for display/link?) }
  // We need to adapt the link to use 'url' from API

  return (
    <>


      {/* Breadcrumb */}
      <nav className="bg-neutral-100 py-3 text-sm" aria-label="Breadcrumb">
        <div className="container-main">
          <ol className="flex items-center gap-2">
            <li><a href="/" className="text-interactive hover:text-primary">Home</a></li>
            <li className="text-neutral-400">/</li>
            <li className="text-neutral-600">Results</li>
          </ol>
        </div>
      </nav>

      {/* Search & Filters */}
      <section className="py-6 bg-white border-b border-neutral-200">
        <div className="container-main">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
              <input
                type="search"
                placeholder="Search by championship or year..."
                className="input pl-12"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Results List */}
      <section className="section bg-neutral-50">
        <div className="container-main">
          <h2 className="section-title">Official Result Sheets</h2>
          {results.length === 0 ? (
             <div className="text-center py-12 text-neutral-500">
               No results found.
             </div>
          ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {results.map((file: any, i: number) => {
              // Fix for localhost URLs in production
              // Replace all localhost variations with production backend URL
              const backendUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '') || 'https://web-res.onrender.com';
              const fileUrl = file.url
                ?.replace('http://localhost:8080', backendUrl)
                ?.replace('http://localhost:4000', backendUrl)
                ?.replace('http://localhost:10000', backendUrl);

              return (
              <div key={i} className="card-hover group">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-card flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                    <Download className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-primary group-hover:text-interactive transition-colors truncate" title={file.title}>
                      {file.title}
                    </h3>
                    <p className="text-sm text-neutral-500 mt-1 uppercase font-medium tracking-wider">
                      {file.date} • PDF Document
                    </p>
                    <div className="mt-4">
                      <a
                        href={fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm font-bold text-accent hover:text-accent-dark transition-colors"
                      >
                        VIEW FULL RESULT <ChevronRight className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            )})}
          </div>
          )}
        </div>
      </section>

    </>
  )
}

export default ResultsPage

