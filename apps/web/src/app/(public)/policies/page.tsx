'use client'

import { useState, useEffect } from 'react'
import { FileText, Download, Calendar, Loader2 } from 'lucide-react'
import Link from 'next/link'

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

export default function PoliciesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [documents, setDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1'
        
        // 1. Fetch Categories
        const catRes = await fetch(`${apiUrl}/categories?page=policies`, { credentials: 'include' })
        const catsData = await catRes.json()
        // Handle both wrapped ({data: []}) and unwrapped ([]) responses
        const categoriesArray = Array.isArray(catsData) ? catsData : (catsData.data || [])
        
        // 2. Fetch All Downloads
        const docRes = await fetch(`${apiUrl}/downloads`, { credentials: 'include' })
        const docsData = await docRes.json()
        // Handle both wrapped ({data: []}) and unwrapped ([]) responses
        const documentsArray = Array.isArray(docsData) ? docsData : (docsData.data || [])

        console.log('Categories fetched:', categoriesArray)
        console.log('Documents fetched:', documentsArray)

        setCategories(categoriesArray)
        setDocuments(documentsArray)

      } catch (error) {
        console.error("Failed to load policy data", error)
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
    <div className="container-main py-12 space-y-12">
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
        <h1 className="text-4xl font-heading font-bold text-primary">
          Rules, Regulations & Policies
        </h1>
        <p className="text-lg text-neutral-600">
          Official documents, selection policies, and guidelines governing Para Shooting in India.
        </p>
      </div>

      {/* Dynamic Categories */}
      {categories.map((category) => {
        // Filter documents for this category (check both new categoryId and legacy category slug)
        const categoryDocs = documents.filter(doc => 
          doc.categoryId === category.id || doc.category === category.slug
        )
        
        if (categoryDocs.length === 0) return null // Hide empty categories

        return (
          <section key={category.id} className="scroll-mt-24" id={category.slug}>
            <div className="flex items-center gap-4 mb-8 border-b border-neutral-200 pb-2">
              <h2 className="text-2xl font-bold text-primary relative">
                {category.name}
                <span className="absolute -bottom-2.5 left-0 w-full h-1 bg-accent rounded-full"></span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categoryDocs.map((doc) => (
                <div 
                  key={doc.id} 
                  className="group bg-white rounded-card border border-neutral-200 p-5 hover:shadow-lg transition-all hover:border-primary/20"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/5 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                       {/* Icon based on file type */}
                       <FileText className="w-5 h-5 text-primary" />
                    </div>
                    {doc.fileType && (
                      <span className="text-xs font-bold px-2 py-1 rounded bg-neutral-100 text-neutral-600 uppercase">
                        {doc.fileType}
                      </span>
                    )}
                  </div>

                  <h3 className="font-semibold text-neutral-800 mb-2 group-hover:text-primary transition-colors line-clamp-2 min-h-[3rem]">
                    {doc.title}
                  </h3>
                  
                  {doc.description && (
                     <p className="text-sm text-neutral-500 mb-4 line-clamp-2 min-h-[2.5rem]">
                       {doc.description}
                     </p>
                  )}

                  <div className="flex items-center justify-between pt-4 border-t border-neutral-100 mt-auto">
                    <span className="text-xs text-neutral-400">
                       {doc.size || 'N/A'} • {new Date(doc.updatedAt).toLocaleDateString()}
                    </span>
                    
                    {doc.href.startsWith('http') ? (
                       <a 
                         href={doc.href} 
                         target="_blank" 
                         rel="noopener noreferrer"
                         className="flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80"
                       >
                         Open <Download className="w-3.5 h-3.5" />
                       </a>
                    ) : (
                       <a 
                         href={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}${doc.href}`} 
                         download
                         className="flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80"
                       >
                         Download <Download className="w-3.5 h-3.5" />
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
           No categories found. Please contact the administrator.
         </div>
      )}
    </div>
  )
}
