import type { Metadata } from 'next'
import { Trophy, Medal, TrendingUp, TrendingDown, Minus, Filter, Download } from 'lucide-react'
import clsx from 'clsx'

export const metadata: Metadata = {
  title: 'Rankings',
  description: 'View current national and international rankings for Indian para shooters.',
}

const events = [
  { code: 'R1', name: '10m Air Rifle Standing SH1' },
  { code: 'R2', name: '10m Air Rifle Standing SH2' },
  { code: 'R4', name: '10m Air Rifle Standing SH2 Mixed' },
  { code: 'P1', name: '10m Air Pistol SH1' },
  { code: 'P2', name: '10m Air Pistol SH1 Mixed' },
]

const rankings = [
  { rank: 1, name: 'Avani Lekhara', state: 'Rajasthan', event: 'R2', score: 634.5, change: 'same', best: 649.7, medals: 4 },
  { rank: 2, name: 'Manish Narwal', state: 'Haryana', event: 'P1', score: 629.8, change: 'up', best: 641.2, medals: 3 },
  { rank: 3, name: 'Singhraj Adhana', state: 'Haryana', event: 'P1', score: 627.4, change: 'up', best: 638.5, medals: 2 },
  { rank: 4, name: 'Rubina Francis', state: 'Madhya Pradesh', event: 'P2', score: 625.1, change: 'down', best: 635.8, medals: 2 },
  { rank: 5, name: 'Swaroop Unhalkar', state: 'Maharashtra', event: 'R1', score: 623.7, change: 'same', best: 632.1, medals: 1 },
  { rank: 6, name: 'Deepender Singh', state: 'Haryana', event: 'R4', score: 621.9, change: 'up', best: 630.4, medals: 1 },
  { rank: 7, name: 'Pooja Agarwal', state: 'Uttar Pradesh', event: 'R2', score: 619.2, change: 'same', best: 628.7, medals: 0 },
  { rank: 8, name: 'Sidhartha Babu', state: 'Kerala', event: 'R1', score: 617.8, change: 'down', best: 626.3, medals: 0 },
  { rank: 9, name: 'Prachi Yadav', state: 'Maharashtra', event: 'P1', score: 615.4, change: 'up', best: 624.9, medals: 0 },
  { rank: 10, name: 'Nishad Kumar', state: 'Himachal Pradesh', event: 'R4', score: 613.1, change: 'same', best: 622.5, medals: 0 },
]

const topPerformers = [
  { name: 'Avani Lekhara', event: 'R2', achievement: 'Paralympic Gold Medalist', imageUrl: null },
  { name: 'Manish Narwal', event: 'P1', achievement: 'World Record Holder', imageUrl: null },
  { name: 'Singhraj Adhana', event: 'P1', achievement: 'Asian Games Champion', imageUrl: null },
]

