'use client'

import { DashboardHeader } from '@/components/dashboard'
import { 
  UserCheck, XCircle, Eye, Search, Filter, 
  Calendar, MapPin, Shield, AlertCircle, CheckCircle
} from 'lucide-react'
import Link from 'next/link'
import clsx from 'clsx'

const pendingApprovals = [
  {
    id: 1,
    name: 'Rahul Sharma',
    type: 'New Registration',
    state: 'Maharashtra',
    submittedAt: '2024-12-26 14:30',
    documents: ['ID Card', 'Passport', 'Medical'],
    category: 'Rifle',
    status: 'pending'
  },
  {
    id: 2,
    name: 'Priya Singh',
    type: 'Document Update',
    state: 'Delhi',
    submittedAt: '2024-12-27 09:15',
    documents: ['Arms License'],
    category: 'Pistol',
    status: 'pending'
  },
  {
    id: 3,
    name: 'Vikram Patel',
    type: 'New Registration',
    state: 'Gujarat',
    submittedAt: '2024-12-27 16:45',
    documents: ['ID Card', 'Passport'],
    category: 'Rifle',
    status: 'flagged'
  },
]

const AdminPendingApprovalsPage = () => {
  return (
    <>
      <DashboardHeader
        title="Pending Approvals"
        subtitle="Review and verify new shooter registrations and document updates"
      />

      <div className="p-6 space-y-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="card border-l-4 border-l-interactive">
            <p className="text-sm text-neutral-500 font-medium">Total Pending</p>
            <p className="text-2xl font-bold text-neutral-700 mt-1">{pendingApprovals.length}</p>
          </div>
          <div className="card border-l-4 border-l-success">
            <p className="text-sm text-neutral-500 font-medium">Approved Today</p>
            <p className="text-2xl font-bold text-neutral-700 mt-1">12</p>
          </div>
          <div className="card border-l-4 border-l-error">
            <p className="text-sm text-neutral-500 font-medium">Flagged for Review</p>
            <p className="text-2xl font-bold text-neutral-700 mt-1">1</p>
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input 
              type="text" 
              placeholder="Search by name or state..." 
              className="input pl-10 py-2 text-sm"
            />
          </div>
          <div className="flex gap-2">
            <button className="btn-outline py-2 text-sm">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </button>
            <button className="btn-primary py-2 text-sm">
              Approve All Selected
            </button>
          </div>
        </div>

        {/* Pending Table */}
        <div className="card">
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th className="w-8">
                    <input type="checkbox" className="rounded" />
                  </th>
                  <th>Shooter Details</th>
                  <th>Request Type</th>
                  <th>Documents</th>
                  <th>Submitted At</th>
                  <th>Status</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pendingApprovals.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <input type="checkbox" className="rounded" />
                    </td>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-neutral-100 rounded-full flex items-center justify-center font-bold text-neutral-500">
                          {item.name[0]}
                        </div>
                        <div>
                          <p className="font-semibold text-neutral-700">{item.name}</p>
                          <p className="text-xs text-neutral-500 flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {item.state} • {item.category}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="text-sm font-medium text-neutral-600">{item.type}</span>
                    </td>
                    <td>
                      <div className="flex flex-wrap gap-1">
                        {item.documents.map((doc, idx) => (
                          <span key={idx} className="text-[10px] bg-neutral-100 px-1.5 py-0.5 rounded text-neutral-500">
                            {doc}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="text-sm text-neutral-500 font-data">
                      {item.submittedAt}
                    </td>
                    <td>
                      <span className={clsx(
                        'badge',
                        item.status === 'pending' ? 'badge-warning' : 'badge-error'
                      )}>
                        {item.status === 'pending' ? 'Pending' : 'Flagged'}
                      </span>
                    </td>
                    <td className="text-right">
                      <div className="flex justify-end gap-2">
                        <Link 
                          href={`/admin/users/${item.id}`}
                          className="p-2 text-neutral-400 hover:text-primary hover:bg-neutral-50 rounded transition-colors"
                          title="Review"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <button className="p-2 text-success hover:bg-success/10 rounded transition-colors" title="Approve">
                          <CheckCircle className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-error hover:bg-error/10 rounded transition-colors" title="Reject">
                          <XCircle className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Flagged Note */}
        <div className="bg-accent/5 border border-accent/20 rounded-card p-4">
          <div className="flex items-start gap-4">
            <AlertCircle className="w-6 h-6 text-accent flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-neutral-700">Verification Guidelines</h4>
              <p className="text-sm text-neutral-600 mt-1">
                Ensure that the <strong>passport details</strong> match the <strong>date of birth</strong> provided in the registration form. Any discrepancies should be flagged for re-upload.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default AdminPendingApprovalsPage

