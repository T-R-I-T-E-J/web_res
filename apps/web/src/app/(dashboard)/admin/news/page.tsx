'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { DashboardHeader } from '@/components/dashboard'
import { Plus, Edit, Trash, FileText, Loader2 } from 'lucide-react'
import clsx from 'clsx'

type NewsItem = {
  id: number
  title: string
  category: string
  status: string
  created_at: string
  view_count: number
}

const AdminNewsPage = () => {
  const [news, setNews] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<number | null>(null)
  const [deletingId, setDeletingId] = useState<number | null>(null)

  useEffect(() => {
    fetchNews()
  }, [])

  const fetchNews = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/news`, {
        credentials: 'include',
      })
      if (res.ok) {
        const json = await res.json()
        const items = json.data || json // Handle wrapped or unwrapped response
        
        if (Array.isArray(items)) {
          setNews(items)
        } else {
          console.error('Expected array but got:', json)
          setNews([])
        }
      }
    } catch (error) {
      console.error('Failed to fetch news:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteClick = (event: React.MouseEvent, id: number) => {
    event.preventDefault()
    event.stopPropagation()
    setItemToDelete(id)
    setDeleteModalOpen(true)
  }

  const confirmDelete = async () => {
    if (!itemToDelete) return

    setDeletingId(itemToDelete)
    setDeleteModalOpen(false) 
    
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/news/${itemToDelete}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      if (res.ok) {
        setNews((prev) => prev.filter(n => n.id !== itemToDelete))
        // Alert removed in favor of UI update, but kept if user prefers
        // alert('✅ News article deleted successfully')
      } else {
        const errorText = await res.text()
        console.error('❌ Delete failed:', res.status, errorText)
        alert(`❌ Failed to delete: ${res.status} - ${errorText}`)
      }
    } catch (error) {
      console.error('💥 Delete error:', error)
      alert(`💥 Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setDeletingId(null)
      setItemToDelete(null)
    }
  }

  return (
    <>
      <DashboardHeader
        title="News Management"
        subtitle="Create, edit, and publish news articles"
      />

      <div className="p-6">
        <div className="flex justify-end mb-6">
          <Link
            href="/admin/news/create"
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Create News
          </Link>
        </div>

        <div className="card overflow-hidden">
          {loading ? (
            <div className="flex justify-center p-8">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : news.length === 0 ? (
            <div className="text-center p-8 text-neutral-500">
              No news articles found. Create one to get started.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-neutral-50 border-b border-neutral-200">
                  <tr>
                    <th className="text-left py-3 px-4 font-semibold text-neutral-600 text-sm">Title</th>
                    <th className="text-left py-3 px-4 font-semibold text-neutral-600 text-sm">Category</th>
                    <th className="text-left py-3 px-4 font-semibold text-neutral-600 text-sm">Status</th>
                    <th className="text-left py-3 px-4 font-semibold text-neutral-600 text-sm">Created</th>
                    <th className="text-right py-3 px-4 font-semibold text-neutral-600 text-sm">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {news.map((item) => (
                    <tr key={item.id} className="hover:bg-neutral-50 transition-colors">
                      <td className="py-3 px-4">
                        <p className="font-medium text-neutral-700 clamp-1">{item.title}</p>
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                          {item.category}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={clsx(
                          'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                          item.status === 'published' ? 'bg-success/10 text-success' :
                          item.status === 'draft' ? 'bg-neutral-200 text-neutral-600' :
                          'bg-warning/10 text-warning'
                        )}>
                          {item.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-neutral-500">
                        {new Date(item.created_at).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/admin/news/${item.id}`}
                            className="p-1.5 text-neutral-500 hover:text-primary transition-colors rounded-md hover:bg-neutral-100"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>
                          
                          <button
                            type="button"
                            onClick={(e) => handleDeleteClick(e, item.id)}
                            disabled={deletingId === item.id}
                            className="p-1.5 text-neutral-500 hover:text-error transition-colors rounded-md hover:bg-neutral-100 disabled:opacity-50 disabled:cursor-not-allowed"
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

      {/* Custom Delete Confirmation Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 transform scale-100 animate-in zoom-in-95 duration-200">
            <h3 className="text-lg font-bold text-neutral-900 mb-2">Delete News Article?</h3>
            <p className="text-neutral-600 mb-6">
              Are you sure you want to delete this news article? This action cannot be undone and will remove it from the public site.
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
                Delete Article
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default AdminNewsPage
