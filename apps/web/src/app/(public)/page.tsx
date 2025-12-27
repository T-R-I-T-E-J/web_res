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

const features = [
  {
    icon: Target,
    title: 'World-Class Training',
    description: 'Access to state-of-the-art shooting ranges and equipment across India.',
  },
  {
    icon: Medal,
    title: 'International Success',
    description: 'Our athletes have won numerous medals at Paralympics and World Championships.',
  },
  {
    icon: Users,
    title: 'Inclusive Community',
    description: 'Supporting para-athletes from all backgrounds and ability levels.',
  },
  {
    icon: Calendar,
    title: 'Regular Events',
    description: 'National and international competitions throughout the year.',
  },
]

const HomePage = () => {
  return (
    <>
      {/* Hero Section */}
      <HeroSection />

      {/* Search Bar */}
      <SearchBar />

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

      {/* Features/Why Choose Us Section */}
      <section className="section bg-white">
        <div className="container-main">
          <div className="text-center mb-12">
            <h2 className="section-title">Why Para Shooting India</h2>
            <p className="text-neutral-600 max-w-2xl mx-auto mt-4">
              We are committed to developing world-class para-shooters through excellence in training, 
              competition, and support services.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => (
              <div key={feature.title} className="text-center p-6">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-heading font-semibold text-lg text-primary mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-neutral-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="gradient-hero py-16">
        <div className="container-main text-center">
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-white mb-4">
            Ready to Start Your Journey?
          </h2>
          <p className="text-white/90 max-w-xl mx-auto mb-8">
            Join the Para Shooting Committee of India and become part of a community dedicated to 
            excellence in para shooting sports.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register" className="btn bg-accent text-white hover:bg-accent-dark">
              Register as Shooter
            </Link>
            <Link href="/contact" className="btn bg-white/10 text-white border-2 border-white/30 hover:bg-white/20">
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Links Section */}
      <section className="section bg-neutral-100">
        <div className="container-main">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Download Forms', href: '/downloads#forms', icon: '📝' },
              { label: 'View Rankings', href: '/rankings', icon: '🏆' },
              { label: 'Event Calendar', href: '/events', icon: '📅' },
              { label: 'Contact Support', href: '/contact', icon: '📞' },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="card-hover text-center p-6 group"
              >
                <span className="text-3xl mb-2 block">{link.icon}</span>
                <span className="font-semibold text-primary group-hover:text-interactive transition-colors">
                  {link.label}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

export default HomePage

