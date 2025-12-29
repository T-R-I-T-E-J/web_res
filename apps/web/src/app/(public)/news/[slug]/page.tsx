import type { Metadata } from 'next'
import Link from 'next/link'
import { Calendar, ArrowLeft, Share2, Facebook, Twitter, Linkedin } from 'lucide-react'

async function getArticle(slug: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/news/${slug}`, {
      cache: 'no-store'
    })
    if (!res.ok) return null
    const json = await res.json()
    return json.data || json
  } catch (error) {
    console.error('Error fetching article:', error)
    return null
  }
}

async function getRelatedArticles(currentId: number) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/news?limit=4`, {
       next: { revalidate: 3600 } 
    })
    if (!res.ok) return []
    const json = await res.json()
    const data = json.data || json
    if (!Array.isArray(data)) return []
    return data.filter((n: any) => n.id !== currentId).slice(0, 3)
  } catch (error) {
    return []
  }
}

type Params = Promise<{ slug: string }>

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params
  const article = await getArticle(slug)
  
  if (!article) {
    return {
      title: 'Article Not Found',
    }
  }
  
  return {
    title: article.title,
    description: article.excerpt || article.title,
  }
}

export default async function NewsArticlePage({ params }: { params: Params }) {
  const { slug } = await params
  const article = await getArticle(slug)
  
  if (!article) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-heading text-4xl font-bold text-primary mb-4">Article Not Found</h1>
          <p className="text-neutral-600 mb-8">The article you're looking for doesn't exist.</p>
          <Link href="/news" className="btn-primary">
            Back to News
          </Link>
        </div>
      </div>
    )
  }

  const relatedArticles = await getRelatedArticles(article.id)
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  // Handle content formatting (simple paragraph split)
  const contentParagraphs = article.content ? article.content.split('\n').filter((p: string) => p.trim().length > 0) : []

  return (
    <>
      {/* Hero Section */}
      <section className="gradient-hero py-12 md:py-16 text-white">
        <div className="container-main">
          <Link 
            href="/news" 
            className="inline-flex items-center text-white/80 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to News
          </Link>
          <div className="max-w-3xl">
            <span className="inline-block bg-accent text-white text-xs font-bold px-3 py-1 rounded-full mb-4">
              {article.category}
            </span>
            <h1 className="font-heading text-3xl md:text-4xl font-bold mb-4">
              {article.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-white/80 text-sm">
              <span className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {formatDate(article.created_at)}
              </span>
              {/* Author if available, else omit */}
              {article.author && (
                  <>
                  <span>•</span>
                  <span>By {article.author}</span>
                  </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Breadcrumb */}
      <nav className="bg-neutral-100 py-3 text-sm" aria-label="Breadcrumb">
        <div className="container-main">
          <ol className="flex items-center gap-2 flex-wrap">
            <li><Link href="/" className="text-interactive hover:text-primary">Home</Link></li>
            <li className="text-neutral-400">/</li>
            <li><Link href="/news" className="text-interactive hover:text-primary">News</Link></li>
            <li className="text-neutral-400">/</li>
            <li className="text-neutral-600 truncate max-w-[200px]">{article.title}</li>
          </ol>
        </div>
      </nav>

      {/* Article Content */}
      <section className="section bg-white">
        <div className="container-main">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Featured Image */}
              <div className="aspect-[16/9] rounded-card overflow-hidden bg-neutral-100 mb-8">
                 {article.featured_image_url ? (
                    <img src={article.featured_image_url} alt={article.title} className="w-full h-full object-cover" />
                 ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
                      <span className="text-8xl">📰</span>
                    </div>
                 )}
              </div>

              {/* Article Body */}
              <div className="prose prose-lg max-w-none text-neutral-700">
                {contentParagraphs.map((paragraph: string, index: number) => (
                  <p key={index} className="mb-6 leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>

              {/* Share Section */}
              <div className="mt-12 pt-8 border-t border-neutral-200">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-2 text-neutral-600 font-medium">
                    <Share2 className="w-5 h-5" />
                    Share this article:
                  </span>
                  <div className="flex gap-2">
                    {/* Placeholder links with # */}
                    <a
                      href="#"
                      className="w-10 h-10 bg-[#1877f2] rounded-full flex items-center justify-center text-white hover:opacity-90 transition-opacity"
                      aria-label="Share on Facebook"
                    >
                      <Facebook className="w-5 h-5" />
                    </a>
                    <a
                      href="#"
                      className="w-10 h-10 bg-[#1da1f2] rounded-full flex items-center justify-center text-white hover:opacity-90 transition-opacity"
                      aria-label="Share on Twitter"
                    >
                      <Twitter className="w-5 h-5" />
                    </a>
                    <a
                      href="#"
                      className="w-10 h-10 bg-[#0077b5] rounded-full flex items-center justify-center text-white hover:opacity-90 transition-opacity"
                      aria-label="Share on LinkedIn"
                    >
                      <Linkedin className="w-5 h-5" />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              {/* Related Articles */}
              {relatedArticles.length > 0 && (
                  <div className="card">
                    <h3 className="font-heading font-bold text-lg text-primary mb-4">Related Articles</h3>
                    <div className="space-y-4">
                      {relatedArticles.map((related: any) => (
                        <Link
                          key={related.id}
                          href={`/news/${related.slug || related.id}`}
                          className="block group"
                        >
                          <h4 className="font-medium text-neutral-700 group-hover:text-primary transition-colors line-clamp-2">
                            {related.title}
                          </h4>
                          <span className="text-xs text-neutral-400 mt-1 block">{formatDate(related.created_at)}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
              )}

              {/* Quick Links */}
              <div className="card mt-6">
                <h3 className="font-heading font-bold text-lg text-primary mb-4">Quick Links</h3>
                <ul className="space-y-2">
                  <li>
                    <Link href="/events" className="text-neutral-600 hover:text-primary transition-colors text-sm">
                      → Upcoming Events
                    </Link>
                  </li>
                  <li>
                    <Link href="/results" className="text-neutral-600 hover:text-primary transition-colors text-sm">
                      → Competition Results
                    </Link>
                  </li>
                  <li>
                    <Link href="/downloads" className="text-neutral-600 hover:text-primary transition-colors text-sm">
                      → Criteria & Documents
                    </Link>
                  </li>
                  <li>
                    <Link href="/contact" className="text-neutral-600 hover:text-primary transition-colors text-sm">
                      → Contact Us
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

