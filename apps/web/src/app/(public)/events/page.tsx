import type { Metadata } from 'next'
import Link from 'next/link'
import { Calendar, MapPin, Clock, Filter, ChevronRight } from 'lucide-react'
import { EventCard } from '@/components/ui'

export const metadata: Metadata = {
  title: 'Championships & Events',
  description: 'View upcoming and past para shooting championships, competitions, and events in India.',
}

const shootingEvents = [
  { code: 'R1', name: '10m Air Rifle Standing - SH1', classification: 'SH1' },
  { code: 'R2', name: '10m Air Rifle Standing - SH2', classification: 'SH2' },
  { code: 'R3', name: '10m Air Rifle Prone - SH1', classification: 'SH1' },
  { code: 'R4', name: '10m Air Rifle Standing - SH2', classification: 'SH2' },
  { code: 'R5', name: '10m Air Rifle Prone Mixed - SH2', classification: 'SH2' },
  { code: 'R6', name: '50m Rifle Prone - SH1', classification: 'SH1' },
  { code: 'R7', name: '50m Rifle 3 Positions - SH1', classification: 'SH1' },
  { code: 'R8', name: '50m Rifle 3 Positions - SH2', classification: 'SH2' },
  { code: 'P1', name: '10m Air Pistol - SH1', classification: 'SH1' },
  { code: 'P2', name: '10m Air Pistol - SH1', classification: 'SH1' },
  { code: 'P3', name: '25m Pistol - SH1', classification: 'SH1' },
  { code: 'P4', name: '50m Pistol - SH1', classification: 'SH1' },
]

const upcomingEvents = [
  {
    id: 1,
    title: '68th National Shooting Championship (Rifle)',
    date: 'December 15-22, 2025',
    location: 'Dr. Karni Singh Shooting Range, New Delhi',
    status: 'upcoming' as const,
    registrationOpen: true,
    disciplines: ['10m Air Rifle', '50m Rifle'],
  },
  {
    id: 2,
    title: '68th National Shooting Championship (Pistol)',
    date: 'January 8-15, 2026',
    location: 'M.P. Shooting Academy, Bhopal',
    status: 'upcoming' as const,
    registrationOpen: true,
    disciplines: ['10m Air Pistol', '25m Pistol', '50m Pistol'],
  },
  {
    id: 3,
    title: 'Selection Trials - Asian Para Games 2026',
    date: 'February 5-10, 2026',
    location: 'Dr. Karni Singh Shooting Range, New Delhi',
    status: 'upcoming' as const,
    registrationOpen: false,
    disciplines: ['All Paralympic Events'],
  },
]

const pastEvents = [
  {
    id: 4,
    title: 'WSPS World Cup - Changwon',
    date: 'November 2025',
    location: 'Changwon, South Korea',
    status: 'completed' as const,
    results: 'India: 3 Gold, 2 Silver',
  },
  {
    id: 5,
    title: 'Asian Championship 2025',
    date: 'September 2025',
    location: 'Bangkok, Thailand',
    status: 'completed' as const,
    results: 'India: 5 Gold, 4 Silver, 3 Bronze',
  },
]