const RankingsPage = () => {
  return (
    <>
      {/* Hero Banner */}
      <section className="gradient-hero py-16 md:py-20">
        <div className="container-main text-center">
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-white mb-4">
            National Rankings
          </h1>
          <p className="text-white/90 max-w-2xl mx-auto">
            Current standings of Indian para shooters based on national and international performances
          </p>
        </div>
      </section>

      {/* Breadcrumb */}
      <nav className="bg-neutral-100 py-3 text-sm" aria-label="Breadcrumb">
        <div className="container-main">
          <ol className="flex items-center gap-2">
            <li><a href="/" className="text-interactive hover:text-primary">Home</a></li>
            <li className="text-neutral-400">/</li>
            <li className="text-neutral-600">Rankings</li>
          </ol>
        </div>
      </nav>

      {/* Top Performers */}
      <section className="section bg-white">
        <div className="container-main">
          <h2 className="section-title">Top Performers</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {topPerformers.map((performer, index) => (
              <div
                key={performer.name}
                className={clsx(
                  'card text-center relative overflow-hidden',
                  index === 0 && 'ring-2 ring-accent'
                )}
              >
                {index === 0 && (
                  <div className="absolute top-0 right-0 bg-accent text-white text-xs font-bold px-3 py-1">
                    #1 RANKED
                  </div>
                )}
                <div className="w-20 h-20 bg-neutral-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Trophy
                    className={clsx(
                      'w-10 h-10',
                      index === 0 && 'text-accent',
                      index === 1 && 'text-neutral-400',
                      index === 2 && 'text-amber-600'
                    )}
                  />
                </div>
                <h3 className="font-heading font-semibold text-lg text-primary">{performer.name}</h3>
                <p className="text-sm text-neutral-600 mb-2">{performer.event}</p>
                <span className="badge-success">{performer.achievement}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-6 bg-neutral-50 border-y border-neutral-200">
        <div className="container-main">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex flex-wrap gap-2">
              {events.map((event) => (
                <button
                  key={event.code}
                  className="px-4 py-2 text-sm font-medium bg-white border border-neutral-200 rounded-card hover:border-primary hover:text-primary transition-colors"
                >
                  {event.code}
                </button>
              ))}
            </div>
            <div className="flex gap-3">
              <button className="btn-outline text-sm py-2 gap-2">
                <Filter className="w-4 h-4" />
                More Filters
              </button>
              <button className="btn-outline text-sm py-2 gap-2">
                <Download className="w-4 h-4" />
                Export
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Rankings Table */}
      <section className="section bg-white">
        <div className="container-main">
          <div className="flex justify-between items-center mb-6">
            <h2 className="section-title">Overall Rankings</h2>
            <p className="text-sm text-neutral-500">Last updated: December 20, 2025</p>
          </div>

          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th className="w-20">Rank</th>
                  <th>Athlete</th>
                  <th>State</th>
                  <th className="text-center">Event</th>
                  <th className="text-right">Score</th>
                  <th className="text-center">Trend</th>
                  <th className="text-right">Personal Best</th>
                  <th className="text-center">Medals</th>
                </tr>
              </thead>
              <tbody>
                {rankings.map((shooter) => (
                  <tr key={shooter.name} className="group">
                    <td>
                      <div
                        className={clsx(
                          'w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm',
                          shooter.rank <= 3 ? 'bg-accent text-white' : 'bg-neutral-100 text-neutral-600'
                        )}
                      >
                        {shooter.rank}
                      </div>
                    </td>
                    <td>
                      <a
                        href={`/shooters/${shooter.name.toLowerCase().replace(' ', '-')}`}
                        className="font-semibold text-primary hover:text-interactive transition-colors"
                      >
                        {shooter.name}
                      </a>
                    </td>
                    <td className="text-neutral-600">{shooter.state}</td>
                    <td className="text-center">
                      <span className="badge bg-neutral-100 text-neutral-700">{shooter.event}</span>
                    </td>
                    <td className="text-right">
                      <span className="font-data font-semibold text-neutral-700">
                        {shooter.score.toFixed(1)}
                      </span>
                    </td>
                    <td className="text-center">
                      {shooter.change === 'up' && (
                        <span className="inline-flex items-center text-success">
                          <TrendingUp className="w-4 h-4" />
                        </span>
                      )}
                      {shooter.change === 'down' && (
                        <span className="inline-flex items-center text-error">
                          <TrendingDown className="w-4 h-4" />
                        </span>
                      )}
                      {shooter.change === 'same' && (
                        <span className="inline-flex items-center text-neutral-400">
                          <Minus className="w-4 h-4" />
                        </span>
                      )}
                    </td>
                    <td className="text-right">
                      <span className="font-data text-neutral-500">{shooter.best.toFixed(1)}</span>
                    </td>
                    <td className="text-center">
                      {shooter.medals > 0 ? (
                        <span className="inline-flex items-center gap-1 text-accent">
                          <Medal className="w-4 h-4" />
                          <span className="font-semibold">{shooter.medals}</span>
                        </span>
                      ) : (
                        <span className="text-neutral-300">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-center items-center gap-2 mt-8">
            <button className="btn-ghost text-sm py-2" disabled>
              Previous
            </button>
            {[1, 2, 3, '...', 10].map((page, i) => (
              <button
                key={i}
                className={clsx(
                  'w-10 h-10 rounded-card text-sm font-medium transition-colors',
                  page === 1
                    ? 'bg-primary text-white'
                    : 'hover:bg-neutral-100 text-neutral-600'
                )}
              >
                {page}
              </button>
            ))}
            <button className="btn-ghost text-sm py-2">Next</button>
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section className="section bg-neutral-50">
        <div className="container-main">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="card">
              <h3 className="font-heading font-semibold text-lg text-primary mb-3">
                Ranking System
              </h3>
              <p className="text-sm text-neutral-600">
                Rankings are calculated based on the best 4 scores from national and international 
                competitions over the past 12 months. Scores are weighted by competition level.
              </p>
            </div>
            <div className="card">
              <h3 className="font-heading font-semibold text-lg text-primary mb-3">
                Classification
              </h3>
              <p className="text-sm text-neutral-600">
                Athletes compete in events based on their WSPS classification (SH1 or SH2) which 
                determines shooting position and equipment allowed.
              </p>
            </div>
            <div className="card">
              <h3 className="font-heading font-semibold text-lg text-primary mb-3">
                Selection Criteria
              </h3>
              <p className="text-sm text-neutral-600">
                Top-ranked athletes with Minimum Qualification Scores (MQS) are eligible for 
                selection to international events including Paralympics and World Championships.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default RankingsPage

