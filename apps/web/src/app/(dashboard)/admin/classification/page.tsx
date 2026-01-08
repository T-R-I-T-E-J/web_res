'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { DashboardHeader } from '@/components/dashboard'
import { Plus, Edit, Trash, FileText, Loader2, Download } from 'lucide-react'
import Cookies from 'js-cookie'
import clsx from 'clsx'

type ClassificationItem = {
  id: string
  title: string
  category: string
  fileType: string
  size: string
  href: string
  createdAt: string
  isActive: boolean
}

const AdminClassificationPage = () => {
  const [items, setItems] = useState<ClassificationItem[]>([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => {
    fetchClassification()
  }, [])

  const fetchClassification = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/downloads`, {
        credentials: 'include', // Use HttpOnly cookie
      })
      if (res.ok) {
        const json = await res.json()
        const data = Array.isArray(json) ? json : (json.data || [])
        // Filter for any classification related category
        const classItems = data.filter((item: ClassificationItem) => 
          ['classification', 'medical_classification', 'ipc_license', 'national_classification'].includes(item.category)
        )
        setItems(classItems)
      }
    } catch (error) {
      console.error('Failed to fetch classification:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (event: React.MouseEvent, id: string) => {
    event.stopPropagation()
    
    if (!id) {
      alert('Error: Missing ID')
      return
    }

    if (typeof window !== 'undefined' && !window.confirm('Are you sure you want to delete this document?')) {
      return
    }

    setDeletingId(id)
    
    try {
      // Ensure URL is valid
      const baseUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1').replace(/\/$/, '')
      const apiUrl = `${baseUrl}/downloads/${id}`
      
      const res = await fetch(apiUrl, {
        method: 'DELETE',
        credentials: 'include', // Send cookies with request
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      if (res.ok) {
        setItems((prev) => prev.filter(item => item.id !== id))
        alert('Document deleted successfully')
      } else {
        const errorText = await res.text()
        console.error('Delete failed:', res.status, errorText)
        alert(`Failed to delete: ${res.status}`)
      }
    } catch (error) {
      console.error('Delete error:', error)
      alert('An error occurred while deleting')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <>
      <DashboardHeader
        title="Classification"
        subtitle="Manage shooter classification documents and guidelines"
      />

      <div className="p-6">
        <div className="flex justify-end mb-6">
          <Link
            href="/admin/classification/create"
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Document
          </Link>
        </div>

        <div className="card overflow-hidden">
          {loading ? (
            <div className="flex justify-center p-8">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : items.length === 0 ? (
            <div className="text-center p-8 text-neutral-500">
              No documents found. Add one to get started.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-neutral-50 border-b border-neutral-200">
                  <tr>
                    <th className="text-left py-3 px-4 font-semibold text-neutral-600 text-sm">Title</th>
                    <th className="text-left py-3 px-4 font-semibold text-neutral-600 text-sm">Category</th>
                    <th className="text-left py-3 px-4 font-semibold text-neutral-600 text-sm">Type</th>
                    <th className="text-left py-3 px-4 font-semibold text-neutral-600 text-sm">Created</th>
                    <th className="text-right py-3 px-4 font-semibold text-neutral-600 text-sm">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {items.map((item) => (
                    <tr key={item.id} className="hover:bg-neutral-50 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center text-primary">
                            <FileText className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="font-medium text-neutral-700">{item.title}</p>
                            {item.size && <p className="text-xs text-neutral-500">{item.size}</p>}
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-neutral-100 text-neutral-700 capitalize">
                          {item.category}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-sm text-neutral-600 uppercase font-medium">
                          {item.fileType}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-neutral-500">
                        {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : '-'}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <a
                            href={item.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 text-neutral-500 hover:text-primary transition-colors rounded-md hover:bg-neutral-100"
                            title="Download/View"
                          >
                            <Download className="w-4 h-4" />
                          </a>
                          <button
                            type="button"
                            onClick={(e) => handleDelete(e, item.id)}
                            disabled={deletingId === item.id}
                            className="p-1.5 text-neutral-500 hover:text-red-600 transition-colors rounded-md hover:bg-neutral-100 disabled:opacity-50"
                            title="Delete"
                          >
                            {deletingId === item.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Trash className="w-4 h-4" />
                            )}
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

export default AdminClassificationPage
