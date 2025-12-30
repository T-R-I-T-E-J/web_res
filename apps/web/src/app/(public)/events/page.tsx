'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Calendar, MapPin, Loader2, AlertCircle, ExternalLink } from 'lucide-react'
import { EventCard } from '@/components/ui'

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

      {/* Upcoming Events */}
      <section className="section bg-neutral-50">
        <div className="container-main">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <h2 className="section-title">Upcoming Competitions</h2>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-48 bg-neutral-100 rounded-xl animate-pulse"></div>
              ))}
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingEvents.map((event) => {
                 const startDate = new Date(event.start_date);
                 return (
                    <EventCard 
                      key={event.id} 
                      title={String(event.title)}
                      date={formatDateRange(event.start_date, event.end_date)}
                      location={String(event.location)}
                      status={event.status}
                      href={`/events/${event.slug || event.id}`}
                      day={startDate.getDate().toString()}
                      month={startDate.toLocaleString('default', { month: 'short' }).toUpperCase()}
                    />
                 )
              })}
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
                    {String(event.title)}
                  </h3>
                  <p className="text-sm text-neutral-600 mb-3">
                    <MapPin className="w-4 h-4 inline mr-1" />
                    {String(event.location)}
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
