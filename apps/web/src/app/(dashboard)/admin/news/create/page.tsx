'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { DashboardHeader } from '@/components/dashboard'
import { ArrowLeft, Loader2, Save } from 'lucide-react'
import Cookies from 'js-cookie'

export default function CreateNewsPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    category: 'NEWS',
    status: 'draft',
    featured_image_url: '',
    tags: '',
    is_featured: false,
    is_pinned: false
  })

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const token = Cookies.get('auth_token')
      const payload = {
        ...formData,
        tags: formData.tags.split(',').map((t) => t.trim()).filter(Boolean),
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/news`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
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
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-700">Featured Image URL</label>
                <input
                  type="url"
                  name="featured_image_url"
                  value={formData.featured_image_url}
                  onChange={handleChange}
                  className="input w-full"
                  placeholder="https://example.com/image.jpg"
                />
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
