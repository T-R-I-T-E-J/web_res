'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Mail, Phone, MapPin, Calendar, Shield, User } from 'lucide-react'
import { DashboardHeader } from '@/components/dashboard'

interface UserDetail {
  id: number
  email: string
  firstName: string
  lastName: string
  role: string
  isActive: boolean
  createdAt: string
  updatedAt: string
  phone?: string
  address?: string
}

export default function UserDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [user, setUser] = useState<UserDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || '/api/v1'
        const token = document.cookie
          .split('; ')
          .find(row => row.startsWith('token='))
          ?.split('=')[1]

        const response = await fetch(`${API_URL}/users/${params.id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        })

        if (!response.ok) {
          throw new Error('Failed to fetch user details')
        }

        const data = await response.json()
        setUser(data.data || data)
      } catch (err) {
        console.error('Error fetching user:', err)
        setError(err instanceof Error ? err.message : 'Failed to load user')
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchUser()
    }
  }, [params.id])

  if (loading) {
    return (
      <>
        <DashboardHeader title="User Details" subtitle="Loading user information..." />
        <div className="p-6">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-neutral-500">Loading user details...</p>
            </div>
          </div>
        </div>
      </>
    )
  }

  if (error || !user) {
    return (
      <>
        <DashboardHeader title="User Details" subtitle="User not found" />
        <div className="p-6">
          <button
            onClick={() => router.back()}
            className="btn-ghost mb-6 flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
          <div className="card">
            <div className="text-center py-12">
              <p className="text-error mb-4">{error || 'User not found'}</p>
              <button onClick={() => router.push('/admin/users')} className="btn-primary">
                Return to Users List
              </button>
            </div>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <DashboardHeader 
        title={`${user.firstName} ${user.lastName}`}
        subtitle={user.email}
      />
      
      <div className="p-6">
        <button
          onClick={() => router.back()}
          className="btn-ghost mb-6 flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Users
        </button>

        <div className="grid gap-6">
          {/* Header Card */}
          <div className="card">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-heading font-bold text-neutral-700">
                    {user.firstName} {user.lastName}
                  </h2>
                  <p className="flex items-center gap-2 mt-1 text-neutral-500">
                    <Mail className="h-4 w-4" />
                    {user.email}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <span className={user.isActive ? 'badge-success' : 'badge-error'}>
                  {user.isActive ? 'Active' : 'Inactive'}
                </span>
                <span className="badge-info flex items-center gap-1">
                  <Shield className="h-3 w-3" />
                  {user.role}
                </span>
              </div>
            </div>
          </div>

          {/* Details Card */}
          <div className="card">
            <h3 className="text-lg font-heading font-semibold text-primary mb-4">User Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-neutral-500">User ID</p>
                <p className="font-medium text-neutral-700">#{user.id}</p>
              </div>
              
              <div className="space-y-1">
                <p className="text-sm text-neutral-500">Email</p>
                <p className="font-medium text-neutral-700 flex items-center gap-2">
                  <Mail className="h-4 w-4 text-neutral-400" />
                  {user.email}
                </p>
              </div>

              {user.phone && (
                <div className="space-y-1">
                  <p className="text-sm text-neutral-500">Phone</p>
                  <p className="font-medium text-neutral-700 flex items-center gap-2">
                    <Phone className="h-4 w-4 text-neutral-400" />
                    {user.phone}
                  </p>
                </div>
              )}

              {user.address && (
                <div className="space-y-1">
                  <p className="text-sm text-neutral-500">Address</p>
                  <p className="font-medium text-neutral-700 flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-neutral-400" />
                    {user.address}
                  </p>
                </div>
              )}

              <div className="space-y-1">
                <p className="text-sm text-neutral-500">Created At</p>
                <p className="font-medium text-neutral-700 flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-neutral-400" />
                  {new Date(user.createdAt).toLocaleDateString('en-IN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>

              <div className="space-y-1">
                <p className="text-sm text-neutral-500">Last Updated</p>
                <p className="font-medium text-neutral-700 flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-neutral-400" />
                  {new Date(user.updatedAt).toLocaleDateString('en-IN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
            </div>
          </div>

          {/* Actions Card */}
          <div className="card">
            <h3 className="text-lg font-heading font-semibold text-primary mb-4">Actions</h3>
            <div className="flex gap-2">
              <button className="btn-outline">Edit User</button>
              <button className="btn-outline">Reset Password</button>
              <button className="btn bg-error text-white hover:bg-error/90" disabled={!user.isActive}>
                Deactivate User
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
