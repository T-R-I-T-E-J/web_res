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
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1'
  console.log('Current API URL:', API_URL);
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null)
  const [latestNews, setLatestNews] = useState<NewsItem[]>([])
  const [loadingNews, setLoadingNews] = useState(true)
  const [upcomingEvents, setUpcomingEvents] = useState<EventItem[]>([])
  const [loadingEvents, setLoadingEvents] = useState(true)

  useEffect(() => {
    const fetchLatestNews = async () => {
      try {
        const res = await fetch(`${API_URL}/news?status=published&limit=3`)
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
        const res = await fetch(`${API_URL}/events`)
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

      {/* Awards Section Preview */}
      <section className="section bg-white pb-2 md:pb-4 border-t border-neutral-100">
        <div className="container-main">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <h2 className="section-title">Awards & Recognition</h2>
            <Link
              href="/awards"
              className="group inline-flex items-center text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
            >
              View All Awards
              <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             {/* Shooter of the Year */}
             <div className="p-6 rounded-2xl bg-gradient-to-br from-amber-50 to-white border border-amber-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                   <svg className="w-24 h-24 text-amber-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg> 
                </div>
                <h3 className="text-amber-600 font-bold uppercase tracking-wider text-sm mb-2">Shooter of the Year</h3>
                <p className="font-heading text-2xl font-bold text-neutral-800 mb-1">Avani Lekhara</p>
                <p className="text-neutral-500 text-sm mb-4">Rifle (SH1)</p>
                <div className="flex items-center gap-2 text-sm text-neutral-600">
                   <span className="w-2 h-2 rounded-full bg-success"></span>
                   Outstanding Performance
                </div>
             </div>

             {/* Rising Star */}
             <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-white border border-blue-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                   <svg className="w-24 h-24 text-blue-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                </div>
                <h3 className="text-blue-600 font-bold uppercase tracking-wider text-sm mb-2">Rising Star</h3>
                <p className="font-heading text-2xl font-bold text-neutral-800 mb-1">Rudransh Khandelwal</p>
                <p className="text-neutral-500 text-sm mb-4">Pistol (SH1)</p>
                 <div className="flex items-center gap-2 text-sm text-neutral-600">
                   <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                   Top Junior Performer
                </div>
             </div>

             {/* Coach of the Year */}
             <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-50 to-white border border-emerald-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                   <svg className="w-24 h-24 text-emerald-500" fill="currentColor" viewBox="0 0 24 24"><path d="M9 11.75c-.69 0-1.25.56-1.25 1.25s.56 1.25 1.25 1.25 1.25-.56 1.25-1.25-.56-1.25-1.25-1.25zm6 0c-.69 0-1.25.56-1.25 1.25s.56 1.25 1.25 1.25 1.25-.56 1.25-1.25-.56-1.25-1.25-1.25zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8 0-.29.02-.58.05-.86 2.36-1.05 4.23-2.98 5.21-5.37C11.07 8.33 14.05 10 17.42 10c.78 0 1.53-.09 2.25-.26.21 1.01.33 2.05.33 3.12 0 4.41-3.59 8-8 8z"/></svg>
                </div>
                <h3 className="text-emerald-600 font-bold uppercase tracking-wider text-sm mb-2">Coach of the Year</h3>
                <p className="font-heading text-2xl font-bold text-neutral-800 mb-1">Chandra Shekhar</p>
                <p className="text-neutral-500 text-sm mb-4">National Team</p>
                 <div className="flex items-center gap-2 text-sm text-neutral-600">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                   Mentorship Excellence
                </div>
             </div>
          </div>
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
