import type { Metadata } from 'next'
import Link from 'next/link'
import { Trophy, Calendar, MapPin, Download, ChevronRight, Medal, Search } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Results',
  description: 'View results from para shooting competitions - national and international events.',
}

const recentResults = [
  {
    id: 1,
    title: 'Paris 2024 Paralympics',
    date: 'August-September 2024',
    location: 'Paris, France',
    type: 'Paralympic Games',
    indianResults: [
      { athlete: 'Avani Lekhara', event: 'R2 - 10m Air Rifle Standing SH1', position: '🥇 Gold', score: 249.7 },
      { athlete: 'Avani Lekhara', event: 'R8 - 50m Rifle 3 Positions SH1', position: '🥈 Silver', score: 450.8 },
      { athlete: 'Manish Narwal', event: 'P1 - 10m Air Pistol SH1', position: '🥇 Gold', score: 234.1 },
      { athlete: 'Singhraj Adhana', event: 'P1 - 10m Air Pistol SH1', position: '🥉 Bronze', score: 216.7 },
    ],
  },
  {
    id: 2,
    title: 'WSPS World Cup - Changwon',
    date: 'November 2025',
    location: 'Changwon, South Korea',
    type: 'World Cup',
    indianResults: [
      { athlete: 'Avani Lekhara', event: 'R2 - 10m Air Rifle Standing SH1', position: '🥇 Gold', score: 248.3 },
      { athlete: 'Deepender Singh', event: 'R4 - 10m Air Rifle Standing SH2', position: '🥈 Silver', score: 247.1 },
      { athlete: 'Rubina Francis', event: 'P2 - 10m Air Pistol SH1', position: '🥉 Bronze', score: 231.5 },
    ],
  },
  {
    id: 3,
    title: '67th National Shooting Championship',
    date: 'December 2024',
    location: 'New Delhi, India',
    type: 'National',
    indianResults: [
      { athlete: 'Avani Lekhara', event: 'R2 - 10m Air Rifle Standing SH1', position: '🥇 Gold', score: 251.2 },
      { athlete: 'Swaroop Unhalkar', event: 'R1 - 10m Air Rifle Standing SH1', position: '🥇 Gold', score: 246.8 },
      { athlete: 'Manish Narwal', event: 'P1 - 10m Air Pistol SH1', position: '🥇 Gold', score: 239.4 },
    ],
  },
]

const archives = [
  { year: '2024', events: 12, medals: '15 Gold, 8 Silver, 11 Bronze' },
  { year: '2023', events: 14, medals: '12 Gold, 10 Silver, 9 Bronze' },
  { year: '2022', events: 11, medals: '18 Gold, 12 Silver, 14 Bronze' },
  { year: '2021', events: 8, medals: '5 Gold, 3 Silver, 4 Bronze' },
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
            View detailed results from national and international para shooting competitions
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
                placeholder="Search by athlete, event, or competition..."
                className="input pl-12"
              />
            </div>
            <select className="input w-full md:w-48">
              <option value="">All Events</option>
              <option value="R1">R1 - Air Rifle SH1</option>
              <option value="R2">R2 - Air Rifle SH2</option>
              <option value="P1">P1 - Air Pistol SH1</option>
            </select>
            <select className="input w-full md:w-48">
              <option value="">All Years</option>
              <option value="2025">2025</option>
              <option value="2024">2024</option>
              <option value="2023">2023</option>
            </select>
          </div>
        </div>
      </section>

      {/* Medal Summary */}
      <section className="section bg-neutral-50">
        <div className="container-main">
          <h2 className="section-title">2024-25 Medal Tally</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Total Medals', value: 34, color: 'bg-primary' },
              { label: 'Gold', value: 15, color: 'bg-accent' },
              { label: 'Silver', value: 8, color: 'bg-neutral-400' },
              { label: 'Bronze', value: 11, color: 'bg-amber-600' },
            ].map((stat) => (
              <div key={stat.label} className="card text-center">
                <div className={`w-12 h-12 ${stat.color} rounded-full flex items-center justify-center mx-auto mb-3`}>
                  <Medal className="w-6 h-6 text-white" />
                </div>
                <div className="font-heading text-3xl font-bold text-neutral-700">{stat.value}</div>
                <div className="text-sm text-neutral-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Results */}
      <section className="section bg-white">
        <div className="container-main">
          <h2 className="section-title">Recent Competitions</h2>
          <div className="space-y-8">
            {recentResults.map((competition) => (
              <div key={competition.id} className="card">
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 mb-6">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="badge-info">{competition.type}</span>
                    </div>
                    <h3 className="font-heading text-xl font-semibold text-primary">
                      {competition.title}
                    </h3>
                    <div className="flex flex-wrap gap-4 mt-2 text-sm text-neutral-600">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {competition.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {competition.location}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Link
                      href={`/results/${competition.id}`}
                      className="btn-outline text-sm py-2"
                    >
                      Full Results
                    </Link>
                    <button className="btn-ghost text-sm py-2">
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <h4 className="font-semibold text-neutral-700 mb-3 flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-accent" />
                  Indian Results
                </h4>
                <div className="overflow-x-auto">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Athlete</th>
                        <th>Event</th>
                        <th className="text-center">Position</th>
                        <th className="text-right">Score</th>
                      </tr>
                    </thead>
                    <tbody>
                      {competition.indianResults.map((result, i) => (
                        <tr key={i}>
                          <td className="font-medium text-primary">{result.athlete}</td>
                          <td className="text-neutral-600 text-sm">{result.event}</td>
                          <td className="text-center font-semibold">{result.position}</td>
                          <td className="text-right font-data">{result.score.toFixed(1)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Archives */}
      <section className="section bg-neutral-50">
        <div className="container-main">
          <h2 className="section-title">Results Archive</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {archives.map((year) => (
              <Link
                key={year.year}
                href={`/results/archive/${year.year}`}
                className="card-hover group"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="font-heading text-2xl font-bold text-primary">{year.year}</span>
                  <ChevronRight className="w-5 h-5 text-neutral-400 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </div>
                <div className="text-sm text-neutral-600">
                  <p>{year.events} Competitions</p>
                  <p className="text-success font-medium mt-1">{year.medals}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Download Section */}
      <section className="section bg-white">
        <div className="container-main">
          <div className="card bg-primary/5 border-primary/20">
            <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                <Download className="w-8 h-8 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-heading font-semibold text-lg text-primary mb-2">
                  Download Complete Results
                </h3>
                <p className="text-neutral-600">
                  Get comprehensive result sheets, score cards, and ranking reports in PDF or Excel format.
                </p>
              </div>
              <div className="flex gap-3">
                <button className="btn-primary">Download PDF</button>
                <button className="btn-outline">Download Excel</button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default ResultsPage

