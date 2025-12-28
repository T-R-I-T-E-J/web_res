import Link from 'next/link'
import { ArrowRight, Medal, Target, Users, Calendar } from 'lucide-react'
import { HeroSection, SearchBar, NewsCard, EventCard } from '@/components/ui'

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

const HomePage = () => {
  return (
    <>
      {/* Latest News Section */}
      <section className="section bg-white pt-12">
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

      {/* Featured Videos Section */}
      <section className="section bg-white">
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

