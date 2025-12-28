import { DashboardHeader } from '@/components/dashboard'
import { Trophy, TrendingUp, Target, Filter, Download, ChevronUp, ChevronDown } from 'lucide-react'
import clsx from 'clsx'

const scores = [
  { id: 1, event: '10m Air Rifle SH1', competition: 'NSCC 2024', date: 'Dec 15, 2024', qualification: 621.4, final: 249.7, total: 634.5, rank: 1, pb: true },
  { id: 2, event: '10m Air Rifle SH1', competition: 'State Championship', date: 'Nov 20, 2024', qualification: 618.2, final: 245.3, total: 628.3, rank: 2, pb: false },
  { id: 3, event: '50m Rifle 3 Positions', competition: 'Selection Trial', date: 'Oct 5, 2024', qualification: 1156.0, final: 445.2, total: 1156.0, rank: 1, pb: true },
  { id: 4, event: '10m Air Rifle SH1', competition: 'Asian Championship', date: 'Sep 10, 2024', qualification: 625.8, final: 251.3, total: 634.2, rank: 1, pb: false },
  { id: 5, event: '10m Air Rifle SH1', competition: 'Paris Paralympics', date: 'Aug 30, 2024', qualification: 625.5, final: 249.7, total: 634.5, rank: 1, pb: true },
]

const personalBests = [
  { event: '10m Air Rifle SH1', score: 634.5, competition: 'NSCC 2024', date: 'Dec 2024' },
  { event: '50m Rifle 3 Positions', score: 1176.5, competition: 'World Cup', date: 'Jun 2024' },
  { event: '50m Rifle Prone', score: 458.8, competition: 'Asian Games', date: 'Oct 2023' },
]

const statistics = [
  { label: 'Total Matches', value: '24' },
  { label: 'Average Score', value: '626.3' },
  { label: 'Highest Score', value: '634.5' },
  { label: 'Win Rate', value: '67%' },
]

const ShooterScoresPage = () => {
  return (
    <>
      <DashboardHeader
        title="My Scores"
        subtitle="Track your performance and competition history"
      />

      <div className="p-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {statistics.map((stat) => (
            <div key={stat.label} className="card text-center">
              <p className="text-sm text-neutral-500">{stat.label}</p>
              <p className="font-heading text-2xl font-bold text-primary mt-1">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Personal Bests */}
        <div className="card">
          <h2 className="font-heading font-semibold text-lg text-primary mb-4 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-accent" />
            Personal Bests
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {personalBests.map((pb) => (
              <div key={pb.event} className="p-4 bg-accent/5 border border-accent/20 rounded-card">
                <p className="text-sm text-neutral-600">{pb.event}</p>
                <p className="font-heading text-2xl font-bold text-accent mt-1">{pb.score}</p>
                <p className="text-xs text-neutral-500 mt-2">
                  {pb.competition} • {pb.date}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Performance Chart */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading font-semibold text-lg text-primary flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Performance Trend
            </h2>
            <select className="input w-auto text-sm py-2">
              <option value="6months">Last 6 Months</option>
              <option value="1year">Last Year</option>
              <option value="all">All Time</option>
            </select>
          </div>
          <div className="h-64 bg-neutral-50 rounded-card flex items-center justify-center">
            <div className="text-center text-neutral-400">
              <TrendingUp className="w-12 h-12 mx-auto mb-2" />
              <p>Performance chart will be displayed here</p>
            </div>
          </div>
        </div>

        {/* Scores Table */}
        <div className="card">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
            <h2 className="font-heading font-semibold text-lg text-primary">Competition History</h2>
            <div className="flex gap-2">
              <button className="btn-outline text-sm py-2 gap-2">
                <Filter className="w-4 h-4" />
                Filter
              </button>
              <button className="btn-outline text-sm py-2 gap-2">
                <Download className="w-4 h-4" />
                Export
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Event</th>
                  <th>Competition</th>
                  <th>Date</th>
                  <th className="text-right">Qualification</th>
                  <th className="text-right">Final</th>
                  <th className="text-right">Total</th>
                  <th className="text-center">Rank</th>
                </tr>
              </thead>
              <tbody>
                {scores.map((score) => (
                  <tr key={score.id}>
                    <td className="font-medium">{score.event}</td>
                    <td className="text-neutral-600">{score.competition}</td>
                    <td className="text-neutral-500 text-sm">{score.date}</td>
                    <td className="text-right font-data">{score.qualification.toFixed(1)}</td>
                    <td className="text-right font-data">{score.final.toFixed(1)}</td>
                    <td className="text-right">
                      <span className="font-data font-semibold text-neutral-700">
                        {score.total.toFixed(1)}
                      </span>
                      {score.pb && (
                        <span className="ml-1 text-xs text-accent font-bold">PB</span>
                      )}
                    </td>
                    <td className="text-center">
                      <span className={clsx(
                        'inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold',
                        score.rank === 1 && 'bg-accent text-white',
                        score.rank === 2 && 'bg-neutral-300 text-neutral-700',
                        score.rank === 3 && 'bg-amber-600 text-white',
                        score.rank > 3 && 'bg-neutral-100 text-neutral-600'
                      )}>
                        {score.rank}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-center items-center gap-2 mt-6 pt-4 border-t border-neutral-100">
            <button className="btn-ghost text-sm py-2" disabled>Previous</button>
            <span className="text-sm text-neutral-600">Page 1 of 3</span>
            <button className="btn-ghost text-sm py-2">Next</button>
          </div>
        </div>
      </div>
    </>
  )
}

export default ShooterScoresPage

