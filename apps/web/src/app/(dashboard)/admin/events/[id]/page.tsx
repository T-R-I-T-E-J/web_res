'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { DashboardHeader } from '@/components/dashboard'
import { ArrowLeft, Loader2, Save, Plus, X } from 'lucide-react'

export default function EditEventPage() {
  const router = useRouter()
  const params = useParams()
  const eventId = params.id as string
  
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    start_date: '',
    end_date: '',
    status: 'upcoming',
    registration_link: '',
    circular_link: '',
    image_urls: [''] as string[],
    is_featured: false
  })

  useEffect(() => {
    fetchEvent()
  }, [eventId])

  const fetchEvent = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/events/${eventId}`, {
        credentials: 'include',
      })
      
      if (res.ok) {
        const json = await res.json()
        const event = json.data || json
        
        // Format dates for datetime-local input
        const formatDateForInput = (dateString: string) => {
          const date = new Date(dateString)
          return date.toISOString().slice(0, 16)
        }
        
        setFormData({
          title: event.title || '',
          description: event.description || '',
          location: event.location || '',
          start_date: formatDateForInput(event.start_date),
          end_date: formatDateForInput(event.end_date),
          status: event.status || 'upcoming',
          registration_link: event.registration_link || '',
          circular_link: event.circular_link || '',
          image_urls: Array.isArray(event.image_urls) && event.image_urls.length > 0 ? event.image_urls : [''],
          is_featured: event.is_featured || false
        })
      } else {
        alert('Failed to load event')
        router.push('/admin/events')
      }
    } catch (error) {
      console.error('Failed to fetch event:', error)
      alert('An error occurred')
      router.push('/admin/events')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    
    setFormData((prev) => ({
      ...prev,
      [name]: val,
    }))
  }

  const handleImageUrlChange = (index: number, value: string) => {
    const newImageUrls = [...formData.image_urls]
    newImageUrls[index] = value
    setFormData((prev) => ({ ...prev, image_urls: newImageUrls }))
  }

  const addImageUrl = () => {
    setFormData((prev) => ({ ...prev, image_urls: [...prev.image_urls, ''] }))
  }

  const removeImageUrl = (index: number) => {
    if (formData.image_urls.length > 1) {
      const newImageUrls = formData.image_urls.filter((_, i) => i !== index)
      setFormData((prev) => ({ ...prev, image_urls: newImageUrls }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate required date fields
    if (!formData.start_date || !formData.end_date) {
      alert('Please fill in both start date and end date')
      return
    }

    // Validate dates are valid
    const startDate = new Date(formData.start_date)
    const endDate = new Date(formData.end_date)
    
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      alert('Please enter valid dates')
      return
    }

    if (endDate < startDate) {
      alert('End date must be after start date')
      return
    }

    setSaving(true)

    try {
      
      // Transform the form data to match API requirements
      const payload: any = {
        title: formData.title,
        location: formData.location,
        status: formData.status,
        is_featured: formData.is_featured,
        // Convert datetime-local to ISO 8601 format
        start_date: startDate.toISOString(),
        end_date: endDate.toISOString(),
      }

      // Only include optional fields if they have values
      if (formData.description) {
        payload.description = formData.description
      }
      if (formData.registration_link && formData.registration_link.trim()) {
        payload.registration_link = formData.registration_link.trim()
      }
      if (formData.circular_link && formData.circular_link.trim()) {
        payload.circular_link = formData.circular_link.trim()
      }
      if (formData.image_urls && formData.image_urls.length > 0) {
        payload.image_urls = formData.image_urls.filter((url) => url.trim() !== '')
      }

      // console.log('Updating event payload:', payload)
      
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/events/${eventId}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (res.ok) {
        router.push('/admin/events')
        router.refresh()
      } else {
        const error = await res.json()
        console.error('API Error:', error)
        alert(`Failed to update event: ${JSON.stringify(error.message || error)}`)
      }
    } catch (error) {
      console.error('Submit error:', error)
      alert('An error occurred while updating the event.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <>
        <DashboardHeader title="Edit Event" subtitle="Loading..." />
        <div className="p-6 flex justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </>
    )
  }

  return (
    <>
      <DashboardHeader title="Edit Event" subtitle="Update event details" />
      <div className="p-6 max-w-4xl mx-auto">
        <Link
          href="/admin/events"
          className="flex items-center text-sm text-neutral-500 hover:text-primary mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to Events
        </Link>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="card space-y-6">
            <h3 className="section-title text-lg border-b pb-2">Event Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-neutral-700">Title <span className="text-error">*</span></label>
                <input
                  type="text"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleChange}
                  className="input w-full"
                  placeholder="Enter event title"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-neutral-700">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="input w-full h-32 resize-none"
                  placeholder="Event description"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-700">Location <span className="text-error">*</span></label>
                <input
                  type="text"
                  name="location"
                  required
                  value={formData.location}
                  onChange={handleChange}
                  className="input w-full"
                  placeholder="Event location"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-700">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="input w-full"
                >
                  <option value="upcoming">Upcoming</option>
                  <option value="ongoing">Ongoing</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-700">Start Date <span className="text-error">*</span></label>
                <input
                  type="datetime-local"
                  name="start_date"
                  required
                  value={formData.start_date}
                  onChange={handleChange}
                  className="input w-full"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-700">End Date <span className="text-error">*</span></label>
                <input
                  type="datetime-local"
                  name="end_date"
                  required
                  value={formData.end_date}
                  onChange={handleChange}
                  className="input w-full"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-700">Registration Link</label>
                <input
                  type="url"
                  name="registration_link"
                  value={formData.registration_link}
                  onChange={handleChange}
                  className="input w-full"
                  placeholder="https://example.com/register"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-700">Circular Link</label>
                <input
                  type="url"
                  name="circular_link"
                  value={formData.circular_link}
                  onChange={handleChange}
                  className="input w-full"
                  placeholder="https://example.com/circular.pdf"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-neutral-700">Image URLs</label>
                <div className="space-y-3">
                  {formData.image_urls.map((url, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="url"
                        value={url}
                        onChange={(e) => handleImageUrlChange(index, e.target.value)}
                        className="input w-full"
                        placeholder={`Image URL ${index + 1} (e.g., https://example.com/image.jpg)`}
                      />
                      {formData.image_urls.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeImageUrl(index)}
                          className="btn-secondary px-3"
                          title="Remove URL"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addImageUrl}
                    className="btn-secondary flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add Another Image URL
                  </button>
                </div>
                <p className="text-xs text-neutral-500 mt-1">
                  Add multiple image URLs. The first image will be used as the featured image.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-4">
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
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Link href="/admin/events" className="btn-secondary">
              Cancel
            </Link>
            <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Update Event
            </button>
          </div>
        </form>
      </div>
    </>
  )
}
