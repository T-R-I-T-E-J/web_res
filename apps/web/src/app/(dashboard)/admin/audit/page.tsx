'use client'

import { DashboardHeader } from '@/components/dashboard'
import { Search, Filter, Download, Shield, Calendar, User } from 'lucide-react'

export default function AuditPage() {
  return (
    <>
      <DashboardHeader
        title="Audit Logs"
        subtitle="Track all system activities and user actions"
      />

      <div className="p-6 space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="card">
            <p className="text-sm text-neutral-500">Total Actions</p>
            <p className="font-heading text-3xl font-bold text-neutral-700 mt-1">0</p>
          </div>
          <div className="card">
            <p className="text-sm text-neutral-500">Today</p>
            <p className="font-heading text-3xl font-bold text-neutral-700 mt-1">0</p>
          </div>
          <div className="card">
            <p className="text-sm text-neutral-500">Success Rate</p>
            <p className="font-heading text-3xl font-bold text-neutral-700 mt-1">100%</p>
          </div>
          <div className="card">
            <p className="text-sm text-neutral-500">Active Users</p>
            <p className="font-heading text-3xl font-bold text-neutral-700 mt-1">0</p>
          </div>
        </div>

        {/* Filters */}
        <div className="card">
          <div className="flex gap-4 items-center">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-400" />
              <input
                type="text"
                placeholder="Search logs by user, action, or resource..."
                className="input pl-10"
              />
            </div>
            <button className="btn-outline flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filters
            </button>
            <button className="btn-outline flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export
            </button>
          </div>
        </div>

        {/* Audit Logs Table */}
        <div className="card">
          <h3 className="text-lg font-heading font-semibold text-primary mb-4">Activity Log</h3>
          <div className="text-center py-12">
            <Shield className="h-16 w-16 mx-auto mb-4 text-neutral-400" />
            <p className="text-neutral-500 mb-2">No audit logs found</p>
            <p className="text-sm text-neutral-400">
              System activities will appear here once users start interacting with the platform
            </p>
          </div>
        </div>

        {/* Info Card */}
        <div className="card">
          <h3 className="text-lg font-heading font-semibold text-primary mb-4">About Audit Logs</h3>
          <p className="text-sm text-neutral-600 mb-3">
            Audit logs track all significant actions performed in the system, including:
          </p>
          <ul className="list-disc list-inside space-y-1 text-sm text-neutral-600 ml-4">
            <li>User authentication (login/logout)</li>
            <li>Content creation, updates, and deletions</li>
            <li>Permission and role changes</li>
            <li>Configuration modifications</li>
            <li>File uploads and downloads</li>
          </ul>
          <p className="text-sm text-neutral-500 mt-4">
            Logs are retained for 90 days and can be exported for compliance purposes.
          </p>
        </div>
      </div>
    </>
  )
}
