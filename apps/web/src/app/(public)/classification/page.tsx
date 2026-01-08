'use client'

import { useState, useEffect } from 'react'
import { FileText, Download, Loader2 } from 'lucide-react'

type Category = {
  id: string
  name: string
  slug: string
}

type Document = {
  id: string
  title: string
  description: string
  fileType: string
  size: string
  href: string
  categoryId: string | null
  category?: string // Legacy field
  updatedAt: string
}

export default function ClassificationPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [documents, setDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1'
        
        // 1. Fetch Categories for classification page
        const catRes = await fetch(`${apiUrl}/categories?page=classification`, { credentials: 'include' })
        const catsData = await catRes.json()
        const categoriesArray = Array.isArray(catsData) ? catsData : (catsData.data || [])
        
        // 2. Fetch All Downloads
        const docRes = await fetch(`${apiUrl}/downloads`, { credentials: 'include' })
        const docsData = await docRes.json()
        const documentsArray = Array.isArray(docsData) ? docsData : (docsData.data || [])

        console.log('Classification Categories fetched:', categoriesArray)
        console.log('Classification Documents fetched:', documentsArray)

        setCategories(categoriesArray)
        setDocuments(documentsArray)

      } catch (error) {
        console.error("Failed to load classification data", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <>
      <nav className="bg-neutral-100 py-3 text-sm" aria-label="Breadcrumb">
        <div className="container-main">
          <ol className="flex items-center gap-2">
            <li><a href="/" className="text-interactive hover:text-primary">Home</a></li>
            <li className="text-neutral-400">/</li>
            <li className="text-neutral-600">Classification</li>
          </ol>
        </div>
      </nav>

      <section className="py-12 bg-white border-b border-neutral-200">
        <div className="container-main text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-primary mb-4">Classification</h1>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
            Find all relevant documents, guidelines, and forms regarding Para Shooting classification in India.
          </p>
          
          {/* Quick Links */}
          {categories.length > 0 && (
            <div className="flex flex-wrap justify-center gap-4 mt-8">
              {categories.map((category) => {
                const categoryDocs = documents.filter(doc => 
                  doc.categoryId === category.id || doc.category === category.slug
                )
                return (
                  <a
                    key={category.id}
                    href={`#${category.slug}`}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-50 hover:bg-primary/5 border border-neutral-200 rounded-full transition-colors text-sm font-medium text-neutral-700 hover:text-primary"
                  >
                    {category.name}
                    {categoryDocs.length > 0 && (
                      <span className="bg-neutral-200 text-neutral-700 text-xs px-2 py-0.5 rounded-full">
                        {categoryDocs.length}
                      </span>
                    )}
                  </a>
                )
              })}
            </div>
          )}
        </div>
      </section>

      <div className="bg-neutral-50 min-h-[50vh] py-12 space-y-12">
        {/* Dynamic Categories */}
        {categories.map((category) => {
          const categoryDocs = documents.filter(doc => 
            doc.categoryId === category.id || doc.category === category.slug
          )
          
          if (categoryDocs.length === 0) return null

          return (
            <section key={category.id} id={category.slug} className="container-main">
              <div className="flex items-center gap-4 mb-8 border-b border-neutral-200 pb-2">
                <h2 className="text-2xl font-bold text-primary relative inline-block">
                  {category.name}
                  <span className="absolute -bottom-2.5 left-0 w-full h-1 bg-accent rounded-full"></span>
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categoryDocs.map((doc) => (
                  <div key={doc.id} className="card-hover group">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-card flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                        <FileText className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-primary group-hover:text-interactive transition-colors">
                          {doc.title}
                        </h3>
                        <p className="text-sm text-neutral-600 mt-1">{doc.description}</p>
                        <div className="flex items-center gap-3 mt-2 text-xs text-neutral-400">
                          <span className="uppercase font-medium">{doc.fileType}</span>
                          {doc.size && <span>• {doc.size}</span>}
                          {doc.updatedAt && <span>• {new Date(doc.updatedAt).toLocaleDateString()}</span>}
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-neutral-100">
                      {doc.href.startsWith('http') ? (
                        <a
                          href={doc.href}
                          className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-accent transition-colors"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Download className="w-4 h-4" />
                          {doc.fileType === 'Link' ? 'Open Link' : 'Open'}
                        </a>
                      ) : (
                        <a
                          href={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}${doc.href}`}
                          download
                          className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-accent transition-colors"
                        >
                          <Download className="w-4 h-4" />
                          Download {doc.fileType}
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )
        })}
        
        {categories.length === 0 && (
          <div className="text-center py-12 text-neutral-500">
            No classification categories found. Please contact the administrator.
          </div>
        )}
      </div>
    </>
  )
}
