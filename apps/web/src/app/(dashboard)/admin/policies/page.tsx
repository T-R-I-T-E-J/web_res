'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { DashboardHeader } from '@/components/dashboard'
import { Plus, Edit, Trash, FileText, Loader2, Download } from 'lucide-react'
import clsx from 'clsx'

type PolicyItem = {
  id: string
  title: string
  category: string
  fileType: string
  size: string
  href: string
  createdAt: string
  isActive: boolean
}

const AdminPoliciesPage = () => {
  const [items, setItems] = useState<PolicyItem[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => {
    fetchPolicies()
  }, [])

  const fetchPolicies = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/downloads`, {
        credentials: 'include', // Send cookies with request
      })
      if (res.ok) {
        const json = await res.json()
        const data = Array.isArray(json) ? json : (json.data || [])
        // Filter OUT any classification related category
        const policies = data.filter((item: PolicyItem) => 
          !['classification', 'medical_classification', 'ipc_license', 'national_classification'].includes(item.category)
        )
        setItems(policies)
      }
    } catch (error) {
      console.error('Failed to fetch policies:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteClick = (event: React.MouseEvent, id: string) => {
    event.preventDefault()
    event.stopPropagation()
    setItemToDelete(id)
    setDeleteModalOpen(true)
  }

  const confirmDelete = async () => {
    if (!itemToDelete) return

    setDeletingId(itemToDelete)
    setDeleteModalOpen(false) // Close modal immediately to show loading state on row
    
    try {
      const baseUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1').replace(/\/$/, '')
      const apiUrl = `${baseUrl}/downloads/${itemToDelete}`
      
      const res = await fetch(apiUrl, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      if (res.ok) {
        setItems((currentItems) => currentItems.filter(item => item.id !== itemToDelete))
        // Success toast could go here
      } else {
        const errorText = await res.text()
        console.error('Delete failed:', res.status, errorText)
        alert(`Failed to delete: ${res.status}`)
      }
    } catch (error) {
      console.error('Delete error:', error)
      alert(`An error occurred: ${(error as Error).message}`)
    } finally {
      setDeletingId(null)
      setItemToDelete(null)
    }
  }

  return (
    <>
      <DashboardHeader
        title="Policies"
        subtitle="Manage official policies, rules, and selection criteria"
      />

      <div className="p-6">
        <div className="flex justify-end mb-6">
          <Link
            href="/admin/policies/create"
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
                    <th className="text-left py-3 px-4 font-semibold text-neutral-600 text-sm">Status</th>
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
                        <span
                          className={clsx(
                            'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize',
                            item.isActive
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          )}
                        >
                          {item.isActive ? 'Published' : 'Draft'}
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
                          <Link
                            href={`/admin/policies/${item.id}/edit`}
                            className="p-1.5 text-neutral-500 hover:text-primary transition-colors rounded-md hover:bg-neutral-100"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>
                          <button
                            type="button"
                            onClick={(e) => handleDeleteClick(e, item.id)}
                            disabled={deletingId === item.id}
                            className="p-1.5 text-neutral-500 hover:text-red-600 transition-colors rounded-md hover:bg-neutral-100 disabled:opacity-50"
                            title="Delete"
                          >
                            {deletingId === item.id ? (
                              <Loader2 className="w-4 h-4 animate-spin pointer-events-none" />
                            ) : (
                              <Trash className="w-4 h-4 pointer-events-none" />
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

      {/* Custom Delete Confirmation Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 transform scale-100 animate-in zoom-in-95 duration-200">
            <h3 className="text-lg font-bold text-neutral-900 mb-2">Delete Policy Document?</h3>
            <p className="text-neutral-600 mb-6">
              Are you sure you want to delete this document? This action cannot be undone and will remove it from the public site.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-md transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors shadow-sm"
              >
                Delete Document
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default AdminPoliciesPage
