'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { DashboardHeader } from '@/components/dashboard'
import { Plus, Edit, Trash, Calendar, Loader2 } from 'lucide-react'
import Cookies from 'js-cookie'
import clsx from 'clsx'

type EventItem = {
  id: number
  title: string
  location: string
  start_date: string
  end_date: string
  status: string
  created_at: string
}

const AdminEventsPage = () => {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1'
  const [events, setEvents] = useState<EventItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    try {
      const token = Cookies.get('auth_token')
      const res = await fetch(`${API_URL}/events`, {
        credentials: 'include',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      if (res.ok) {
        const json = await res.json()
        const items = json.data || json
        if (Array.isArray(items)) {
          setEvents(items)
        } else {
          console.error('Expected array but got:', json)
          setEvents([])
        }
      }
    } catch (error) {
      console.error('Failed to fetch events:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this event?')) return

    try {
      const token = Cookies.get('auth_token')
      const res = await fetch(`${API_URL}/events/${id}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      
      if (res.ok) {
        setEvents(events.filter(e => e.id !== id))
      } else {
        alert('Failed to delete event')
      }
    } catch (error) {
      console.error('Delete error:', error)
      alert('An error occurred')
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  return (
    <>
      <DashboardHeader
        title="Events Management"
        subtitle="Create, edit, and manage events"
      />

      <div className="p-6">
        <div className="flex justify-end mb-6">
          <Link
            href="/admin/events/create"
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Create Event
          </Link>
        </div>

        <div className="card overflow-hidden">
          {loading ? (
            <div className="flex justify-center p-8">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : events.length === 0 ? (
            <div className="text-center p-8 text-neutral-500">
              No events found. Create one to get started.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-neutral-50 border-b border-neutral-200">
                  <tr>
                    <th className="text-left py-3 px-4 font-semibold text-neutral-600 text-sm">Title</th>
                    <th className="text-left py-3 px-4 font-semibold text-neutral-600 text-sm">Location</th>
                    <th className="text-left py-3 px-4 font-semibold text-neutral-600 text-sm">Start Date</th>
                    <th className="text-left py-3 px-4 font-semibold text-neutral-600 text-sm">Status</th>
                    <th className="text-right py-3 px-4 font-semibold text-neutral-600 text-sm">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {events.map((event) => (
                    <tr key={event.id} className="hover:bg-neutral-50 transition-colors">
                      <td className="py-3 px-4">
                        <p className="font-medium text-neutral-700 clamp-1">{event.title}</p>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-sm text-neutral-600">{event.location}</span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1 text-sm text-neutral-600">
                          <Calendar className="w-3 h-3" />
                          {formatDate(event.start_date)}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={clsx(
                          'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                          event.status === 'upcoming' ? 'bg-primary/10 text-primary' :
                          event.status === 'ongoing' ? 'bg-success/10 text-success' :
                          'bg-neutral-200 text-neutral-600'
                        )}>
                          {event.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/admin/events/${event.id}`}
                            className="p-1.5 text-neutral-500 hover:text-primary transition-colors rounded-md hover:bg-neutral-100"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleDelete(event.id)}
                            className="p-1.5 text-neutral-500 hover:text-error transition-colors rounded-md hover:bg-neutral-100"
                            title="Delete"
                          >
                            <Trash className="w-4 h-4" />
                          </button>
                        </div>
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

export default AdminEventsPage
