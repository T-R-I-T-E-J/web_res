import Link from 'next/link'
import { DashboardHeader } from '@/components/dashboard'
import { Calendar, MapPin, Clock, CheckCircle, AlertCircle, FileText, CreditCard } from 'lucide-react'
import clsx from 'clsx'

const myEntries = [
  {
    id: 1,
    name: '68th NSCC (Rifle)',
    date: 'December 15-22, 2025',
    location: 'Dr. Karni Singh Shooting Range, New Delhi',
    events: ['10m Air Rifle SH1', '50m Rifle 3 Positions SH1'],
    status: 'confirmed',
    paymentStatus: 'paid',
    entryFee: 2500,
    admitCard: true,
  },
  {
    id: 2,
    name: 'Selection Trials - Asian Para Games',
    date: 'February 5-10, 2026',
    location: 'Dr. Karni Singh Shooting Range, New Delhi',
    events: ['10m Air Rifle SH1'],
    status: 'pending',
    paymentStatus: 'pending',
    entryFee: 1500,
    admitCard: false,
  },
]

const upcomingCompetitions = [
  {
    id: 3,
    name: '68th NSCC (Pistol)',
    date: 'January 8-15, 2026',
    location: 'M.P. Shooting Academy, Bhopal',
    registrationDeadline: 'December 30, 2025',
    eligible: false,
    reason: 'Classification not eligible for pistol events',
  },
  {
    id: 4,
    name: 'WSPS World Cup',
    date: 'March 15-22, 2026',
    location: 'Changwon, South Korea',
    registrationDeadline: 'January 31, 2026',
    eligible: true,
    mqsRequired: true,
    mqsMet: true,
  },
]

const ShooterEventsPage = () => {
  return (
    <>
      <DashboardHeader
        title="My Competitions"
        subtitle="Manage your event registrations and entries"
      />

      <div className="p-6 space-y-6">
        {/* My Entries */}
        <div className="card">
          <h2 className="font-heading font-semibold text-lg text-primary mb-4">My Entries</h2>
          <div className="space-y-4">
            {myEntries.map((entry) => (
              <div key={entry.id} className="border border-neutral-200 rounded-card p-4">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-neutral-700">{entry.name}</h3>
                      <span className={clsx(
                        'badge',
                        entry.status === 'confirmed' && 'badge-success',
                        entry.status === 'pending' && 'badge-warning'
                      )}>
                        {entry.status === 'confirmed' ? 'Confirmed' : 'Pending'}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-neutral-600">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-neutral-400" />
                        {entry.date}
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-neutral-400" />
                        {entry.location}
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {entry.events.map((event) => (
                        <span key={event} className="text-xs bg-neutral-100 text-neutral-600 px-2 py-1 rounded">
                          {event}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2">
                    {entry.paymentStatus === 'pending' ? (
                      <button className="btn-accent text-sm py-2">
                        <CreditCard className="w-4 h-4 mr-2" />
                        Pay ₹{entry.entryFee}
                      </button>
                    ) : entry.admitCard ? (
                      <button className="btn-primary text-sm py-2">
                        <FileText className="w-4 h-4 mr-2" />
                        Download Admit Card
                      </button>
                    ) : (
                      <span className="text-sm text-neutral-500 flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        Admit card pending
                      </span>
                    )}
                    <Link href={`/shooter/events/${entry.id}`} className="btn-outline text-sm py-2">
                      View Details
                    </Link>
                  </div>
                </div>

                {/* Status Steps */}
                <div className="mt-4 pt-4 border-t border-neutral-100">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 text-xs">
                      <CheckCircle className="w-4 h-4 text-success" />
                      <span className="text-success">Registered</span>
                    </div>
                    <div className="flex-1 h-0.5 bg-neutral-200">
                      <div className={clsx(
                        'h-full bg-success transition-all',
                        entry.paymentStatus === 'paid' ? 'w-full' : 'w-0'
                      )} />
                    </div>
                    <div className="flex items-center gap-1 text-xs">
                      {entry.paymentStatus === 'paid' ? (
                        <CheckCircle className="w-4 h-4 text-success" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border-2 border-neutral-300" />
                      )}
                      <span className={entry.paymentStatus === 'paid' ? 'text-success' : 'text-neutral-400'}>
                        Payment
                      </span>
                    </div>
                    <div className="flex-1 h-0.5 bg-neutral-200">
                      <div className={clsx(
                        'h-full bg-success transition-all',
                        entry.admitCard ? 'w-full' : 'w-0'
                      )} />
                    </div>
                    <div className="flex items-center gap-1 text-xs">
                      {entry.admitCard ? (
                        <CheckCircle className="w-4 h-4 text-success" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border-2 border-neutral-300" />
                      )}
                      <span className={entry.admitCard ? 'text-success' : 'text-neutral-400'}>
                        Admit Card
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Available Competitions */}
        <div className="card">
          <h2 className="font-heading font-semibold text-lg text-primary mb-4">Upcoming Competitions</h2>
          <div className="space-y-4">
            {upcomingCompetitions.map((comp) => (
              <div
                key={comp.id}
                className={clsx(
                  'border rounded-card p-4',
                  comp.eligible ? 'border-neutral-200' : 'border-neutral-200 bg-neutral-50'
                )}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-neutral-700">{comp.name}</h3>
                      {!comp.eligible && (
                        <span className="badge bg-neutral-200 text-neutral-600">Not Eligible</span>
                      )}
                      {comp.eligible && comp.mqsRequired && (
                        <span className={clsx('badge', comp.mqsMet ? 'badge-success' : 'badge-warning')}>
                          {comp.mqsMet ? 'MQS Met' : 'MQS Required'}
                        </span>
                      )}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-neutral-600">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-neutral-400" />
                        {comp.date}
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-neutral-400" />
                        {comp.location}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-2 text-sm">
                      <Clock className="w-4 h-4 text-accent" />
                      <span className="text-accent font-medium">
                        Registration deadline: {comp.registrationDeadline}
                      </span>
                    </div>
                    {!comp.eligible && comp.reason && (
                      <div className="flex items-center gap-2 mt-2 text-sm text-neutral-500">
                        <AlertCircle className="w-4 h-4" />
                        {comp.reason}
                      </div>
                    )}
                  </div>

                  <div>
                    {comp.eligible ? (
                      <button className="btn-primary text-sm">
                        Register Now
                      </button>
                    ) : (
                      <button className="btn-ghost text-sm" disabled>
                        Not Available
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Calendar Link */}
        <div className="card bg-primary/5 border-primary/20">
          <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
              <Calendar className="w-8 h-8 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-heading font-semibold text-lg text-primary mb-2">
                View Full Event Calendar
              </h3>
              <p className="text-neutral-600">
                Browse all upcoming national and international competitions, including selection trials and training camps.
              </p>
            </div>
            <Link href="/events" className="btn-primary whitespace-nowrap">
              View Calendar
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}

export default ShooterEventsPage

