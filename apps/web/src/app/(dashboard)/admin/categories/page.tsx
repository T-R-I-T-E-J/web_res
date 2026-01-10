'use client'

import { useState, useEffect } from 'react'
import { DashboardHeader } from '@/components/dashboard'
import { Plus, Trash2, Tag, Loader2, Edit2 } from 'lucide-react'

type Category = {
  id: string
  name: string
  slug: string
  page: string
  order: number
  isActive: boolean
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  
  const [newCat, setNewCat] = useState({
    name: '',
    slug: '',
    page: 'policies',
    order: 0,
  })

  // Edit mode
  const [editingId, setEditingId] = useState<string | null>(null)

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1'
      const res = await fetch(`${API_URL}/categories`, { credentials: 'include' })
      if (res.ok) {
        const data = await res.json()
        // Handle both wrapped ({data: []}) and unwrapped ([]) responses
        const categoriesArray = Array.isArray(data) ? data : (data.data || [])
        setCategories(categoriesArray)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure? This might affect documents using this category.')) return

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1'
      const res = await fetch(`${API_URL}/categories/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      })
      if (res.ok) {
        setCategories(prev => prev.filter(c => c.id !== id))
      } else {
        alert('Failed to delete')
      }
    } catch(e) { console.error(e) }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1'
      const url = editingId ? `${API_URL}/categories/${editingId}` : `${API_URL}/categories`
      const method = editingId ? 'PATCH' : 'POST'
      
      const payload = {
        ...newCat,
        slug: newCat.slug || newCat.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '')
      }

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload)
      })

      if (res.ok) {
        await fetchCategories()
        setNewCat({ name: '', slug: '', page: 'policies', order: 0 })
        setEditingId(null)
      } else {
        alert('Failed to save')
      }
    } catch(e) {
      console.error(e)
    } finally {
      setSubmitting(false)
    }
  }

  const startEdit = (cat: Category) => {
    setEditingId(cat.id)
    setNewCat({
      name: cat.name,
      slug: cat.slug,
      page: cat.page,
      order: cat.order
    })
  }

  const cancelEdit = () => {
    setEditingId(null)
    setNewCat({ name: '', slug: '', page: 'policies', order: 0 })
  }

  return (
    <>
      <DashboardHeader 
        title="Category Management" 
        subtitle="Manage document categories dynamically." 
      />

      <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Form */}
        <div className="card h-fit">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            {editingId ? <Edit2 className="w-4 h-4"/> : <Plus className="w-4 h-4"/>}
            {editingId ? 'Edit Category' : 'Add New Category'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Name</label>
              <input 
                className="input w-full" 
                value={newCat.name}
                onChange={e => setNewCat({...newCat, name: e.target.value})}
                required
                placeholder="e.g. Selection Policy Japan"
              />
            </div>
            
            <div>
              <label className="label">Slug (Optional)</label>
              <input 
                className="input w-full" 
                value={newCat.slug}
                onChange={e => setNewCat({...newCat, slug: e.target.value})}
                placeholder="Auto-generated if empty"
              />
            </div>

            <div>
              <label className="label">Page Scope</label>
              <select 
                className="input w-full"
                value={newCat.page}
                onChange={e => setNewCat({...newCat, page: e.target.value})}
              >
                <option value="policies">Policies</option>
                <option value="classification">Classification</option>
                <option value="results">Results</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="label">Order</label>
              <input 
                type="number"
                className="input w-full" 
                value={newCat.order}
                onChange={e => setNewCat({...newCat, order: parseInt(e.target.value) || 0})}
              />
            </div>

            <div className="flex gap-2">
              <button 
                type="submit" 
                disabled={submitting} 
                className="btn-primary flex-1"
              >
                {submitting ? 'Saving...' : (editingId ? 'Update' : 'Create')}
              </button>
              {editingId && (
                <button type="button" onClick={cancelEdit} className="btn-secondary">
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* List */}
        <div className="lg:col-span-2">
           <div className="card">
             <div className="overflow-x-auto">
               <table className="w-full text-left text-sm">
                 <thead className="border-b bg-neutral-50">
                   <tr>
                     <th className="p-3 font-semibold">Order</th>
                     <th className="p-3 font-semibold">Name</th>
                     <th className="p-3 font-semibold">Slug</th>
                     <th className="p-3 font-semibold">Page</th>
                     <th className="p-3 font-semibold text-right">Actions</th>
                   </tr>
                 </thead>
                 <tbody>
                   {loading ? (
                     <tr><td colSpan={5} className="p-4 text-center">Loading...</td></tr>
                   ) : categories.map(cat => (
                     <tr key={cat.id} className="border-b hover:bg-neutral-50/50">
                       <td className="p-3">{cat.order}</td>
                       <td className="p-3 font-medium">{cat.name}</td>
                       <td className="p-3 text-neutral-500">{cat.slug}</td>
                       <td className="p-3"><span className="badge badge-neutral">{cat.page}</span></td>
                       <td className="p-3 text-right space-x-2">
                         <button 
                           onClick={() => startEdit(cat)}
                           className="p-2 hover:bg-primary/10 text-primary rounded"
                         >
                           <Edit2 className="w-4 h-4" />
                         </button>
                         <button 
                           onClick={() => handleDelete(cat.id)}
                           className="p-2 hover:bg-red-50 text-red-500 rounded"
                         >
                           <Trash2 className="w-4 h-4" />
                         </button>
                       </td>
                     </tr>
                   ))}
                 </tbody>
               </table>
             </div>
           </div>
        </div>

      </div>
    </>
  )
}
