import Link from 'next/link'
import { Calendar, ArrowRight, Tag } from 'lucide-react'

export const metadata = {
  title: 'News & Updates',
  description: 'Latest news, announcements, and updates from Para Shooting Committee of India.',
}

async function getNews() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/news?status=published`, {
      cache: 'no-store',
    })
    
    if (!res.ok) {
       return []
    }

    const json = await res.json()
    const data = json.data || json
    return Array.isArray(data) ? data : []
  } catch (error) {
    console.error('Error fetching news:', error)
    return []
  }
}

const NewsPage = async ({ searchParams }: { searchParams: { category?: string } }) => {
  const allNews = await getNews()
  const categoryFilter = searchParams?.category
  
  // Sort by date (newest first)
  const sortedNews = [...allNews].sort((a: any, b: any) => 
    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  )

  const displayedNews = categoryFilter && categoryFilter !== 'All'
    ? sortedNews.filter((n: any) => n.category === categoryFilter)
    : sortedNews

  // Determine Hero and Side articles
  // Prioritize featured items for top section
  const featuredItems = displayedNews.filter((n: any) => n.is_featured)
  const regularItems = displayedNews.filter((n: any) => !n.is_featured)
  
  // Hero is first featured, or first regular if no featured
  const heroArticle = featuredItems.length > 0 ? featuredItems[0] : displayedNews[0]
  
  // Side articles are next 2 featured, or empty if we ran out of featured
  // (We won't fill side entries with regular items to maintain "Featured" semantic, 
  // unless we want to fill layout. Let's keep it strict for now).
  const sideArticles = featuredItems.length > 1 ? featuredItems.slice(1, 3) : []

  // Remaining articles go to grid
  const gridArticles = displayedNews.filter(
    (n: any) => n.id !== heroArticle?.id && !sideArticles.find((s: any) => s.id === n.id)
  )
  
  const categories = ['All', 'NEWS', 'ANNOUNCEMENT', 'RESULT', 'ACHIEVEMENT', 'EVENT', 'PRESS_RELEASE']

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const getCategoryImage = (category: string) => {
      // Fallback emoji based on category if no image
      switch(category) {
          case 'RESULT': return '🏆'
          case 'ACHIEVEMENT': return '🥇'
          case 'EVENT': return '📅'
          default: return '📰'
      }
  }

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
              <Link
                key={category}
                href={category === 'All' ? '/news' : `/news?category=${category}`}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  (category === 'All' && !categoryFilter) || category === categoryFilter
                    ? 'bg-primary text-white'
                    : 'bg-neutral-100 text-neutral-600 hover:bg-primary/10 hover:text-primary'
                }`}
              >
                {category.charAt(0) + category.slice(1).toLowerCase().replace('_', ' ')}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="section bg-white">
         <div className="container-main">
            {!heroArticle ? (
                <div className="text-center py-12 text-neutral-500">
                    No news articles found in this category.
                </div>
            ) : (
                <>
                {/* Featured Section */}
                 <h2 className="section-title mb-8">Featured News</h2>
                 <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
                   {/* Main Hero Article */}
                   <div className={sideArticles.length > 0 ? "lg:col-span-2" : "lg:col-span-3"}>
                      <Link href={`/news/${heroArticle.slug || heroArticle.id}`} className="group block">
                       <div className="relative aspect-[16/9] rounded-card overflow-hidden bg-neutral-200 mb-4">
                         {heroArticle.featured_image_url ? (
                            <img src={heroArticle.featured_image_url} alt={heroArticle.title} className="w-full h-full object-cover" />
                         ) : (
                             <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                               <span className="text-6xl">{getCategoryImage(heroArticle.category)}</span>
                             </div>
                         )}
                         <div className="absolute top-4 left-4">
                           <span className="bg-accent text-white text-xs font-bold px-3 py-1 rounded-full">
                             {heroArticle.category}
                           </span>
                         </div>
                       </div>
                       <div className="flex items-center gap-3 text-sm text-neutral-500 mb-2">
                         <span className="flex items-center gap-1">
                           <Calendar className="w-4 h-4" />
                           {formatDate(heroArticle.created_at)}
                         </span>
                       </div>
                       <h3 className="font-heading font-bold text-2xl text-primary group-hover:text-interactive transition-colors mb-2">
                         {heroArticle.title}
                       </h3>
                       <p className="text-neutral-600 line-clamp-3">{heroArticle.excerpt}</p>
                     </Link>
                   </div>

                   {/* Side Featured Articles */}
                   {sideArticles.length > 0 && (
                       <div className="space-y-6">
                         {sideArticles.map((article: any) => (
                           <Link key={article.id} href={`/news/${article.slug || article.id}`} className="group block">
                             <div className="flex gap-4">
                               <div className="w-24 h-24 flex-shrink-0 rounded-card overflow-hidden bg-neutral-200">
                                 {article.featured_image_url ? (
                                    <img src={article.featured_image_url} alt={article.title} className="w-full h-full object-cover" />
                                 ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
                                      <span className="text-2xl">{getCategoryImage(article.category)}</span>
                                    </div>
                                 )}
                               </div>
                               <div className="flex-1">
                                 <span className="text-xs font-bold text-accent">{article.category}</span>
                                 <h4 className="font-semibold text-neutral-700 group-hover:text-primary transition-colors line-clamp-2 mt-1">
                                   {article.title}
                                 </h4>
                                 <span className="text-xs text-neutral-400 mt-1 block">{formatDate(article.created_at)}</span>
                               </div>
                             </div>
                           </Link>
                         ))}
                       </div>
                   )}
                 </div>

                 {/* All News Grid */}
                 {gridArticles.length > 0 && (
                     <>
                        <h2 className="section-title mb-8">All News</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {gridArticles.map((article: any) => (
                              <article key={article.id} className="card group hover:border-primary transition-colors">
                                <div className="relative aspect-[16/10] rounded-card overflow-hidden bg-neutral-100 mb-4">
                                  {article.featured_image_url ? (
                                      <img src={article.featured_image_url} alt={article.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                                  ) : (
                                      <div className="w-full h-full bg-gradient-to-br from-primary/5 to-secondary/5 flex items-center justify-center">
                                        <span className="text-4xl">{getCategoryImage(article.category)}</span>
                                      </div>
                                  )}
                                  <div className="absolute top-3 left-3">
                                    <span className="bg-white/90 text-primary text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                                      <Tag className="w-3 h-3" />
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
                                <p className="text-sm text-neutral-600 line-clamp-3 mb-4">{article.excerpt}</p>
                                <Link
                                  href={`/news/${article.slug || article.id}`}
                                  className="inline-flex items-center text-sm font-semibold text-primary hover:text-accent transition-colors"
                                >
                                  Read More
                                  <ArrowRight className="w-4 h-4 ml-1" />
                                </Link>
                              </article>
                            ))}
                        </div>
                     </>
                 )}
               </>
            )}
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
