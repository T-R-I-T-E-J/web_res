'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, X, Calendar } from 'lucide-react'
import { EventCard, FeaturedCard, NewsCard } from '@/components/ui'

const galleryImages = [
  {
    src: '/committee.jpg',
    alt: 'Para Shooting Committee',
    title: 'Para Shooting Committee',
    subtitle: 'Leadership & Governance',
  },
  {
    src: '/dronacharya-2021.jpg',
    alt: 'Dronacharya Award 2021',
    title: 'Dronacharya Award 2021',
    subtitle: 'Excellence in Coaching',
  },
  {
    src: '/president-of-india.jpg',
    alt: "With Hon'ble President of India",
    title: 'Presidential Recognition',
    subtitle: "With Hon'ble President of India",
  },
]

type GalleryImage = {
  src: string
  alt: string
  title: string
  subtitle: string
}

type NewsItem = {
  id: number
  title: string
  slug: string
  excerpt: string
  category: string
  created_at: string
  featured_image_url?: string
  preview_image_url?: string
}

type EventItem = {
  id: number
  title: string
  slug: string
  location: string
  start_date: string
  end_date: string
  status: 'upcoming' | 'ongoing' | 'completed'
  description?: string
}

const HomePage = () => {
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null)
  const [latestNews, setLatestNews] = useState<NewsItem[]>([])
  const [loadingNews, setLoadingNews] = useState(true)
  const [upcomingEvents, setUpcomingEvents] = useState<EventItem[]>([])
  const [loadingEvents, setLoadingEvents] = useState(true)

  useEffect(() => {
    const fetchLatestNews = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/news?status=published&limit=3`)
        if (res.ok) {
          const json = await res.json()
          const data = json.data || json
          if (Array.isArray(data)) {
            setLatestNews(data.slice(0, 3))
          }
        }
      } catch (error) {
        console.error('Failed to fetch news:', error)
      } finally {
        setLoadingNews(false)
      }
    }

    const fetchUpcomingEvents = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/events`)
        if (res.ok) {
          const json = await res.json()
          const data = json.data || json
          if (Array.isArray(data)) {
            // Filter for upcoming events and sort by start date
            const upcoming = data
              .filter((event: EventItem) => event.status === 'upcoming' || event.status === 'ongoing')
              .sort((a: EventItem, b: EventItem) => 
                new Date(a.start_date).getTime() - new Date(b.start_date).getTime()
              )
              .slice(0, 3)
            setUpcomingEvents(upcoming)
          }
        }
      } catch (error) {
        console.error('Failed to fetch events:', error)
      } finally {
        setLoadingEvents(false)
      }
    }

    fetchLatestNews()
    fetchUpcomingEvents()
  }, [])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const formatEventDate = (startDate: string, endDate: string) => {
    const start = new Date(startDate)
    const end = new Date(endDate)
    
    if (start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear()) {
      return start.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    }
    return `${start.toLocaleDateString('en-US', { month: 'short' })} - ${end.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}`
  }

  return (
    <>
      {/* Image Lightbox Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-4 right-4 z-10 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors"
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>
          <div
            className="relative max-w-5xl max-h-[90vh] w-full"
            onClick={(e) => e.stopPropagation()}
          >
            {selectedImage.src.startsWith('http') ? (
              <img
                src={selectedImage.src.replace('sz=w1000', 'sz=w2000')}
                alt={selectedImage.alt}
                className="w-full h-auto max-h-[85vh] object-contain rounded-lg mx-auto"
              />
            ) : (
              <Image
                src={selectedImage.src}
                alt={selectedImage.alt}
                width={1200}
                height={800}
                className="w-full h-auto max-h-[85vh] object-contain rounded-lg"
              />
            )}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 rounded-b-lg">
              <h3 className="font-heading font-bold text-white text-xl">{selectedImage.title}</h3>
              <p className="text-white/80 text-sm mt-1">{selectedImage.subtitle}</p>
            </div>
          </div>
        </div>
      )}




      {/* Latest News & Updates Section */}
      <section className="section bg-white pb-2 md:pb-4">
        <div className="container-main">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <h2 className="section-title">Latest News & Updates</h2>
            <Link
              href="/news"
              className="group inline-flex items-center text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
            >
              View All News
              <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
          
          {loadingNews ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 h-[400px] bg-neutral-100 rounded-2xl animate-pulse"></div>
              <div className="h-[400px] bg-neutral-100 rounded-2xl animate-pulse"></div>
            </div>
          ) : latestNews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {latestNews.slice(0, 3).map((article) => (
                <NewsCard
                  key={article.id}
                  title={String(article.title || '')}
                  excerpt={String(article.excerpt || '')}
                  category={typeof article.category === 'string' ? article.category : 'News'}
                  date={formatDate(article.created_at || new Date().toISOString())}
                  imageUrl={article.preview_image_url || article.featured_image_url || '/news-hero-placeholder.png'}
                  href={`/news/${article.slug || article.id}`}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-neutral-500">
              <p>No news articles available at the moment.</p>
            </div>
          )}
        </div>
      </section>

      {/* Upcoming Events Section */}
      <section className="section bg-neutral-50 pb-2 md:pb-4">
        <div className="container-main">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <h2 className="section-title">Upcoming Events</h2>
            <Link
              href="/events"
              className="group inline-flex items-center text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
            >
              View Calendar
              <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
          
          {loadingEvents ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-48 bg-neutral-100 rounded-xl animate-pulse"></div>
              ))}
            </div>
          ) : upcomingEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingEvents.map((event) => {
                 const startDate = new Date(event.start_date);
                 return (
                    <EventCard 
                      key={event.id} 
                      title={event.title}
                      date={formatEventDate(event.start_date, event.end_date)}
                      location={event.location}
                      status={event.status}
                      href={`/events/${event.slug || event.id}`}
                      day={startDate.getDate().toString()}
                      month={startDate.toLocaleString('default', { month: 'short' }).toUpperCase()}
                    />
                 )
              })}
            </div>
          ) : (
            <div className="text-center py-12 text-neutral-500">
              <p>No upcoming events at the moment. Check back soon!</p>
            </div>
          )}
        </div>
      </section>

      {/* Highlights & Achievements Gallery */}
       <section className="section bg-white pb-2 md:pb-4">
        <div className="container-main">
          <div className="flex justify-between items-center mb-12">
             <h2 className="section-title mb-0">Highlights & Achievements</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {galleryImages.map((image, idx) => (
               <NewsCard
                  key={idx}
                  title={image.title}
                  excerpt={image.subtitle}
                  date="Featured" 
                  imageUrl={image.src} 
                  href="#"
               />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Videos Section */}
      <section className="section bg-neutral-50">
        <div className="container-main">
          <h2 className="section-title text-center mb-12">Featured Videos</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              'PVKBcmWnlHw',
              'CC5oe68AkqE',
              'dxT_9RBQpjc',
              'Hmffj6csbr8'
            ].map((videoId) => (
              <div key={videoId} className="aspect-video rounded-card overflow-hidden shadow-card">
                <iframe
                  className="w-full h-full"
                  src={`https://www.youtube.com/embed/${videoId}`}
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                ></iframe>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

export default HomePage
