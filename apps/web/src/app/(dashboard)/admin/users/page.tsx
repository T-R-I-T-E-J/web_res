'use client'

import { useState } from 'react'
import Link from 'next/link'
import { DashboardHeader } from '@/components/dashboard'
import {
  Search, Filter, Download, Plus, MoreVertical, CheckCircle,
  XCircle, Clock, Eye, Edit, Trash2, Mail
} from 'lucide-react'
import clsx from 'clsx'

const users = [
  { id: 1, name: 'Avani Lekhara', email: 'avani@example.com', state: 'Rajasthan', classification: 'SH1', status: 'active', role: 'Shooter', joined: 'Jan 2018' },
  { id: 2, name: 'Manish Narwal', email: 'manish@example.com', state: 'Haryana', classification: 'SH1', status: 'active', role: 'Shooter', joined: 'Mar 2019' },
  { id: 3, name: 'Singhraj Adhana', email: 'singhraj@example.com', state: 'Haryana', classification: 'SH1', status: 'active', role: 'Shooter', joined: 'May 2017' },
  { id: 4, name: 'Rahul Sharma', email: 'rahul@example.com', state: 'Maharashtra', classification: 'SH2', status: 'pending', role: 'Shooter', joined: 'Dec 2024' },
  { id: 5, name: 'Priya Singh', email: 'priya@example.com', state: 'Delhi', classification: 'SH1', status: 'pending', role: 'Shooter', joined: 'Dec 2024' },
  { id: 6, name: 'Admin User', email: 'admin@example.com', state: 'Delhi', classification: '-', status: 'active', role: 'Admin', joined: 'Jan 2015' },
  { id: 7, name: 'Coach Verma', email: 'coach@example.com', state: 'Gujarat', classification: '-', status: 'active', role: 'Coach', joined: 'Aug 2020' },
  { id: 8, name: 'Deepak Kumar', email: 'deepak@example.com', state: 'Punjab', classification: 'VI2', status: 'suspended', role: 'Shooter', joined: 'Jun 2021' },
]

const AdminUsersPage = () => {
  const [selectedUsers, setSelectedUsers] = useState<number[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [roleFilter, setRoleFilter] = useState('all')

  const filteredUsers = users.filter((user) => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          user.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter
    const matchesRole = roleFilter === 'all' || user.role === roleFilter
    return matchesSearch && matchesStatus && matchesRole
  })

  const handleSelectAll = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([])
    } else {
      setSelectedUsers(filteredUsers.map((u) => u.id))
    }
  }

  const handleSelectUser = (id: number) => {
    if (selectedUsers.includes(id)) {
      setSelectedUsers(selectedUsers.filter((uid) => uid !== id))
    } else {
      setSelectedUsers([...selectedUsers, id])
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
                <option value="pending">Pending</option>
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
                      checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
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
                {filteredUsers.map((user) => (
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
                            {user.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <Link
                            href={`/admin/users/${user.id}`}
                            className="font-medium text-neutral-700 hover:text-primary"
                          >
                            {user.name}
                          </Link>
                          <p className="text-xs text-neutral-500">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="text-neutral-600">{user.state}</td>
                    <td>
                      {user.classification !== '-' ? (
                        <span className="font-data font-medium text-neutral-700">
                          {user.classification}
                        </span>
                      ) : (
                        <span className="text-neutral-400">-</span>
                      )}
                    </td>
                    <td>
                      <span className={clsx(
                        'badge',
                        user.role === 'Admin' && 'bg-primary/10 text-primary',
                        user.role === 'Coach' && 'bg-interactive/10 text-interactive',
                        user.role === 'Shooter' && 'bg-neutral-100 text-neutral-600'
                      )}>
                        {user.role}
                      </span>
                    </td>
                    <td>
                      <span className={clsx(
                        'badge',
                        user.status === 'active' && 'badge-success',
                        user.status === 'pending' && 'badge-warning',
                        user.status === 'suspended' && 'badge-error'
                      )}>
                        {user.status === 'active' && <CheckCircle className="w-3 h-3 mr-1" />}
                        {user.status === 'pending' && <Clock className="w-3 h-3 mr-1" />}
                        {user.status === 'suspended' && <XCircle className="w-3 h-3 mr-1" />}
                        {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                      </span>
                    </td>
                    <td className="text-neutral-500 text-sm">{user.joined}</td>
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
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between px-4 py-3 border-t border-neutral-100">
            <p className="text-sm text-neutral-600">
              Showing {filteredUsers.length} of {users.length} users
            </p>
            <div className="flex gap-2">
              <button className="btn-ghost text-sm py-2" disabled>Previous</button>
              <button className="btn-ghost text-sm py-2">Next</button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default AdminUsersPage

