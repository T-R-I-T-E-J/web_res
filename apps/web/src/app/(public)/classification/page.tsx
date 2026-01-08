
import type { Metadata } from 'next'
import { FileText, Download } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Classification',
  description: 'Shooter classification system, categories, and guidelines for para shooting in India.',
}

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
    
    // Fetch all downloads and filter manually since we have multiple categories
    const res = await fetch(`${apiUrl}/downloads`, {
      cache: 'no-store',
    })
    
    if (!res.ok) {
       console.error('Failed to fetch classification documents:', res.status)
       return []
    }

    const json = await res.json()
    const data = Array.isArray(json) ? json : (json.data || [])
    
    const classificationCategories = [
      'classification', 
      'medical_classification', 
      'ipc_license', 
      'national_classification'
    ];

    return data.filter((item: ClassificationItem) => classificationCategories.includes(item.category));
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

  const medicalDocs = documents.filter(d => d.category === 'medical_classification');
  const ipcDocs = documents.filter(d => d.category === 'ipc_license');
  const nationalDocs = documents.filter(d => d.category === 'national_classification');
  const otherDocs = documents.filter(d => d.category === 'classification');

  const sections = [
    { id: 'medical', label: 'Medical Classification', count: medicalDocs.length },
    { id: 'ipc', label: 'IPC License Formals', count: ipcDocs.length },
    { id: 'national', label: 'National Rule Classification', count: nationalDocs.length },
  ];

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
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            {sections.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-50 hover:bg-primary/5 border border-neutral-200 rounded-full transition-colors text-sm font-medium text-neutral-700 hover:text-primary"
              >
                {section.label}
                {section.count > 0 && (
                  <span className="bg-neutral-200 text-neutral-700 text-xs px-2 py-0.5 rounded-full">
                    {section.count}
                  </span>
                )}
              </a>
            ))}
          </div>
        </div>
      </section>

      <div className="bg-neutral-50 min-h-[50vh] py-12 space-y-12">
        
        {/* Medical Classification Section */}
        <section id="medical" className="container-main">
          <h2 className="text-3xl font-heading font-bold text-primary mb-6 pb-2 border-b-4 border-accent inline-block">
            Medical Classification
          </h2>
          {medicalDocs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {medicalDocs.map(doc => <ClassificationCard key={doc.id} {...doc} date={doc.createdAt} />)}
            </div>
          ) : (
            <p className="text-neutral-500 italic">No Medical Classification documents available.</p>
          )}
        </section>

        {/* IPC License Formals Section */}
        <section id="ipc" className="container-main">
          <h2 className="text-3xl font-heading font-bold text-primary mb-6 pb-2 border-b-4 border-accent inline-block">
            IPC License Formals
          </h2>
          {ipcDocs.length > 0 ? (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {ipcDocs.map(doc => <ClassificationCard key={doc.id} {...doc} date={doc.createdAt} />)}
            </div>
          ) : (
             <p className="text-neutral-500 italic">No IPC License documents available.</p>
          )}
        </section>

        {/* National Rule Classification Section */}
        <section id="national" className="container-main">
          <h2 className="text-3xl font-heading font-bold text-primary mb-6 pb-2 border-b-4 border-accent inline-block">
            National Rule Classification
          </h2>
          {nationalDocs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {nationalDocs.map(doc => <ClassificationCard key={doc.id} {...doc} date={doc.createdAt} />)}
            </div>
          ) : (
            <p className="text-neutral-500 italic">No National Rule documents available.</p>
          )}
        </section>

        {/* Other Classification Documents Section */}
        {otherDocs.length > 0 && (
          <section className="container-main">
            <h2 className="text-2xl font-bold text-neutral-800 mb-6 border-b pb-2 border-neutral-200">
              Other Documents
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {otherDocs.map(doc => <ClassificationCard key={doc.id} {...doc} date={doc.createdAt} />)}
            </div>
          </section>
        )}
      </div>
    </>
  )
}
export default ClassificationPage
