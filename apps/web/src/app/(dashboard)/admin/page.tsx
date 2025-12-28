import Link from 'next/link'
import { DashboardHeader } from '@/components/dashboard'
import {
  Users, Trophy, Calendar, CreditCard, TrendingUp, TrendingDown,
  AlertCircle, Clock, CheckCircle, ArrowRight, Activity
} from 'lucide-react'
import clsx from 'clsx'

const stats = [
  { label: 'Total Shooters', value: '1,245', change: '+12%', trend: 'up', icon: Users },
  { label: 'Active Events', value: '8', change: '+2', trend: 'up', icon: Calendar },
  { label: 'Pending Approvals', value: '23', change: '-5', trend: 'down', icon: Clock },
  { label: 'Revenue (MTD)', value: '₹4.2L', change: '+18%', trend: 'up', icon: CreditCard },
]

const pendingApprovals = [
  { id: 1, name: 'Rahul Sharma', type: 'New Shooter', state: 'Maharashtra', submitted: '2 hours ago' },
  { id: 2, name: 'Priya Singh', type: 'Document Update', state: 'Delhi', submitted: '4 hours ago' },
  { id: 3, name: 'Vikram Patel', type: 'Classification', state: 'Gujarat', submitted: '1 day ago' },
  { id: 4, name: 'Anjali Verma', type: 'New Shooter', state: 'Uttar Pradesh', submitted: '1 day ago' },
  { id: 5, name: 'Deepak Kumar', type: 'Equipment', state: 'Haryana', submitted: '2 days ago' },
]

const recentActivities = [
  { action: 'Shooter approved', target: 'Manish Narwal', time: '10 minutes ago', type: 'success' },
  { action: 'Score published', target: 'NSCC 2024 Finals', time: '1 hour ago', type: 'info' },
  { action: 'Payment received', target: '₹2,500 from Avani L.', time: '2 hours ago', type: 'success' },
  { action: 'Document rejected', target: 'License - Ravi K.', time: '3 hours ago', type: 'error' },
  { action: 'Event created', target: 'Selection Trials 2026', time: '5 hours ago', type: 'info' },
]

const upcomingEvents = [
  { name: '68th NSCC Rifle', date: 'Dec 15-22', registrations: 245, capacity: 300 },
  { name: '68th NSCC Pistol', date: 'Jan 8-15', registrations: 180, capacity: 250 },
  { name: 'Selection Trials', date: 'Feb 5-10', registrations: 45, capacity: 100 },
]

const AdminDashboardPage = () => {
  return (
    <>
      <DashboardHeader
        title="Admin Dashboard"
        subtitle="Overview of platform activity and pending tasks"
      />

      <div className="p-6 space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <div key={stat.label} className="card">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-neutral-500">{stat.label}</p>
                  <p className="font-heading text-2xl font-bold text-neutral-700 mt-1">
                    {stat.value}
                  </p>
                  <div className={clsx(
                    'flex items-center gap-1 text-xs mt-2',
                    stat.trend === 'up' ? 'text-success' : 'text-error'
                  )}>
                    {stat.trend === 'up' ? (
                      <TrendingUp className="w-3 h-3" />
                    ) : (
                      <TrendingDown className="w-3 h-3" />
                    )}
                    {stat.change} from last month
                  </div>
                </div>
                <div className="p-2 bg-primary/10 rounded-card">
                  <stat.icon className="w-6 h-6 text-primary" />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Pending Approvals */}
          <div className="lg:col-span-2 card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-heading font-semibold text-lg text-primary flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-accent" />
                Pending Approvals
                <span className="bg-accent text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  {pendingApprovals.length}
                </span>
              </h2>
              <Link href="/admin/users?status=pending" className="text-sm text-interactive hover:text-primary">
                View All →
              </Link>
            </div>
            <div className="space-y-3">
              {pendingApprovals.map((approval) => (
                <div
                  key={approval.id}
                  className="flex items-center justify-between p-3 bg-neutral-50 rounded-card hover:bg-neutral-100 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-neutral-200 rounded-full flex items-center justify-center">
                      <Users className="w-5 h-5 text-neutral-400" />
                    </div>
                    <div>
                      <p className="font-medium text-neutral-700">{approval.name}</p>
                      <p className="text-xs text-neutral-500">
                        {approval.type} • {approval.state}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-neutral-400">{approval.submitted}</span>
                    <Link
                      href={`/admin/users/${approval.id}`}
                      className="btn-primary text-xs py-1.5 px-3"
                    >
                      Review
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="card">
            <h2 className="font-heading font-semibold text-lg text-primary mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Recent Activity
            </h2>
            <div className="space-y-4">
              {recentActivities.map((activity, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className={clsx(
                    'w-2 h-2 rounded-full mt-2',
                    activity.type === 'success' && 'bg-success',
                    activity.type === 'error' && 'bg-error',
                    activity.type === 'info' && 'bg-interactive'
                  )} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-neutral-700">
                      <span className="font-medium">{activity.action}</span>
                      <span className="text-neutral-500"> - {activity.target}</span>
                    </p>
                    <p className="text-xs text-neutral-400">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Event Registration Status */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading font-semibold text-lg text-primary">
              Event Registration Status
            </h2>
            <Link href="/admin/competitions" className="text-sm text-interactive hover:text-primary">
              Manage Events →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {upcomingEvents.map((event) => {
              const percentage = Math.round((event.registrations / event.capacity) * 100)
              return (
                <div key={event.name} className="p-4 bg-neutral-50 rounded-card">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-neutral-700">{event.name}</h3>
                      <p className="text-sm text-neutral-500">{event.date}</p>
                    </div>
                    <span className="text-sm font-medium text-neutral-600">
                      {event.registrations}/{event.capacity}
                    </span>
                  </div>
                  <div className="h-2 bg-neutral-200 rounded-full overflow-hidden">
                    <div
                      className={clsx(
                        'h-full rounded-full transition-all',
                        percentage >= 90 ? 'bg-error' : percentage >= 70 ? 'bg-data-medium' : 'bg-success'
                      )}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <p className="text-xs text-neutral-500 mt-2">{percentage}% capacity filled</p>
                </div>
              )
            })}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Add New Shooter', href: '/admin/users/new', icon: Users },
            { label: 'Create Event', href: '/admin/competitions/new', icon: Calendar },
            { label: 'Publish Scores', href: '/admin/scores', icon: Trophy },
            { label: 'Generate Report', href: '/admin/reports', icon: TrendingUp },
          ].map((action) => (
            <Link
              key={action.label}
              href={action.href}
              className="card-hover text-center p-6 group"
            >
              <action.icon className="w-8 h-8 text-primary mx-auto mb-3 group-hover:scale-110 transition-transform" />
              <span className="font-medium text-neutral-700 group-hover:text-primary transition-colors">
                {action.label}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </>
  )
}

export default AdminDashboardPage

