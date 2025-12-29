'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, X } from 'lucide-react'
import { NewsCard, EventCard } from '@/components/ui'

// Sample data - would come from API in production
const latestNews = [
  {
    title: 'Para Shooting Election 2025',
    excerpt: 'Important updates regarding the upcoming elections. Check the notification section for more details.',
    category: 'Announcement',
    date: 'Dec 20, 2025',
    href: '/news/election-2025',
  },
  {
    title: 'Shooting League of India',
    excerpt: 'Registration for the new season is now open. Aspiring shooters are encouraged to apply early.',
    category: 'Event',
    date: 'Dec 18, 2025',
    href: '/news/shooting-league',
  },
  {
    title: 'National Championship 2025',
    excerpt: 'Dates and venues for the 68th National Shooting Championship have been announced.',
    category: 'Championship',
    date: 'Dec 15, 2025',
    href: '/news/nationals-2025',
  },
]

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

const HomePage = () => {
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null)

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

      {/* Latest News Section */}
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {latestNews.map((news) => (
              <NewsCard key={news.href} {...news} />
            ))}
          </div>
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
