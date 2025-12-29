'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Calendar, MapPin, ArrowLeft, ExternalLink, FileText, Loader2, AlertCircle } from 'lucide-react'

interface Event {
  id: number
  title: string
  description: string
  location: string
  start_date: string
  end_date: string
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled'
  registration_link?: string
  circular_link?: string
  is_featured: boolean
  created_at: string
  updated_at: string
}

export default function EventDetailPage() {
  const params = useParams()
  const slug = params.slug as string
  
  const [event, setEvent] = useState<Event | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchEvent()
  }, [slug])

  const fetchEvent = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/events/${slug}`)
      
      if (res.ok) {
        const json = await res.json()
        setEvent(json.data || json)
      } else if (res.status === 404) {
        setError('Event not found')
      } else {
        setError('Failed to load event')
      }
    } catch (err) {
      console.error('Failed to fetch event:', err)
      setError('An error occurred while loading the event')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusBadge = (status: string) => {
    const badges = {
      upcoming: 'badge-info',
      ongoing: 'badge-warning',
      completed: 'badge-success',
      cancelled: 'badge-error'
    }
    return badges[status as keyof typeof badges] || 'badge-neutral'
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-neutral-600">Loading event details...</p>
        </div>
      </div>
    )
  }

  if (error || !event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-error mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-neutral-800 mb-2">
            {error || 'Event Not Found'}
          </h1>
          <p className="text-neutral-600 mb-6">
            The event you're looking for doesn't exist or has been removed.
          </p>
          <Link href="/events" className="btn-primary">
            <ArrowLeft className="w-4 h-4" />
            Back to Events
          </Link>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Hero Section */}
      <section className="gradient-hero py-12 md:py-16">
        <div className="container-main">
          <Link
            href="/events"
            className="inline-flex items-center gap-2 text-white/90 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Events
          </Link>
          
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className={getStatusBadge(event.status)}>
              {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
            </span>
            {event.is_featured && (
              <span className="badge-accent">Featured</span>
            )}
          </div>

          <h1 className="font-heading text-3xl md:text-4xl font-bold text-white mb-4">
            {event.title}
          </h1>

          <div className="flex flex-wrap gap-6 text-white/90">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              <span>{formatDate(event.start_date)}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              <span>{event.location}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Breadcrumb */}
      <nav className="bg-neutral-100 py-3 text-sm" aria-label="Breadcrumb">
        <div className="container-main">
          <ol className="flex items-center gap-2">
            <li><Link href="/" className="text-interactive hover:text-primary">Home</Link></li>
            <li className="text-neutral-400">/</li>
            <li><Link href="/events" className="text-interactive hover:text-primary">Events</Link></li>
            <li className="text-neutral-400">/</li>
            <li className="text-neutral-600 truncate">{event.title}</li>
          </ol>
        </div>
      </nav>

      {/* Main Content */}
      <section className="section bg-white">
        <div className="container-main">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              <div className="card">
                <h2 className="section-title text-xl mb-4">About This Event</h2>
                {event.description ? (
                  <div className="prose prose-neutral max-w-none">
                    <p className="text-neutral-700 whitespace-pre-wrap">{event.description}</p>
                  </div>
                ) : (
                  <p className="text-neutral-500 italic">No description available</p>
                )}
              </div>

              <div className="card">
                <h2 className="section-title text-xl mb-4">Event Schedule</h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-4 p-4 bg-neutral-50 rounded-card">
                    <Calendar className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <div className="font-semibold text-neutral-800 mb-1">Start Date & Time</div>
                      <div className="text-neutral-600">{formatDate(event.start_date)}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 p-4 bg-neutral-50 rounded-card">
                    <Calendar className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <div className="font-semibold text-neutral-800 mb-1">End Date & Time</div>
                      <div className="text-neutral-600">{formatDate(event.end_date)}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <div className="card sticky top-6">
                <h3 className="font-semibold text-lg mb-4">Event Information</h3>
                
                <div className="space-y-4">
                  <div>
                    <div className="text-sm text-neutral-500 mb-1">Location</div>
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-neutral-400 mt-1 flex-shrink-0" />
                      <span className="text-neutral-800">{event.location}</span>
                    </div>
                  </div>

                  <div>
                    <div className="text-sm text-neutral-500 mb-1">Status</div>
                    <span className={getStatusBadge(event.status)}>
                      {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                    </span>
                  </div>

                  {event.registration_link && (
                    <div className="pt-4 border-t">
                      <a
                        href={event.registration_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-primary w-full flex items-center justify-center gap-2"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Register Now
                      </a>
                    </div>
                  )}

                  {event.circular_link && (
                    <div>
                      <a
                        href={event.circular_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-outline w-full flex items-center justify-center gap-2"
                      >
                        <FileText className="w-4 h-4" />
                        View Circular
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