const EventsPage = () => {
  return (
    <>
      {/* Hero Banner */}
      <section className="gradient-hero py-16 md:py-20">
        <div className="container-main text-center">
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-white mb-4">
            Championships & Events
          </h1>
          <p className="text-white/90 max-w-2xl mx-auto">
            Explore upcoming competitions, view the event calendar, and access results from past championships
          </p>
        </div>
      </section>

      {/* Breadcrumb */}
      <nav className="bg-neutral-100 py-3 text-sm" aria-label="Breadcrumb">
        <div className="container-main">
          <ol className="flex items-center gap-2">
            <li><a href="/" className="text-interactive hover:text-primary">Home</a></li>
            <li className="text-neutral-400">/</li>
            <li className="text-neutral-600">Championships</li>
          </ol>
        </div>
      </nav>

      {/* Shooting Events Reference */}
      <section id="events" className="section bg-white">
        <div className="container-main">
          <h2 className="section-title">Paralympic Shooting Events</h2>
          <p className="text-neutral-600 mb-8 max-w-3xl">
            Para shooting competitions follow World Shooting Para Sport (WSPS) classifications. 
            Athletes compete based on their functional ability in SH1 (no arm impairment) and 
            SH2 (arm/hand impairment requiring shooting stand).
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {shootingEvents.map((event) => (
              <div key={event.code} className="card py-4 flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-card flex items-center justify-center flex-shrink-0">
                  <span className="font-data font-bold text-primary">{event.code}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-neutral-700 text-sm">{event.name}</div>
                  <div className="text-xs text-neutral-500">Classification: {event.classification}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="section bg-neutral-50">
        <div className="container-main">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <h2 className="section-title">Upcoming Competitions</h2>
            <button className="btn-outline text-sm py-2 gap-2">
              <Filter className="w-4 h-4" />
              Filter Events
            </button>
          </div>
          <div className="space-y-6">
            {upcomingEvents.map((event) => (
              <div key={event.id} className="card-hover">
                <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      {event.registrationOpen ? (
                        <span className="badge-success">Registration Open</span>
                      ) : (
                        <span className="badge-info">Coming Soon</span>
                      )}
                    </div>
                    <h3 className="font-heading text-xl font-semibold text-primary mb-3">
                      {event.title}
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-neutral-600">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-neutral-400" />
                        {event.date}
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-neutral-400" />
                        {event.location}
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {event.disciplines.map((d) => (
                        <span key={d} className="text-xs bg-neutral-100 px-2 py-1 rounded">
                          {d}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3 lg:flex-col">
                    <Link
                      href={`/events/${event.id}`}
                      className="btn-primary text-sm py-2"
                    >
                      View Details
                    </Link>
                    {event.registrationOpen && (
                      <Link
                        href={`/events/${event.id}/register`}
                        className="btn-accent text-sm py-2"
                      >
                        Register Now
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* International Events */}
      <section id="international" className="section bg-white">
        <div className="container-main">
          <h2 className="section-title">International Calendar 2025-26</h2>
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Event</th>
                  <th>Location</th>
                  <th>Type</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {[
                  { date: 'Mar 2026', event: 'WSPS World Cup', location: 'Changwon, KOR', type: 'World Cup' },
                  { date: 'May 2026', event: 'WSPS World Cup', location: 'Munich, GER', type: 'World Cup' },
                  { date: 'Jul 2026', event: 'World Championships', location: 'Lima, PER', type: 'Championship' },
                  { date: 'Oct 2026', event: 'Asian Para Games', location: 'Nagoya, JPN', type: 'Multi-Sport' },
                ].map((row, i) => (
                  <tr key={i}>
                    <td className="font-data">{row.date}</td>
                    <td className="font-medium">{row.event}</td>
                    <td>{row.location}</td>
                    <td><span className="badge-info">{row.type}</span></td>
                    <td>
                      <Link href="#" className="text-interactive hover:text-primary text-sm">
                        Details <ChevronRight className="w-3 h-3 inline" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* National Events */}
      <section id="national" className="section bg-neutral-50">
        <div className="container-main">
          <h2 className="section-title">National Championships 2025-26</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="card">
              <h3 className="font-heading font-semibold text-lg text-primary mb-4">Rifle Championships</h3>
              <ul className="space-y-3">
                {[
                  '68th NSCC Rifle - December 2025, New Delhi',
                  'All India Inter-University - January 2026',
                  'Junior National Championship - February 2026',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-neutral-600">
                    <ChevronRight className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="card">
              <h3 className="font-heading font-semibold text-lg text-primary mb-4">Pistol Championships</h3>
              <ul className="space-y-3">
                {[
                  '68th NSCC Pistol - January 2026, Bhopal',
                  'All India Inter-University - February 2026',
                  'Junior National Championship - March 2026',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-neutral-600">
                    <ChevronRight className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Past Events / Results */}
      <section className="section bg-white">
        <div className="container-main">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <h2 className="section-title">Recent Results</h2>
            <Link
              href="/results"
              className="text-sm font-semibold text-primary hover:text-accent transition-colors"
            >
              View All Results →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {pastEvents.map((event) => (
              <div key={event.id} className="card">
                <div className="flex items-center gap-2 mb-2">
                  <span className="badge-success">Completed</span>
                  <span className="text-xs text-neutral-400">{event.date}</span>
                </div>
                <h3 className="font-heading font-semibold text-lg text-primary mb-2">
                  {event.title}
                </h3>
                <p className="text-sm text-neutral-600 mb-3">
                  <MapPin className="w-4 h-4 inline mr-1" />
                  {event.location}
                </p>
                <div className="p-3 bg-success/5 rounded-card border border-success/20">
                  <span className="text-success font-semibold text-sm">{event.results}</span>
                </div>
                <Link
                  href={`/events/${event.id}/results`}
                  className="inline-block mt-4 text-sm font-semibold text-interactive hover:text-primary transition-colors"
                >
                  View Full Results →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

export default EventsPage

