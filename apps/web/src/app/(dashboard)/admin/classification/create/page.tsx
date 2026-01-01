'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { DashboardHeader } from '@/components/dashboard'
import { ArrowLeft, Loader2, Upload as UploadIcon, Link as LinkIcon, FileText } from 'lucide-react'
import Cookies from 'js-cookie'
import clsx from 'clsx'

const categories = [
  { label: 'Rules & Guidelines', value: 'rules' },
  { label: 'Selection Policies', value: 'selection' },
  { label: 'Event Calendar', value: 'calendar' },
  { label: 'Match Documents', value: 'match' },
]

export default function CreateClassificationPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [uploadType, setUploadType] = useState<'file' | 'url'>('file')
  const [file, setFile] = useState<File | null>(null)
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'rules',
    fileType: 'PDF',
    size: '',
    href: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]
      
      // Client-side size validation (10MB)
      const MAX_SIZE_BYTES = 10 * 1024 * 1024; // 10MB
      if (selectedFile.size > MAX_SIZE_BYTES) {
        alert('File size exceeds 10MB limit. Please choose a smaller file.');
        e.target.value = ''; // Clear input
        setFile(null);
        setFormData(prev => ({ ...prev, size: '', fileType: '' }));
        return;
      }

      setFile(selectedFile)
      
      // Auto-fill details
      const sizeInMB = (selectedFile.size / (1024 * 1024)).toFixed(2)
      setFormData(prev => ({
        ...prev,
        size: `${sizeInMB} MB`,
        fileType: getFileType(selectedFile.name)
      }))
    }
  }

  const getFileType = (filename: string) => {
    const ext = filename.split('.').pop()?.toUpperCase() || 'FILE'
    return ext === 'DOCX' || ext === 'DOC' ? 'DOC' : ext
  }

  const uploadDocument = async (token: string, apiUrl: string) => {
    if (!file) return null;
    
    const uploadFormData = new FormData()
    uploadFormData.append('document', file)

    const uploadRes = await fetch(`${apiUrl}/upload/document`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: uploadFormData
    })

    if (!uploadRes.ok) {
      throw new Error('File upload failed');
    }

    const uploadJson = await uploadRes.json();
    
    // Defensive validation of response shape
    if (typeof uploadJson !== 'object' || !uploadJson) {
       throw new Error('Invalid response from upload server');
    }

    // Check for direct URL or nested file object
    let filename: string | undefined;

    if (uploadJson.data?.file?.filename) {
      filename = uploadJson.data.file.filename;
    } else if (uploadJson.file?.filename) {
      filename = uploadJson.file.filename;
    }

    if (!filename) {
       console.error('Unexpected upload response:', uploadJson);
       throw new Error('Upload successful but filename missing in response');
    }

    return `/uploads/documents/${filename}`;
  }

  const createDownloadEntry = async (finalHref: string, token: string, apiUrl: string) => {
      const payload = {
        ...formData,
        href: finalHref,
        isActive: true
      }

      const res = await fetch(`${apiUrl}/downloads`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      })

      if (res.ok) {
        alert('Document added successfully!')
        router.push('/admin/classification')
      } else {
        const error = await res.text()
        alert(`Failed to create: ${error}`)
      }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const token = Cookies.get('auth_token')
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1'
      
      if (!token) throw new Error('Authentication token missing');

      let finalHref = formData.href

      // 1. Upload File if selected
      if (uploadType === 'file' && file) {
        const uploadedPath = await uploadDocument(token, apiUrl);
        if (uploadedPath) finalHref = uploadedPath;
      }

      // 2. Create Download Entry
      await createDownloadEntry(finalHref, token, apiUrl);

    } catch (error) {
      console.error('Error creating document:', error)
      alert(error instanceof Error ? error.message : 'An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <DashboardHeader
        title="Add New Document"
        subtitle="Upload a new document or add a link"
      />

      <div className="p-6 max-w-2xl">
        <Link
          href="/admin/classification"
          className="inline-flex items-center gap-2 text-sm text-neutral-500 hover:text-primary mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to list
        </Link>

        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Title */}
            <div>
              <label className="label" htmlFor="title">Document Title</label>
              <input
                id="title"
                name="title"
                type="text"
                required
                value={formData.title}
                onChange={handleChange}
                className="input w-full"
                placeholder="e.g. National Shooting Rules 2025"
              />
            </div>

            {/* Description */}
            <div>
              <label className="label" htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                rows={3}
                value={formData.description}
                onChange={handleChange}
                className="input w-full min-h-[100px]"
                placeholder="Brief description of the document..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Category */}
              <div>
                <label className="label" htmlFor="category">Category</label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="input w-full"
                >
                  {categories.map(c => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
              </div>

              {/* File Type */}
              <div>
                <label className="label" htmlFor="fileType">File Type</label>
                <input
                  id="fileType"
                  name="fileType"
                  type="text"
                  required
                  value={formData.fileType}
                  onChange={handleChange}
                  className="input w-full uppercase"
                  placeholder="e.g. PDF, DOCX"
                />
              </div>
            </div>

            {/* Upload Type Toggle */}
            <div>
              <label className="label">Document Source</label>
              <div className="flex gap-4 mb-4">
                <button
                  type="button"
                  onClick={() => setUploadType('file')}
                  className={clsx(
                    'flex-1 flex items-center justify-center gap-2 py-3 border rounded-lg transition-all',
                    uploadType === 'file'
                      ? 'border-primary bg-primary/5 text-primary ring-1 ring-primary'
                      : 'border-neutral-200 hover:bg-neutral-50 text-neutral-600'
                  )}
                >
                  <UploadIcon className="w-4 h-4" />
                  Upload File
                </button>
                <button
                  type="button"
                  onClick={() => setUploadType('url')}
                  className={clsx(
                    'flex-1 flex items-center justify-center gap-2 py-3 border rounded-lg transition-all',
                    uploadType === 'url'
                      ? 'border-primary bg-primary/5 text-primary ring-1 ring-primary'
                      : 'border-neutral-200 hover:bg-neutral-50 text-neutral-600'
                  )}
                >
                  <LinkIcon className="w-4 h-4" />
                  External Link
                </button>
              </div>

              {uploadType === 'file' ? (
                <div>
                  <input
                    type="file"
                    onChange={handleFileChange}
                    className="input w-full p-2"
                    accept=".pdf,.doc,.docx,.xls,.xlsx"
                    required
                  />
                  <p className="text-xs text-neutral-500 mt-1">Accepted formats: PDF, Word, Excel (Max 10MB)</p>
                </div>
              ) : (
                <div>
                  <input
                    type="url"
                    name="href"
                    value={formData.href}
                    onChange={handleChange}
                    className="input w-full"
                    placeholder="https://example.com/document.pdf"
                    required
                  />
                </div>
              )}
            </div>

            {/* Size (Auto or Manual) */}
            <div>
              <label className="label" htmlFor="size">Size (Optional)</label>
              <input
                id="size"
                name="size"
                type="text"
                value={formData.size}
                onChange={handleChange}
                className="input w-full"
                placeholder="e.g. 2.5 MB"
              />
            </div>

            {/* Submit */}
            <div className="flex justify-end pt-4">
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full md:w-auto min-w-[150px]"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Saving...
                  </>
                ) : 'Save Document'}
              </button>
            </div>

          </form>
        </div>
      </div>
    </>
  )
}
