'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { DashboardHeader } from '@/components/dashboard'
import { ArrowLeft, Loader2, Upload as UploadIcon, Link as LinkIcon, FileText } from 'lucide-react'
import clsx from 'clsx'

export default function EditPolicyPage() {
  const router = useRouter()
  const params = useParams()
  const id = params?.id as string

  const [loading, setLoading] = useState(false)
  const [dataLoading, setDataLoading] = useState(true)
  const [uploadType, setUploadType] = useState<'file' | 'url'>('file')
  const [file, setFile] = useState<File | null>(null)
  const [dataLoaded, setDataLoaded] = useState(false)
  
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([])

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    categoryId: '',
    fileType: 'PDF',
    size: '',
    href: '',
    status: 'published',
  })
  
  useEffect(() => {
    // Prevent re-running if data has already been loaded
    if (dataLoaded || !id) return
    
    const init = async () => {
      setDataLoading(true)
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1'
      
      try {
        // 1. Fetch Categories
        const catRes = await fetch(`${apiUrl}/categories?page=policies`, { credentials: 'include' })
        if (catRes.ok) {
          const data = await catRes.json()
          // Handle both wrapped ({data: []}) and unwrapped ([]) responses
          const categoriesArray = Array.isArray(data) ? data : (data.data || [])
          setCategories(categoriesArray)
        }
        
        // 2. Fetch Document
        const res = await fetch(`${apiUrl}/downloads/${id}`, { credentials: 'include' })
        if (res.ok) {
          const response = await res.json()
          const data = response.data || response // Handle wrapped response
          
          setFormData({
            title: data.title || '',
            description: data.description || '',
            categoryId: data.categoryId || '', // Use categoryId
            fileType: data.fileType || 'PDF',
            size: data.size || '',
            href: data.href || '',
            status: data.isActive ? 'published' : 'draft',
          })
          
          if (data.href && data.href.startsWith('http')) {
            setUploadType('url')
          } else {
            setUploadType('file')
          }
          
          setDataLoaded(true)
        } else {
          alert("Failed to load document")
          router.push('/admin/policies')
        }
      } catch (e) {
        console.error("Initialization error", e)
      } finally {
        setDataLoading(false)
      }
    }
    
    init()
  }, [id, router, dataLoaded])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]
      const MAX_SIZE_BYTES = 10 * 1024 * 1024; // 10MB
      if (selectedFile.size > MAX_SIZE_BYTES) {
        alert('File size exceeds 10MB limit.');
        e.target.value = '';
        setFile(null);
        return;
      }

      setFile(selectedFile)
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

  const uploadDocument = async (apiUrl: string) => {
    if (!file) return null;
    
    const uploadFormData = new FormData()
    uploadFormData.append('document', file)

    const uploadRes = await fetch(`${apiUrl}/upload/document`, {
      method: 'POST',
      credentials: 'include',
      body: uploadFormData
    })

    if (!uploadRes.ok) throw new Error('File upload failed')
    
    const uploadJson = await uploadRes.json()
    let filename: string | undefined = uploadJson.data?.file?.filename || uploadJson.file?.filename
    
    if (!filename) throw new Error('Upload successful but filename missing')
    return `/uploads/documents/${filename}`;
  }

  const updateDownloadEntry = async (finalHref: string, apiUrl: string) => {
      // payload
      const payload = {
        title: formData.title,
        description: formData.description,
        fileType: formData.fileType,
        size: formData.size,
        href: finalHref,
        categoryId: formData.categoryId,
        isActive: formData.status === 'published'
      }

      const res = await fetch(`${apiUrl}/downloads/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload)
      })

      if (res.ok) {
        alert('Document updated successfully!')
        router.push('/admin/policies')
      } else {
        const error = await res.text()
        alert(`Failed to update: ${error}`)
      }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1'
      let finalHref = formData.href

      // Upload if new file
      if (uploadType === 'file' && file) {
        const uploadedPath = await uploadDocument(apiUrl);
        if (uploadedPath) finalHref = uploadedPath;
      }

      await updateDownloadEntry(finalHref, apiUrl);

    } catch (error) {
      console.error('Error updating document:', error)
      alert(error instanceof Error ? error.message : 'An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  if (dataLoading) {
      return (
          <div className="flex items-center justify-center min-h-[400px]">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
      )
  }

  return (
    <>
      <DashboardHeader
        title="Edit Document"
        subtitle="Update document details or file"
      />

      <div className="p-6 max-w-2xl">
        <Link
          href="/admin/policies"
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
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Category */}
              <div>
                <label className="label" htmlFor="categoryId">Category</label>
                <div className="space-y-3">
                  <select
                    id="categoryId"
                    name="categoryId"
                    value={formData.categoryId}
                    onChange={handleChange}
                    className="input w-full"
                    required
                  >
                    <option value="">Select a category</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
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
                />
              </div>

              {/* Status */}
              <div>
                <label className="label" htmlFor="status">Status</label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="input w-full"
                >
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                  <option value="review">Final Review</option>
                </select>
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
                   {formData.href && !file && !formData.href.startsWith('http') && (
                        <div className="mb-2 text-sm text-neutral-600 flex items-center gap-2">
                            <FileText className="w-4 h-4"/>
                            Current File: {formData.href.split('/').pop()}
                        </div>
                   )}
                  <input
                    type="file"
                    onChange={handleFileChange}
                    className="input w-full p-2"
                    accept=".pdf,.doc,.docx,.xls,.xlsx"
                  />
                  <p className="text-xs text-neutral-500 mt-1">
                     {file ? 'New file selected' : 'Leave empty to keep current file'} (Max 10MB)
                  </p>
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

            {/* Size */}
            <div>
              <label className="label" htmlFor="size">Size (Optional)</label>
              <input
                id="size"
                name="size"
                type="text"
                value={formData.size}
                onChange={handleChange}
                className="input w-full"
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
                ) : 'Update Document'}
              </button>
            </div>

          </form>
        </div>
      </div>
    </>
  )
}
