import type { Metadata } from 'next'
import Link from 'next/link'
import { Trophy, Calendar, MapPin, Download, ChevronRight, Medal, Search } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Results',
  description: 'View results from para shooting competitions - national and international events.',
}

const resultFiles = [
  {
    title: 'Complete Result of 6th NPSC 2025',
    fileName: 'Complete Result of 6th NPSC 2025.pdf',
    date: '2025',
  },
  {
    title: 'Complete Results of 5th NPSC 2024 Revised',
    fileName: 'Complete Results of 5th NPSC 2024 Revised.pdf',
    date: '2024',
  },
  {
    title: 'Complete Sign Scan Result of 4th NPSC (1st to 5th Nov 2023)',
    fileName: 'Complete Sign Scan Result of 4th NPSC (1st to 5th Nov 2023).pdf',
    date: '2023',
  },
  {
    title: 'Complete Final Results',
    fileName: 'Complete-Final-Results.pdf',
    date: 'Recent',
  },
  {
    title: 'FINAL RESULT SCAN Results 3rd Zonal Para Shooting Championship',
    fileName: 'FINAL RESULT SCAN Results-3rd-Zonal-Para-Shooting-Championship.pdf',
    date: 'Archive',
  },
  {
    title: 'Full Results 3rd National Para Shooting Championship at Mhow MP',
    fileName: 'Full Results-3rd-National-Para-Shooting-Championship-at-Mhow-MP.pdf',
    date: 'Archive',
  },
]

const ResultsPage = () => {
  return (
    <>
      {/* Hero Banner */}
      <section className="gradient-hero py-16 md:py-20">
        <div className="container-main text-center">
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-white mb-4">
            Competition Results
          </h1>
          <p className="text-white/90 max-w-2xl mx-auto">
            Access official result sheets from national and zonal para shooting championships
          </p>
        </div>
      </section>

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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {resultFiles.map((file, i) => (
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
                        href={`/results/${file.fileName}`}
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
            ))}
          </div>
        </div>
      </section>

    </>
  )
}

export default ResultsPage

