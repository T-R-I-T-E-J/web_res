import type { Metadata } from 'next'
import Link from 'next/link'
import DOMPurify from 'isomorphic-dompurify'
import { Calendar, ArrowLeft, Share2, Facebook, Twitter, Linkedin, FileText, Download } from 'lucide-react'

export const dynamic = 'force-dynamic'

async function getArticle(slug: string) {
  try {
    const API_URL = '/api/v1'; // Use frontend API route
    const res = await fetch(`${API_URL}/news/${slug}`, {
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
    const API_URL = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';
    const res = await fetch(`${API_URL}/news?limit=4`, {
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

  // Check if content contains HTML tags
  const isHtmlContent = article.content && (article.content.includes('<') || article.content.includes('>'))
  const contentParagraphs = !isHtmlContent && article.content ? article.content.split('\n').filter((p: string) => p.trim().length > 0) : []

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
                  <span>By {typeof article.author === 'object' ? `${article.author.first_name || ''} ${article.author.last_name || ''}`.trim() : article.author}</span>
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
              {/* Featured Image(s) */}
              <div className="space-y-4 mb-8">
                {/* Display all images from image_urls array */}
                {article.image_urls && Array.isArray(article.image_urls) && article.image_urls.length > 0 ? (
                  <div className="grid grid-cols-1 gap-4">
                    {article.image_urls.map((imageUrl: string, index: number) => (
                      <div key={index} className="aspect-[16/9] rounded-card overflow-hidden bg-neutral-100">
                        <img 
                          src={imageUrl} 
                          alt={`${article.title} - Image ${index + 1}`} 
                          className="w-full h-full object-cover" 
                        />
                      </div>
                    ))}
                  </div>
                ) : article.featured_image_url || article.preview_image_url ? (
                  // Fallback to featured_image_url or preview_image_url
                  <div className="aspect-[16/9] rounded-card overflow-hidden bg-neutral-100">
                    <img src={article.featured_image_url || article.preview_image_url} alt={article.title} className="w-full h-full object-cover" />
                  </div>
                ) : (
                  // No images available
                  <div className="aspect-[16/9] rounded-card overflow-hidden bg-neutral-100">
                    <div className="w-full h-full bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
                      <span className="text-8xl">📰</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Article Body */}
              <div className="prose prose-lg max-w-none text-neutral-700">

// ... (in the component)
                {isHtmlContent ? (
                  <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(article.content) }} />
                ) : (
                  contentParagraphs.map((paragraph: string, index: number) => (
                    <p key={index} className="mb-6 leading-relaxed">
                      {paragraph}
                    </p>
                  ))
                )}
              </div>

              {/* Documents Section */}
              {article.documents && Array.isArray(article.documents) && article.documents.length > 0 && (
                <div className="mt-8 mb-8 p-6 bg-neutral-50 rounded-xl border border-neutral-200">
                  <h3 className="font-heading font-bold text-lg text-primary mb-4 flex items-center gap-2">
                    <Download className="w-5 h-5" />
                    Related Documents
                  </h3>
                  <div className="space-y-3">
                    {article.documents.filter((doc: any) => doc && doc.url && doc.name).map((doc: any, index: number) => (
                      <a
                        key={index}
                        href={doc.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3 bg-white rounded-lg border border-neutral-200 hover:border-primary/50 hover:shadow-sm transition-all group"
                      >
                        <div className="w-10 h-10 bg-primary/5 rounded-md flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                          <FileText className="w-5 h-5" />
                        </div>
                         <div className="min-w-0 flex-1">
                            <p className="font-medium text-sm text-neutral-900 truncate group-hover:text-primary transition-colors">
                              {doc.name || 'Document'}
                            </p>
                            <span className="text-xs text-neutral-500">Click to view/download</span>
                         </div>
                         <Download className="w-4 h-4 text-neutral-400 group-hover:text-primary transition-colors" />
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Share Section */}
              <div className="mt-12 pt-8 border-t border-neutral-200">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-2 text-neutral-600 font-medium">
                    <Share2 className="w-5 h-5" />
                    Share this article:
                  </span>
                  <div className="flex gap-2">
                    {/* Share Links */}
                    <a
                      href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`https://parashootingindia.org/news/${slug}`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 bg-[#1877f2] rounded-full flex items-center justify-center text-white hover:opacity-90 transition-opacity"
                      aria-label="Share on Facebook"
                    >
                      <Facebook className="w-5 h-5" />
                    </a>
                    <a
                      href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}&url=${encodeURIComponent(`https://parashootingindia.org/news/${slug}`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 bg-[#1da1f2] rounded-full flex items-center justify-center text-white hover:opacity-90 transition-opacity"
                      aria-label="Share on Twitter"
                    >
                      <Twitter className="w-5 h-5" />
                    </a>
                    <a
                      href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`https://parashootingindia.org/news/${slug}`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
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
                    <Link href="/policies" className="text-neutral-600 hover:text-primary transition-colors text-sm">
                      → Policies & Documents
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

