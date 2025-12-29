'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Calendar, MapPin, Loader2, AlertCircle, ExternalLink } from 'lucide-react'

interface Event {
  id: number
  title: string
  slug: string
  description?: string
  location: string
  start_date: string
  end_date: string
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled'
  registration_link?: string
  circular_link?: string
  is_featured: boolean
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

const EventsPage = () => {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    try {
      setLoading(true)
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/events`)
      
      if (res.ok) {
        const json = await res.json()
        setEvents(json.data || json)
      } else {
        setError('Failed to load events')
      }
    } catch (err) {
      console.error('Failed to fetch events:', err)
      setError('An error occurred while loading events')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  const formatDateRange = (start: string, end: string) => {
    const startDate = new Date(start)
    const endDate = new Date(end)
    
    if (startDate.toDateString() === endDate.toDateString()) {
      return formatDate(start)
    }
    
    return `${formatDate(start)} - ${formatDate(end)}`
  }

  const getStatusBadge = (status: string) => {
    const badges = {
      upcoming: 'badge-info',
      ongoing: 'badge-success',
      completed: 'badge-neutral',
      cancelled: 'badge-error'
    }
    return badges[status as keyof typeof badges] || 'badge-neutral'
  }

  // Separate events by status
  const upcomingEvents = events.filter(e => e.status === 'upcoming' || e.status === 'ongoing' || e.status === 'cancelled')
  const pastEvents = events.filter(e => e.status === 'completed')

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
            <li><Link href="/" className="text-interactive hover:text-primary">Home</Link></li>
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
          </div>

          {loading ? (
            <div className="text-center py-12">
              <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
              <p className="text-neutral-600">Loading events...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <AlertCircle className="w-12 h-12 text-error mx-auto mb-4" />
              <p className="text-neutral-600 mb-4">{error}</p>
              <button onClick={fetchEvents} className="btn-primary">
                Try Again
              </button>
            </div>
          ) : upcomingEvents.length === 0 ? (
            <div className="card text-center py-12">
              <Calendar className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
              <p className="text-neutral-600 mb-2">No upcoming events at the moment</p>
              <p className="text-sm text-neutral-500">Check back soon for new competitions and championships</p>
            </div>
          ) : (
            <div className="space-y-6">
              {upcomingEvents.map((event) => (
                <div key={event.id} className="card-hover">
                  <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className={getStatusBadge(event.status)}>
                          {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                        </span>
                        {event.is_featured && (
                          <span className="badge-accent">Featured</span>
                        )}
                      </div>
                      <h3 className="font-heading text-xl font-semibold text-primary mb-3">
                        {event.title}
                      </h3>
                      {event.description && (
                        <p className="text-sm text-neutral-600 mb-3 line-clamp-2">
                          {event.description}
                        </p>
                      )}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-neutral-600">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-neutral-400" />
                          {formatDateRange(event.start_date, event.end_date)}
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-neutral-400" />
                          {event.location}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3 lg:flex-col">
                      <Link
                        href={`/events/${event.slug}`}
                        className="btn-primary text-sm py-2"
                      >
                        View Details
                      </Link>
                      {event.registration_link && (
                        <a
                          href={event.registration_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-accent text-sm py-2 flex items-center justify-center gap-2"
                        >
                          <ExternalLink className="w-4 h-4" />
                          Register Now
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Past Events / Results */}
      {!loading && pastEvents.length > 0 && (
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
              {pastEvents.slice(0, 4).map((event) => (
                <div key={event.id} className="card">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="badge-success">Completed</span>
                    <span className="text-xs text-neutral-400">
                      {formatDate(event.end_date)}
                    </span>
                  </div>
                  <h3 className="font-heading font-semibold text-lg text-primary mb-2">
                    {event.title}
                  </h3>
                  <p className="text-sm text-neutral-600 mb-3">
                    <MapPin className="w-4 h-4 inline mr-1" />
                    {event.location}
                  </p>
                  <Link
                    href={`/events/${event.slug}`}
                    className="inline-block mt-4 text-sm font-semibold text-interactive hover:text-primary transition-colors"
                  >
                    View Event Details →
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  )
}

export default EventsPage
