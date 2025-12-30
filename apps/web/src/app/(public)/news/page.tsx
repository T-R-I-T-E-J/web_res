import Link from 'next/link'
import { Calendar, ArrowRight, Tag } from 'lucide-react'
import { FeaturedCard, NewsCard } from '@/components/ui'

export const dynamic = 'force-dynamic'

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
                 <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
                   {/* Main Hero Article */}
                   <div className={sideArticles.length > 0 ? "lg:col-span-2" : "lg:col-span-3"}>
                      <FeaturedCard
                        title={String(heroArticle.title || '')}
                        excerpt={String(heroArticle.excerpt || '')}
                        category={typeof heroArticle.category === 'string' ? heroArticle.category : 'NEWS'}
                        date={formatDate(heroArticle.created_at)}
                        imageUrl={heroArticle.featured_image_url || '/placeholder-news.jpg'}
                        href={`/news/${heroArticle.slug || heroArticle.id}`}
                      />
                   </div>

                   {/* Side Featured Articles */}
                   {sideArticles.length > 0 && (
                       <div className="flex flex-col gap-6">
                         {sideArticles.map((article: any) => (
                           <Link key={article.id} href={`/news/${article.slug || article.id}`} className="group relative flex flex-col gap-4 rounded-xl bg-white p-4 shadow-sm transition-all hover:shadow-md border border-neutral-100 h-full">
                             <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-neutral-200">
                               {article.featured_image_url ? (
                                  <img src={article.featured_image_url} alt={article.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                               ) : (
                                  <div className="w-full h-full bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
                                    <span className="text-2xl">{getCategoryImage(String(article.category))}</span>
                                  </div>
                               )}
                             </div>
                             <div className="flex flex-1 flex-col">
                               <div className="flex items-center justify-between mb-2">
                                   <span className="text-xs font-bold text-blue-600 px-2 py-0.5 rounded bg-blue-50">{String(article.category)}</span>
                                   <span className="text-xs text-neutral-400">{formatDate(article.created_at)}</span>
                               </div>
                               <h4 className="font-heading font-semibold text-neutral-800 group-hover:text-blue-700 transition-colors line-clamp-2 leading-tight">
                                  {String(article.title)}
                               </h4>
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
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {gridArticles.map((article: any) => (
                               <NewsCard
                                  key={article.id}
                                  title={String(article.title || '')}
                                  excerpt={String(article.excerpt || '')}
                                  category={typeof article.category === 'string' ? article.category : 'NEWS'}
                                  date={formatDate(article.created_at)}
                                  imageUrl={article.featured_image_url}
                                  href={`/news/${article.slug || article.id}`}
                               />
                            ))}
                        </div>
                     </>
                 )}
               </>
            )}
         </div>
      </section>


    </>
  )
}


export default NewsPage
