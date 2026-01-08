'use client'

import { useRouter } from 'next/navigation'

import { useState, useEffect, useRef } from 'react'
import { DashboardHeader } from '@/components/dashboard'
import { Upload, Trash2, FileText, Download } from 'lucide-react'
import clsx from 'clsx'


interface Result {
  id: string
  title: string
  date: string // Represents "Year"
  description?: string
  fileName: string
  fileSize: number
  uploadedAt: string
  url: string
}

const AdminScoresPage = () => {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [results, setResults] = useState<Result[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  
  // Form State
  const [title, setTitle] = useState('')
  const [year, setYear] = useState(new Date().getFullYear().toString())
  const [description, setDescription] = useState('')
  const [file, setFile] = useState<File | null>(null)

  // Fetch Results
  const fetchResults = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1'}/results`)
      if (!response.ok) throw new Error('Failed to fetch results')
      const responseData = await response.json()
      setResults(responseData.data || [])
    } catch (error) {
      console.error('Error fetching results:', error)
      alert('Failed to load results')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchResults()
  }, [])

  // Handle Upload
  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) {
      setUploadError('Please select a PDF file')
      return
    }

    if (file.type !== 'application/pdf') {
      setUploadError('Only PDF files are allowed')
      return
    }

    try {
      setIsUploading(true)
      setUploadError(null)

      const formData = new FormData()
      formData.append('file', file)
      formData.append('title', title)
      formData.append('date', year)
      if (description) formData.append('description', description)

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1'}/results/upload`, {
        method: 'POST',
        credentials: 'include',
        body: formData
      })

      if (!response.ok) {
        if (response.status === 401) {
          router.push('/login')
          throw new Error('Session expired. Please login again.')
        }
        const errorData = await response.json()
        throw new Error(errorData.message || 'Upload failed')
      }

      alert('Result uploaded successfully')
      
      // Reset form
      setTitle('')
      setYear(new Date().getFullYear().toString())
      setDescription('')
      setFile(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
      
      // Refresh list
      fetchResults()

    } catch (error: any) {
      console.error('Upload error:', error)
      setUploadError(error.message)
    } finally {
      setIsUploading(false)
    }
  }

  // Handle Delete
  const handleDelete = async (id: string, resultTitle: string) => {
    if (!confirm(`Are you sure you want to delete "${resultTitle}"?`)) return

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1'}/results/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      })

      if (!response.ok) {
        if (response.status === 401) {
          router.push('/login')
          return
        }
        throw new Error('Delete failed')
      }

      setResults(results.filter(r => r.id !== id))
      alert('Result deleted successfully')
    } catch (error) {
      console.error('Delete error:', error)
      alert('Failed to delete result')
    }
  }

  return (
    <>
      <DashboardHeader
        title="Results Management"
        subtitle="Upload and manage PDF competition results"
      />

      <div className="p-6 space-y-6">
        
        {/* Upload Card */}
        <div className="card">
          <h2 className="font-heading font-semibold text-lg text-primary mb-4 flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Upload New Result
          </h2>
          
          <form onSubmit={handleUpload} className="space-y-4 max-w-2xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Competition Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="input w-full"
                  placeholder="e.g. 68th National Championship"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Year *
                </label>
                <input
                  type="number"
                  required
                  value={year}
                  onChange={e => setYear(e.target.value)}
                  className="input w-full"
                  placeholder="YYYY"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Description (Optional)
              </label>
              <input
                type="text"
                value={description}
                onChange={e => setDescription(e.target.value)}
                className="input w-full"
                placeholder="Brief description or category"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Result File (PDF) *
              </label>
              <input
                ref={fileInputRef}
                type="file"
                required
                accept=".pdf"
                onChange={e => setFile(e.target.files?.[0] || null)}
                className="block w-full text-sm text-neutral-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-primary file:text-white
                  hover:file:bg-primary-dark
                "
              />
              <p className="mt-1 text-xs text-neutral-500">Max size: 10MB. PDF only.</p>
            </div>

            {uploadError && (
              <div className="p-3 bg-red-50 text-red-700 text-sm rounded border border-red-200">
                {uploadError}
              </div>
            )}

            <div className="pt-2">
              <button
                type="submit"
                disabled={isUploading}
                className={clsx("btn-primary", isUploading && "opacity-75 cursor-not-allowed")}
              >
                {isUploading ? 'Uploading...' : 'Upload Result'}
              </button>
            </div>
          </form>
        </div>

        {/* Results List */}
        <div className="card">
          <h2 className="font-heading font-semibold text-lg text-primary mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Published Results
          </h2>

          {isLoading ? (
            <div className="text-center py-8 text-neutral-500">Loading results...</div>
          ) : results.length === 0 ? (
            <div className="text-center py-8 text-neutral-500 bg-neutral-50 rounded border border-dashed border-neutral-200">
              No results found. Upload your first result above.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-neutral-50 border-b border-neutral-200">
                    <th className="p-3 font-semibold text-sm text-neutral-700">Year</th>
                    <th className="p-3 font-semibold text-sm text-neutral-700">Title</th>
                    <th className="p-3 font-semibold text-sm text-neutral-700">File</th>
                    <th className="p-3 font-semibold text-sm text-neutral-700">Size</th>
                    <th className="p-3 font-semibold text-sm text-neutral-700">Uploaded At</th>
                    <th className="p-3 font-semibold text-sm text-neutral-700 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200">
                  {results.map((result) => (
                    <tr key={result.id} className="hover:bg-neutral-50 transition-colors">
                      <td className="p-3 text-sm text-neutral-600 font-data">{result.date}</td>
                      <td className="p-3 text-sm text-neutral-800 font-medium">
                        {result.title}
                        {result.description && (
                          <span className="block text-xs text-neutral-500 font-normal">{result.description}</span>
                        )}
                      </td>
                      <td className="p-3 text-sm text-neutral-600 font-data">{result.fileName}</td>
                      <td className="p-3 text-sm text-neutral-600 font-data">
                        {(result.fileSize / 1024 / 1024).toFixed(2)} MB
                      </td>
                      <td className="p-3 text-sm text-neutral-600 font-data">
                        {new Date(result.uploadedAt).toLocaleDateString()}
                      </td>
                      <td className="p-3 text-right space-x-2">
                        <a 
                          href={result.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center p-2 text-primary hover:bg-primary/10 rounded transition-colors"
                          title="Download PDF"
                        >
                          <Download className="w-4 h-4" />
                        </a>
                        <button
                          onClick={() => handleDelete(result.id, result.title)}
                          className="inline-flex items-center justify-center p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                          title="Delete Result"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </>
  )
}

export default AdminScoresPage

