import type { Metadata } from 'next'
import Link from 'next/link'
import { Calendar, ArrowRight, Tag } from 'lucide-react'

export const metadata: Metadata = {
  title: 'News & Updates',
  description: 'Latest news, announcements, and updates from Para Shooting Committee of India.',
}

const newsArticles = [
  {
    slug: 'election-2025',
    title: 'Para Shooting Election 2025',
    excerpt: 'Important updates regarding the upcoming elections for the Para Shooting Committee of India. All affiliated units and members are requested to check the notification section for detailed guidelines and schedules.',
    category: 'Announcement',
    date: 'Dec 20, 2025',
    featured: true,
  },
  {
    slug: 'shooting-league',
    title: 'Shooting League of India - Season 2026',
    excerpt: 'Registration for the new season of Shooting League of India is now open. Aspiring para shooters are encouraged to apply early to secure their spots in this prestigious competition.',
    category: 'Event',
    date: 'Dec 18, 2025',
    featured: true,
  },
  {
    slug: 'nationals-2025',
    title: '68th National Shooting Championship 2025',
    excerpt: 'Dates and venues for the 68th National Shooting Championship have been officially announced. The championship will be held across multiple venues starting December 2025.',
    category: 'Championship',
    date: 'Dec 15, 2025',
    featured: true,
  },
  {
    slug: 'paris-paralympics-success',
    title: 'Historic Success at Paris Paralympics 2024',
    excerpt: 'Indian para shooters created history at the Paris Paralympics 2024, winning multiple medals and bringing glory to the nation. Read about the incredible performances of our athletes.',
    category: 'Achievement',
    date: 'Sep 10, 2024',
    featured: false,
  },
  {
    slug: 'avani-lekhara-gold',
    title: 'Avani Lekhara Defends Paralympic Gold',
    excerpt: 'Avani Lekhara became the first Indian woman to win two Paralympic gold medals, defending her title in the 10m Air Rifle Standing SH1 event at Paris 2024.',
    category: 'Achievement',
    date: 'Sep 5, 2024',
    featured: false,
  },
  {
    slug: 'world-cup-2024',
    title: 'India Dominates at WSPS World Cup 2024',
    excerpt: 'Indian para shooters showcased exceptional performance at the WSPS World Cup 2024, securing multiple podium finishes and setting new records.',
    category: 'Competition',
    date: 'Aug 20, 2024',
    featured: false,
  },
  {
    slug: 'training-camp-announcement',
    title: 'National Training Camp Announced',
    excerpt: 'The Para Shooting Committee of India announces a national training camp for selected athletes ahead of upcoming international competitions.',
    category: 'Training',
    date: 'Jul 15, 2024',
    featured: false,
  },
  {
    slug: 'equipment-regulations-update',
    title: 'New Equipment Regulations for 2025',
    excerpt: 'Important updates to equipment regulations for the 2025 season. All athletes and coaches are advised to review the new guidelines carefully.',
    category: 'Regulation',
    date: 'Jun 30, 2024',
    featured: false,
  },
]

const categories = ['All', 'Announcement', 'Championship', 'Achievement', 'Competition', 'Event', 'Training', 'Regulation']

