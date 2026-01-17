'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { DashboardHeader } from '@/components/dashboard'
import { ArrowLeft, Loader2, Save, Plus, X, FileText } from 'lucide-react'
import { useDebounce } from '@/hooks/use-debounce'

export default function CreateNewsPage() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1'
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    category: 'NEWS',
    status: 'draft',
    featured_image_url: '',
    preview_image_url: '',
    documents: [] as { url: string; name: string }[],
    image_urls: [''] as string[],
    tags: '',
    is_featured: false,
    is_pinned: false
  })

  const debouncedTitle = useDebounce(formData.title, 500)
  const debouncedTags = useDebounce(formData.tags, 500)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target
    // Handle checkboxes
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value

    setFormData((prev) => ({
      ...prev,
      [name]: val,
    }))
  }

  const handleFeaturedImageUpload = async (file: File | undefined) => {
    if (!file) return;

    try {
      const uploadFormData = new FormData();
      uploadFormData.append('file', file);

      const res = await fetch(`${API_URL}/upload/file`, {
        method: 'POST',
        credentials: 'include',
        body: uploadFormData,
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Upload failed: ${res.status} ${errorText}`);
      }
      const responseJson = await res.json();
      const uploadedData = responseJson.data;

      if (!uploadedData?.file) throw new Error('Invalid server response');

      const apiBaseUrl = API_URL.startsWith('/') && typeof window !== 'undefined'
        ? window.location.origin
        : new URL(API_URL).origin;
      const fullUrl = `${apiBaseUrl}${uploadedData.file.url}`;

      setFormData((prev) => ({ ...prev, featured_image_url: fullUrl }));
    } catch (error) {
      console.error(error);
      alert('Failed to upload featured image');
    }
  };

  const handleDocumentUpload = async (file: File | undefined) => {
    if (!file) return;

    try {
      const uploadFormData = new FormData();
      uploadFormData.append('file', file);

      const res = await fetch(`${API_URL}/upload/file`, {
        method: 'POST',
        credentials: 'include',
        body: uploadFormData,
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Upload failed: ${res.status} ${errorText}`);
      }
      const responseJson = await res.json();
      const uploadedData = responseJson.data;

      if (!uploadedData?.file) throw new Error('Invalid server response');

      const apiBaseUrl = API_URL.startsWith('/') && typeof window !== 'undefined'
        ? window.location.origin
        : new URL(API_URL).origin;
      const fullUrl = `${apiBaseUrl}${uploadedData.file.url}`;

      setFormData((prev) => ({
        ...prev,
        documents: [...prev.documents, { url: fullUrl, name: file.name }]
      }));
    } catch (error) {
      console.error(error);
      alert('Failed to upload document');
    }
  };

  const handlePreviewImageUpload = async (file: File | undefined) => {
    if (!file) return;

    try {
      const uploadFormData = new FormData();
      uploadFormData.append('file', file);

      const res = await fetch(`${API_URL}/upload/file`, {
        method: 'POST',
        credentials: 'include',
        body: uploadFormData,
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Upload failed: ${res.status} ${errorText}`);
      }
      const responseJson = await res.json();
      const uploadedData = responseJson.data;

      if (!uploadedData?.file) throw new Error('Invalid server response');

      const apiBaseUrl = API_URL.startsWith('/') && typeof window !== 'undefined'
        ? window.location.origin
        : new URL(API_URL).origin;
      const fullUrl = `${apiBaseUrl}${uploadedData.file.url}`;

      setFormData((prev) => ({ ...prev, preview_image_url: fullUrl }));
    } catch (error) {
      console.error(error);
      alert('Failed to upload preview image');
    }
  };

  const removeDocument = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      documents: prev.documents.filter((_, i) => i !== index)
    }));
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const payload = {
        ...formData,
        tags: formData.tags.split(',').map((t) => t.trim()).filter(Boolean),
        image_urls: [],
        featured_image_url: formData.featured_image_url,
      }

      const res = await fetch(`${API_URL}/news`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (res.ok) {
        router.push('/admin/news')
        router.refresh()
      } else {
        const error = await res.json()
        alert(`Failed to create news: ${error.message || 'Unknown error'}`)
      }
    } catch (error) {
      console.error(error)
      alert('An error occurred while creating the news article.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <DashboardHeader title="Create News" subtitle="Add a new article" />
      <div className="p-6 max-w-4xl mx-auto">
        <Link
          href="/admin/news"
          className="flex items-center text-sm text-neutral-500 hover:text-primary mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to News
        </Link>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="card space-y-6">
            <h3 className="section-title text-lg border-b pb-2">Article Details</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-700">Title <span className="text-error">*</span></label>
                <input
                  type="text"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleChange}
                  className="input w-full"
                  placeholder="Enter article title"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-700">Category <span className="text-error">*</span></label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="input w-full"
                >
                  <option value="NEWS">News</option>
                  <option value="ANNOUNCEMENT">Announcement</option>
                  <option value="RESULT">Result</option>
                  <option value="ACHIEVEMENT">Achievement</option>
                  <option value="EVENT">Event</option>
                  <option value="PRESS_RELEASE">Press Release</option>
                </select>
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-neutral-700">Excerpt</label>
                <textarea
                  name="excerpt"
                  value={formData.excerpt}
                  onChange={handleChange}
                  className="input w-full h-20 resize-none"
                  placeholder="Short summary for list views"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-neutral-700">Content <span className="text-error">*</span></label>
                <textarea
                  name="content"
                  required
                  value={formData.content}
                  onChange={handleChange}
                  className="input w-full h-64 font-mono text-sm"
                  placeholder="Article content (Markdown supported)"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-neutral-700">Preview Image (Thumbnail)</label>
                <div className="flex flex-col gap-3">
                  {formData.preview_image_url ? (
                    <div className="relative mt-2 h-48 w-full md:w-1/2 overflow-hidden rounded-md border border-neutral-200 bg-neutral-50">
                      <img
                        src={formData.preview_image_url}
                        alt="Preview Thumbnail"
                        className="h-full w-full object-contain"
                      />
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, preview_image_url: '' }))}
                        className="absolute top-2 right-2 bg-white/80 p-1 rounded-full text-error hover:bg-white transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <label className="btn-secondary inline-flex items-center gap-2 cursor-pointer w-fit">
                      <Plus className="w-4 h-4" />
                      <span>Upload Thumbnail</span>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => {
                          handlePreviewImageUpload(e.target.files?.[0]);
                          e.target.value = ''; // Reset input
                        }}
                      />
                    </label>
                  )}
                  <p className="text-xs text-neutral-500">
                    This image will be displayed on the card in news lists. If not provided, the featured image will be used.
                  </p>
                </div>
              </div>


              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-neutral-700">Featured Image (Banner)</label>
                <div className="flex flex-col gap-3">
                  {formData.featured_image_url ? (
                    <div className="relative mt-2 h-48 w-full overflow-hidden rounded-md border border-neutral-200 bg-neutral-50">
                      <img
                        src={formData.featured_image_url}
                        alt="Featured Banner"
                        className="h-full w-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, featured_image_url: '' }))}
                        className="absolute top-2 right-2 bg-white/80 p-1 rounded-full text-error hover:bg-white transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <label className="btn-secondary inline-flex items-center gap-2 cursor-pointer w-fit">
                      <Plus className="w-4 h-4" />
                      <span>Upload Banner</span>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => {
                          handleFeaturedImageUpload(e.target.files?.[0]);
                          e.target.value = ''; // Reset input
                        }}
                      />
                    </label>
                  )}
                  <p className="text-xs text-neutral-500">
                    This is the main image shown at the top of the article.
                  </p>
                </div>
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-neutral-700">Related Documents</label>
                <div className="space-y-3">
                  {formData.documents.map((doc, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg border border-neutral-200">
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div className="w-10 h-10 bg-white rounded-md flex items-center justify-center border border-neutral-200 flex-shrink-0">
                          <FileText className="w-5 h-5 text-primary" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-sm truncate text-neutral-900">{doc.name}</p>
                          <a href={doc.url} target="_blank" rel="noreferrer" className="text-xs text-primary hover:underline truncate block">
                            View / Download
                          </a>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeDocument(index)}
                        className="text-neutral-400 hover:text-error p-1"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}

                  <div className="flex items-center gap-2">
                    <label className="btn-secondary flex items-center gap-2 cursor-pointer">
                      <Plus className="w-4 h-4" />
                      <span>Upload Document</span>
                      <input
                        type="file"
                        className="hidden"
                        accept=".pdf,.doc,.docx,.xls,.xlsx,.txt,.csv"
                        onChange={(e) => {
                          handleDocumentUpload(e.target.files?.[0]);
                          e.target.value = ''; // Reset input
                        }}
                      />
                    </label>
                  </div>
                </div>
                <p className="text-xs text-neutral-500 mt-1">
                  Attach relevant files like PDF results, docx reports, etc.
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-700">Tags</label>
                <input
                  type="text"
                  name="tags"
                  value={formData.tags}
                  onChange={handleChange}
                  className="input w-full"
                  placeholder="Comma separated tags (e.g. Rifle, Gold, 2025)"
                />
              </div>
            </div>

            <h3 className="section-title text-lg border-b pb-2 pt-4">Publishing Settings</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-700">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="input w-full"
                >
                  <option value="draft">Draft</option>
                  <option value="pending_review">Pending Review</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
              <div className="flex flex-col gap-4 mt-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="is_featured"
                    checked={formData.is_featured}
                    onChange={handleChange}
                    className="w-4 h-4 text-primary rounded border-neutral-300 focus:ring-primary"
                  />
                  <span className="text-sm font-medium text-neutral-700">Mark as Featured</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="is_pinned"
                    checked={formData.is_pinned}
                    onChange={handleChange}
                    className="w-4 h-4 text-primary rounded border-neutral-300 focus:ring-primary"
                  />
                  <span className="text-sm font-medium text-neutral-700">Pin to Top</span>
                </label>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Link href="/admin/news" className="btn-secondary">
              Cancel
            </Link>
            <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Create News
            </button>
          </div>
        </form>
      </div>
    </>
  )
}
