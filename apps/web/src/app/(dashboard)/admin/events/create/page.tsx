'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { DashboardHeader } from '@/components/dashboard'
import { ArrowLeft, Loader2, Save } from 'lucide-react'
import Cookies from 'js-cookie'

export default function CreateEventPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    start_date: '',
    end_date: '',
    status: 'upcoming',
    registration_link: '',
    circular_link: '',
    is_featured: false
  })

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const token = Cookies.get('auth_token')
      
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/events`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        router.push('/admin/events')
        router.refresh()
      } else {
        const error = await res.json()
        alert(`Failed to create event: ${error.message || 'Unknown error'}`)
      }
    } catch (error) {
      console.error(error)
      alert('An error occurred while creating the event.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <DashboardHeader title="Create Event" subtitle="Add a new event" />
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
            <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Create Event
            </button>
          </div>
        </form>
      </div>
    </>
  )
}