const NewsPage = () => {
  const featuredNews = newsArticles.filter(article => article.featured)
  const otherNews = newsArticles.filter(article => !article.featured)

  return (
    <>
      {/* Hero Section */}
      <section className="gradient-hero py-16 md:py-20 text-center text-white">
        <div className="container-main">
          <h1 className="font-heading text-3xl md:text-4xl font-bold mb-4">News & Updates</h1>
          <p className="opacity-90 max-w-2xl mx-auto">
            Stay updated with the latest news, announcements, and achievements from Para Shooting India.
          </p>
        </div>
      </section>

      {/* Breadcrumb */}
      <nav className="bg-neutral-100 py-3 text-sm" aria-label="Breadcrumb">
        <div className="container-main">
          <ol className="flex items-center gap-2">
            <li><Link href="/" className="text-interactive hover:text-primary">Home</Link></li>
            <li className="text-neutral-400">/</li>
            <li className="text-neutral-600">News</li>
          </ol>
        </div>
      </nav>

      {/* Category Filter */}
      <section className="py-6 bg-white border-b border-neutral-200">
        <div className="container-main">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  category === 'All'
                    ? 'bg-primary text-white'
                    : 'bg-neutral-100 text-neutral-600 hover:bg-primary/10 hover:text-primary'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured News */}
      <section className="section bg-white">
        <div className="container-main">
          <h2 className="section-title mb-8">Featured News</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Featured Article */}
            <div className="lg:col-span-2">
              <Link href={`/news/${featuredNews[0].slug}`} className="group block">
                <div className="relative aspect-[16/9] rounded-card overflow-hidden bg-neutral-200 mb-4">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                    <span className="text-6xl">📰</span>
                  </div>
                  <div className="absolute top-4 left-4">
                    <span className="bg-accent text-white text-xs font-bold px-3 py-1 rounded-full">
                      {featuredNews[0].category}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-sm text-neutral-500 mb-2">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {featuredNews[0].date}
                  </span>
                </div>
                <h3 className="font-heading font-bold text-2xl text-primary group-hover:text-interactive transition-colors mb-2">
                  {featuredNews[0].title}
                </h3>
                <p className="text-neutral-600 line-clamp-3">{featuredNews[0].excerpt}</p>
              </Link>
            </div>

            {/* Side Featured Articles */}
            <div className="space-y-6">
              {featuredNews.slice(1, 3).map((article) => (
                <Link key={article.slug} href={`/news/${article.slug}`} className="group block">
                  <div className="flex gap-4">
                    <div className="w-24 h-24 flex-shrink-0 rounded-card overflow-hidden bg-neutral-200">
                      <div className="w-full h-full bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
                        <span className="text-2xl">📰</span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <span className="text-xs font-bold text-accent">{article.category}</span>
                      <h4 className="font-semibold text-neutral-700 group-hover:text-primary transition-colors line-clamp-2 mt-1">
                        {article.title}
                      </h4>
                      <span className="text-xs text-neutral-400 mt-1 block">{article.date}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* All News */}
      <section className="section bg-neutral-50">
        <div className="container-main">
          <h2 className="section-title mb-8">All News</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {otherNews.map((article) => (
              <article key={article.slug} className="card group hover:border-primary transition-colors">
                <div className="relative aspect-[16/10] rounded-card overflow-hidden bg-neutral-100 mb-4">
                  <div className="w-full h-full bg-gradient-to-br from-primary/5 to-secondary/5 flex items-center justify-center">
                    <span className="text-4xl">📄</span>
                  </div>
                  <div className="absolute top-3 left-3">
                    <span className="bg-white/90 text-primary text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                      <Tag className="w-3 h-3" />
                      {article.category}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-neutral-400 mb-2">
                  <Calendar className="w-3 h-3" />
                  {article.date}
                </div>
                <h3 className="font-heading font-semibold text-lg text-neutral-700 group-hover:text-primary transition-colors mb-2 line-clamp-2">
                  {article.title}
                </h3>
                <p className="text-sm text-neutral-600 line-clamp-3 mb-4">{article.excerpt}</p>
                <Link
                  href={`/news/${article.slug}`}
                  className="inline-flex items-center text-sm font-semibold text-primary hover:text-accent transition-colors"
                >
                  Read More
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="section bg-primary text-white">
        <div className="container-main text-center">
          <h2 className="font-heading text-2xl md:text-3xl font-bold mb-4">Stay Updated</h2>
          <p className="text-white/80 mb-8 max-w-xl mx-auto">
            Subscribe to our newsletter to receive the latest news and updates directly in your inbox.
          </p>
          <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-card text-neutral-700 focus:outline-none focus:ring-2 focus:ring-accent"
            />
            <button
              type="submit"
              className="bg-accent hover:bg-accent/90 text-white font-bold px-6 py-3 rounded-card transition-colors"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </>
  )
}

export default NewsPage

