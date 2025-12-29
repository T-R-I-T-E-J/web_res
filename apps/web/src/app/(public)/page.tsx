'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, X, Calendar } from 'lucide-react'
import { EventCard } from '@/components/ui'

// Sample data - would come from API in production


const upcomingEvents = [
  {
    title: '68th NSCC (Rifle)',
    date: 'December 2025',
    location: 'New Delhi',
    status: 'upcoming' as const,
    href: '/events/nscc-rifle-2025',
  },
  {
    title: '68th NSCC (Pistol)',
    date: 'January 2026',
    location: 'Bhopal',
    status: 'upcoming' as const,
    href: '/events/nscc-pistol-2026',
  },
  {
    title: 'Selection Trials - Asian Games',
    date: 'February 2026',
    location: 'New Delhi',
    status: 'upcoming' as const,
    href: '/events/asian-games-trials',
  },
]

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
}

const HomePage = () => {
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null)
  const [latestNews, setLatestNews] = useState<NewsItem[]>([])
  const [loadingNews, setLoadingNews] = useState(true)

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

    fetchLatestNews()
  }, [])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
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
      <section className="section bg-white">
        <div className="container-main">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <h2 className="section-title">Latest News & Updates</h2>
            <Link
              href="/news"
              className="inline-flex items-center text-sm font-semibold text-primary hover:text-accent transition-colors"
            >
              View All News
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
          
          {loadingNews ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="card animate-pulse">
                  <div className="bg-neutral-200 h-48 rounded-card mb-4"></div>
                  <div className="h-4 bg-neutral-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-neutral-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : latestNews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {latestNews.map((article) => (
                <Link
                  key={article.id}
                  href={`/news/${article.slug || article.id}`}
                  className="card group hover:border-primary transition-colors"
                >
                  <div className="relative aspect-[16/10] rounded-card overflow-hidden bg-neutral-100 mb-4">
                    {article.featured_image_url ? (
                      <img
                        src={article.featured_image_url}
                        alt={article.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
                        <span className="text-4xl">📰</span>
                      </div>
                    )}
                    <div className="absolute top-3 left-3">
                      <span className="bg-accent text-white text-xs font-bold px-2 py-1 rounded-full">
                        {article.category}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-neutral-400 mb-2">
                    <Calendar className="w-3 h-3" />
                    {formatDate(article.created_at)}
                  </div>
                  <h3 className="font-heading font-semibold text-lg text-neutral-700 group-hover:text-primary transition-colors mb-2 line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="text-sm text-neutral-600 line-clamp-3">
                    {article.excerpt}
                  </p>
                </Link>
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
      <section className="section bg-neutral-50">
        <div className="container-main">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <h2 className="section-title">Upcoming Events</h2>
            <Link
              href="/events"
              className="inline-flex items-center text-sm font-semibold text-primary hover:text-accent transition-colors"
            >
              View Calendar
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingEvents.map((event) => (
              <EventCard key={event.href} {...event} />
            ))}
          </div>
        </div>
      </section>

      {/* Highlights & Achievements Gallery */}
      <section className="section bg-white">
        <div className="container-main">
          <h2 className="section-title text-center mb-12">Highlights & Achievements</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {galleryImages.map((image) => (
              <button
                key={image.src}
                onClick={() => setSelectedImage(image)}
                className="group relative overflow-hidden rounded-card shadow-card cursor-pointer text-left"
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  width={600}
                  height={400}
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end p-6">
                  <div>
                    <h3 className="font-heading font-bold text-white text-lg">{image.title}</h3>
                    <p className="text-white/80 text-sm mt-1">{image.subtitle}</p>
                  </div>
                </div>
                <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-colors flex items-center justify-center">
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 text-primary font-semibold px-4 py-2 rounded-full text-sm">
                    Click to view
                  </span>
                </div>
              </button>
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
