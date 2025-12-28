import Link from 'next/link'
import { DashboardHeader } from '@/components/dashboard'
import {
  Trophy, Calendar, TrendingUp, Target, Medal, ArrowRight,
  Clock, CheckCircle, AlertCircle, FileText
} from 'lucide-react'
import clsx from 'clsx'

// Mock data
const stats = [
  { label: 'National Rank', value: '#2', icon: Trophy, color: 'text-accent' },
  { label: 'Best Score', value: '634.5', icon: Target, color: 'text-success' },
  { label: 'Matches', value: '24', icon: Calendar, color: 'text-interactive' },
  { label: 'Medals', value: '7', icon: Medal, color: 'text-primary' },
]

const recentScores = [
  { event: '10m Air Rifle SH1', competition: 'NSCC 2024', date: 'Dec 15, 2024', score: 634.5, rank: 1 },
  { event: '10m Air Rifle SH1', competition: 'State Championship', date: 'Nov 20, 2024', score: 628.3, rank: 2 },
  { event: '50m Rifle 3P', competition: 'Selection Trial', date: 'Oct 5, 2024', score: 445.2, rank: 1 },
]

const upcomingEvents = [
  { name: '68th NSCC Rifle', date: 'Dec 15-22, 2025', location: 'New Delhi', status: 'registered' },
  { name: 'Selection Trials 2026', date: 'Feb 5-10, 2026', location: 'New Delhi', status: 'eligible' },
]

const tasks = [
  { label: 'Complete Profile', href: '/shooter/profile', status: 'completed' },
  { label: 'Upload Medical Certificate', href: '/shooter/documents', status: 'pending' },
  { label: 'Gun License Verification', href: '/shooter/documents', status: 'in_review' },
  { label: 'Register for NSCC 2025', href: '/shooter/events', status: 'completed' },
]

const ShooterDashboardPage = () => {
  const profileCompletion = 85

  return (
    <>
      <DashboardHeader
        title="Welcome back, Avani!"
        subtitle="Here's an overview of your shooting journey"
      />

      <div className="p-6 space-y-6">
        {/* Alert Banner */}
        <div className="bg-accent/10 border border-accent/30 rounded-card p-4 flex items-start gap-4">
          <AlertCircle className="w-6 h-6 text-accent flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-semibold text-neutral-700">Complete your profile</p>
            <p className="text-sm text-neutral-600">
              Upload your medical certificate to participate in upcoming competitions.
            </p>
          </div>
          <Link href="/shooter/documents" className="btn-accent text-sm py-2">
            Upload Now
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <div key={stat.label} className="card">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-neutral-500">{stat.label}</p>
                  <p className={clsx('font-heading text-3xl font-bold mt-1', stat.color)}>
                    {stat.value}
                  </p>
                </div>
                <div className={clsx('p-2 rounded-card bg-neutral-100', stat.color)}>
                  <stat.icon className="w-6 h-6" />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Scores */}
          <div className="lg:col-span-2 card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-heading font-semibold text-lg text-primary">Recent Scores</h2>
              <Link href="/shooter/scores" className="text-sm text-interactive hover:text-primary">
                View All →
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Event</th>
                    <th>Competition</th>
                    <th className="text-right">Score</th>
                    <th className="text-center">Rank</th>
                  </tr>
                </thead>
                <tbody>
                  {recentScores.map((score, i) => (
                    <tr key={i}>
                      <td className="font-medium">{score.event}</td>
                      <td className="text-neutral-600">
                        <div>{score.competition}</div>
                        <div className="text-xs text-neutral-400">{score.date}</div>
                      </td>
                      <td className="text-right">
                        <span className="font-data font-semibold text-neutral-700">
                          {score.score.toFixed(1)}
                        </span>
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
          </div>

          {/* Profile Completion */}
          <div className="card">
            <h2 className="font-heading font-semibold text-lg text-primary mb-4">Profile Status</h2>
            
            {/* Progress Ring */}
            <div className="flex justify-center mb-6">
              <div className="relative w-32 h-32">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    className="fill-none stroke-neutral-100"
                    strokeWidth="12"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    className="fill-none stroke-success"
                    strokeWidth="12"
                    strokeLinecap="round"
                    strokeDasharray={`${(profileCompletion / 100) * 352} 352`}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="font-heading text-2xl font-bold text-neutral-700">
                    {profileCompletion}%
                  </span>
                </div>
              </div>
            </div>

            {/* Tasks */}
            <div className="space-y-3">
              {tasks.map((task) => (
                <Link
                  key={task.label}
                  href={task.href}
                  className="flex items-center gap-3 p-3 rounded-card hover:bg-neutral-50 transition-colors"
                >
                  {task.status === 'completed' ? (
                    <CheckCircle className="w-5 h-5 text-success" />
                  ) : task.status === 'in_review' ? (
                    <Clock className="w-5 h-5 text-data-medium" />
                  ) : (
                    <div className="w-5 h-5 rounded-full border-2 border-neutral-300" />
                  )}
                  <span className={clsx(
                    'flex-1 text-sm',
                    task.status === 'completed' && 'text-neutral-400 line-through'
                  )}>
                    {task.label}
                  </span>
                  <ArrowRight className="w-4 h-4 text-neutral-400" />
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading font-semibold text-lg text-primary">Upcoming Competitions</h2>
            <Link href="/shooter/events" className="text-sm text-interactive hover:text-primary">
              View Calendar →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {upcomingEvents.map((event, i) => (
              <div key={i} className="p-4 bg-neutral-50 rounded-card">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-neutral-700">{event.name}</h3>
                  <span className={clsx(
                    'badge',
                    event.status === 'registered' && 'badge-success',
                    event.status === 'eligible' && 'badge-info'
                  )}>
                    {event.status === 'registered' ? 'Registered' : 'Eligible'}
                  </span>
                </div>
                <div className="text-sm text-neutral-600 space-y-1">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-neutral-400" />
                    {event.date}
                  </div>
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-neutral-400" />
                    {event.location}
                  </div>
                </div>
                {event.status === 'eligible' && (
                  <button className="btn-primary w-full mt-3 text-sm py-2">
                    Register Now
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Performance Chart Placeholder */}
        <div className="card">
          <h2 className="font-heading font-semibold text-lg text-primary mb-4">Performance Trend</h2>
          <div className="h-64 bg-neutral-50 rounded-card flex items-center justify-center">
            <div className="text-center text-neutral-400">
              <TrendingUp className="w-12 h-12 mx-auto mb-2" />
              <p>Performance chart will be displayed here</p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ShooterDashboardPage

