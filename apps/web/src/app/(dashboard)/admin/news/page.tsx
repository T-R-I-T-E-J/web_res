'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { DashboardHeader } from '@/components/dashboard'
import { Plus, Edit, Trash, FileText, Loader2 } from 'lucide-react'
import Cookies from 'js-cookie'
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

  useEffect(() => {
    fetchNews()
  }, [])

  const fetchNews = async () => {
    try {
      const token = Cookies.get('auth_token')
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/news`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
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

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this news article?')) return

    try {
      const token = Cookies.get('auth_token')
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/news/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      
      if (res.ok) {
        setNews(news.filter(n => n.id !== id))
      } else {
        alert('Failed to delete news item')
      }
    } catch (error) {
      console.error('Delete error:', error)
      alert('An error occurred')
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
                            onClick={() => handleDelete(item.id)}
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

export default AdminNewsPage
