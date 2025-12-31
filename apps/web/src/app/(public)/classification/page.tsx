
import type { Metadata } from 'next'
import { FileText, Download, Award, Users, Target, BookOpen } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Classification',
  description: 'Shooter classification system, categories, and guidelines for para shooting in India.',
}

const categories = [
  { label: 'Classification System', icon: Award, id: 'system' },
  { label: 'Shooter Categories', icon: Users, id: 'categories' },
  { label: 'Assessment Guidelines', icon: Target, id: 'assessment' },
  { label: 'Classification Documents', icon: BookOpen, id: 'documents' },
]

interface ClassificationItem {
  id: string
  title: string
  description: string
  fileType: string
  size?: string
  href: string
  category: string
  createdAt?: string
  date?: string
}

async function getClassificationDocuments(): Promise<ClassificationItem[]> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';
    console.log(`Fetching classification documents from: ${apiUrl}/downloads`);
    
    const res = await fetch(`${apiUrl}/downloads`, {
      cache: 'no-store',
    })
    
    if (!res.ok) {
       console.error('Failed to fetch classification documents:', res.status, await res.text())
       return []
    }

    const json = await res.json()
    const data = Array.isArray(json) ? json : (json.data || [])
    
    // Filter for classification-related documents
    // You can add a specific category filter here if needed
    return Array.isArray(data) ? data : []
  } catch (error) {
    console.error('Error fetching classification documents:', error)
    return []
  }
}

const ClassificationCard = ({
  title,
  description,
  fileType,
  size,
  href,
  date,
}: {
  title: string
  description: string
  fileType: string
  size?: string
  href: string
  date?: string
}) => (
  <div className="card-hover group">
    <div className="flex items-start gap-4">
      <div className="w-12 h-12 bg-primary/10 rounded-card flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
        <FileText className="w-6 h-6 text-primary" />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-primary group-hover:text-interactive transition-colors">
          {title}
        </h3>
        <p className="text-sm text-neutral-600 mt-1">{description}</p>
        <div className="flex items-center gap-3 mt-2 text-xs text-neutral-400">
          <span className="uppercase font-medium">{fileType}</span>
          {size && <span>• {size}</span>}
          {date && <span>• {new Date(date).toLocaleDateString()}</span>}
        </div>
      </div>
    </div>
    <div className="mt-4 pt-4 border-t border-neutral-100">
      <a
        href={href}
        className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-accent transition-colors"
        target="_blank"
        rel="noopener noreferrer"
      >
        <Download className="w-4 h-4" />
        {fileType === 'Link' ? 'Open Link' : `Download ${fileType}`}
      </a>
    </div>
  </div>
)

const ClassificationPage = async () => {
  const documents = await getClassificationDocuments();
  
  // Filter documents by category
  const systemDocs = documents.filter(d => d.category === 'system' || d.category === 'rules');
  const categoryDocs = documents.filter(d => d.category === 'categories' || d.category === 'selection');
  const assessmentDocs = documents.filter(d => d.category === 'assessment' || d.category === 'calendar');
  const generalDocs = documents.filter(d => d.category === 'documents' || d.category === 'match');

  return (
    <>
      {/* Breadcrumb */}
      <nav className="bg-neutral-100 py-3 text-sm" aria-label="Breadcrumb">
        <div className="container-main">
          <ol className="flex items-center gap-2">
            <li><a href="/" className="text-interactive hover:text-primary">Home</a></li>
            <li className="text-neutral-400">/</li>
            <li className="text-neutral-600">Classification</li>
          </ol>
        </div>
      </nav>

      {/* Page Header */}
      <section className="py-12 bg-gradient-to-r from-primary to-secondary text-white">
        <div className="container-main text-center">
          <h1 className="text-4xl font-bold mb-4">Shooter Classification</h1>
          <p className="text-lg text-blue-100 max-w-3xl mx-auto">
            Information about shooter classification system, categories, and assessment guidelines for para shooting athletes.
          </p>
        </div>
      </section>

      {/* Quick Access Categories */}
      <section className="py-8 bg-white border-b border-neutral-200">
        <div className="container-main">
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className="flex items-center gap-2 px-6 py-3 bg-neutral-50 rounded-card hover:bg-primary/10 hover:text-primary transition-colors"
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Classification System Section */}
      <section id="system" className="section bg-white">
        <div className="container-main">
          <h2 className="section-title">Classification System</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {systemDocs.length > 0 ? systemDocs.map((doc) => (
              <ClassificationCard 
                key={doc.id} 
                {...doc} 
                date={doc.createdAt} 
              />
            )) : (
              <p className="text-neutral-500">No documents found.</p>
            )}
          </div>
        </div>
      </section>

      {/* Shooter Categories Section */}
      <section id="categories" className="section bg-neutral-50">
        <div className="container-main">
          <h2 className="section-title">Shooter Categories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categoryDocs.length > 0 ? categoryDocs.map((doc) => (
              <ClassificationCard 
                key={doc.id} 
                {...doc} 
                date={doc.createdAt}
              />
            )) : (
              <p className="text-neutral-500">No documents found.</p>
            )}
          </div>
        </div>
      </section>

      {/* Assessment Guidelines Section */}
      <section id="assessment" className="section bg-white">
        <div className="container-main">
          <h2 className="section-title">Assessment Guidelines</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {assessmentDocs.length > 0 ? assessmentDocs.map((doc) => (
              <ClassificationCard 
                key={doc.id} 
                {...doc} 
                date={doc.createdAt}
              />
            )) : (
              <p className="text-neutral-500">No documents found.</p>
            )}
          </div>
        </div>
      </section>

      {/* Classification Documents Section */}
      <section id="documents" className="section bg-neutral-50">
        <div className="container-main">
          <h2 className="section-title">Classification Documents</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {generalDocs.length > 0 ? generalDocs.map((doc) => (
              <ClassificationCard 
                key={doc.id} 
                {...doc} 
                date={doc.createdAt}
              />
            )) : (
              <p className="text-neutral-500">No documents found.</p>
            )}
          </div>
        </div>
      </section>
    </>
  )
}

export default ClassificationPage
