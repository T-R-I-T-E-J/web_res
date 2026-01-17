'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Cookies from 'js-cookie'
import { DashboardHeader } from '@/components/dashboard'
import {
  Search, Filter, Download, Plus, MoreVertical, CheckCircle,
  XCircle, Clock, Eye, Edit, Trash2, Mail
} from 'lucide-react'
import clsx from 'clsx'
import { format } from 'date-fns'

interface User {
  id: number
  first_name: string
  last_name: string
  email: string
  created_at: string
  is_active: boolean
  user_roles: { role: { name: string } }[]
  // Add other fields as needed
}

const AdminUsersPage = () => {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedUsers, setSelectedUsers] = useState<number[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [roleFilter, setRoleFilter] = useState('all')

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const token = Cookies.get('auth_token')
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1'
      
      const params = new URLSearchParams()
      if (searchQuery) params.append('search', searchQuery)
      if (statusFilter === 'active') params.append('is_active', 'true')
      if (statusFilter === 'suspended') params.append('is_active', 'false')
      if (roleFilter !== 'all') params.append('role', roleFilter.toLowerCase())
      params.append('limit', '50') // Fetch reasonable amount

      const res = await fetch(`${API_URL}/users?${params.toString()}`, {
        credentials: 'include',
        headers: { Authorization: `Bearer ${token}` }
      })

      if (res.ok) {
        const json = await res.json()
        // Handle nested data structure from TransformInterceptor + Pagination
        const userData = json.data?.data || json.data || []
        setUsers(Array.isArray(userData) ? userData : [])
      } else {
        setUsers([])
        console.error('Failed to fetch users')
      }
    } catch (error) {
      console.error('Error fetching users:', error)
      setUsers([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchUsers()
    }, 800) // Debounce search
    return () => clearTimeout(timeoutId)
  }, [searchQuery, statusFilter, roleFilter])

  const handleSelectAll = () => {
    if (selectedUsers.length === users.length) {
      setSelectedUsers([])
    } else {
      setSelectedUsers(users.map((u) => u.id))
    }
  }

  const handleSelectUser = (id: number) => {
    if (selectedUsers.includes(id)) {
      setSelectedUsers(selectedUsers.filter((uid) => uid !== id))
    } else {
      setSelectedUsers([...selectedUsers, id])
    }
  }

  const getRoleBadgeColor = (role: string) => {
    switch (role.toLowerCase()) {
      case 'admin': return 'bg-primary/10 text-primary'
      case 'coach': return 'bg-interactive/10 text-interactive'
      default: return 'bg-neutral-100 text-neutral-600'
    }
  }

  return (
    <>
      <DashboardHeader
        title="User Management"
        subtitle="Manage shooters, coaches, and administrators"
      />

      <div className="p-6 space-y-6">
        {/* Filters & Actions */}
        <div className="card">
          <div className="flex flex-col lg:flex-row justify-between gap-4">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                <input
                  type="search"
                  placeholder="Search by name or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input pl-12"
                />
              </div>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="input w-auto"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="suspended">Suspended</option>
              </select>

              {/* Role Filter */}
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="input w-auto"
              >
                <option value="all">All Roles</option>
                <option value="Shooter">Shooters</option>
                <option value="Coach">Coaches</option>
                <option value="Admin">Admins</option>
              </select>
            </div>

            <div className="flex gap-2">
              <button className="btn-outline gap-2">
                <Download className="w-4 h-4" />
                Export
              </button>
              <Link href="/admin/users/new" className="btn-primary gap-2">
                <Plus className="w-4 h-4" />
                Add User
              </Link>
            </div>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedUsers.length > 0 && (
          <div className="card bg-primary/5 border-primary/20">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-primary">
                {selectedUsers.length} users selected
              </span>
              <div className="flex gap-2">
                <button className="btn-ghost text-sm py-2 gap-1">
                  <Mail className="w-4 h-4" />
                  Email
                </button>
                <button className="btn-ghost text-sm py-2 gap-1 text-success">
                  <CheckCircle className="w-4 h-4" />
                  Approve
                </button>
                <button className="btn-ghost text-sm py-2 gap-1 text-error">
                  <XCircle className="w-4 h-4" />
                  Suspend
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Users Table */}
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th className="w-12">
                    <input
                      type="checkbox"
                      checked={selectedUsers.length === users.length && users.length > 0}
                      onChange={handleSelectAll}
                      className="w-4 h-4 rounded border-neutral-300"
                    />
                  </th>
                  <th>User</th>
                  <th>State</th>
                  <th>Classification</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Joined</th>
                  <th className="w-20">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                   <tr><td colSpan={8} className="text-center py-8 text-neutral-500">Loading users...</td></tr>
                ) : users.length === 0 ? (
                   <tr><td colSpan={8} className="text-center py-8 text-neutral-500">No users found.</td></tr>
                ) : (
                  users.map((user) => {
                    const roleName = user.user_roles?.[0]?.role?.name || 'User';
                    const fullName = `${user.first_name} ${user.last_name}`;
                    const initials = (user.first_name[0] || '') + (user.last_name[0] || '');

                    return (
                      <tr key={user.id}>
                        <td>
                          <input
                            type="checkbox"
                            checked={selectedUsers.includes(user.id)}
                            onChange={() => handleSelectUser(user.id)}
                            className="w-4 h-4 rounded border-neutral-300"
                          />
                        </td>
                        <td>
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-neutral-100 rounded-full flex items-center justify-center">
                              <span className="text-xs font-medium text-neutral-500">
                                {initials.toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <Link
                                href={`/admin/users/${user.id}`}
                                className="font-medium text-neutral-700 hover:text-primary"
                              >
                                {fullName}
                              </Link>
                              <p className="text-xs text-neutral-500">{user.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="text-neutral-600">-</td> 
                        <td><span className="text-neutral-400">-</span></td>
                        <td>
                          <span className={clsx(
                            'badge capitalize',
                            getRoleBadgeColor(roleName)
                          )}>
                            {roleName}
                          </span>
                        </td>
                        <td>
                          <span className={clsx(
                            'badge',
                            user.is_active ? 'badge-success' : 'badge-error'
                          )}>
                            {user.is_active ? <CheckCircle className="w-3 h-3 mr-1" /> : <XCircle className="w-3 h-3 mr-1" />}
                            {user.is_active ? 'Active' : 'Suspended'}
                          </span>
                        </td>
                        <td className="text-neutral-500 text-sm">
                          {user.created_at ? new Date(user.created_at).toLocaleDateString() : '-'}
                        </td>
                        <td>
                          <div className="flex items-center gap-1">
                            <Link
                              href={`/admin/users/${user.id}`}
                              className="p-1.5 text-neutral-400 hover:text-primary hover:bg-neutral-100 rounded"
                              title="View"
                            >
                              <Eye className="w-4 h-4" />
                            </Link>
                            <Link
                              href={`/admin/users/${user.id}/edit`}
                              className="p-1.5 text-neutral-400 hover:text-interactive hover:bg-neutral-100 rounded"
                              title="Edit"
                            >
                              <Edit className="w-4 h-4" />
                            </Link>
                            <button
                              className="p-1.5 text-neutral-400 hover:text-error hover:bg-error/10 rounded"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination (Simplified for now) */}
          <div className="flex items-center justify-between px-4 py-3 border-t border-neutral-100">
            <p className="text-sm text-neutral-600">
              Showing {users.length} users
            </p>
            <div className="flex gap-2">
              <button className="btn-ghost text-sm py-2" disabled>Previous</button>
              <button className="btn-ghost text-sm py-2" disabled>Next</button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default AdminUsersPage

