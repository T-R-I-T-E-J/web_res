'use client'

import { DashboardHeader } from '@/components/dashboard'
import { 
  FileText, Download, Upload, Eye, 
  CheckCircle, Clock, AlertCircle, Shield,
  CreditCard, Search
} from 'lucide-react'
import clsx from 'clsx'

const documents = [
  {
    id: 1,
    name: 'NRAI Shooter ID Card',
    type: 'Identity',
    status: 'verified',
    expiry: '2028-12-31',
    fileSize: '1.2 MB',
  },
  {
    id: 2,
    name: 'Valid Indian Passport',
    type: 'Identity/Travel',
    status: 'verified',
    expiry: '2030-05-15',
    fileSize: '2.4 MB',
  },
  {
    id: 3,
    name: 'Arms License (Pistol/Rifle)',
    type: 'Legal',
    status: 'pending',
    expiry: '2026-03-20',
    fileSize: '3.1 MB',
  },
  {
    id: 4,
    name: 'Medical Certificate (Form B)',
    type: 'Medical',
    status: 'expired',
    expiry: '2024-11-01',
    fileSize: '0.8 MB',
  },
  {
    id: 5,
    name: 'WSPS Classification Card',
    type: 'Classification',
    status: 'verified',
    expiry: 'Permanent',
    fileSize: '0.5 MB',
  },
]

const ShooterDocumentsPage = () => {
  return (
    <>
      <DashboardHeader
        title="My Documents"
        subtitle="Manage and upload your mandatory shooting credentials"
      />

      <div className="p-6 space-y-6">
        {/* Document Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="card flex items-center gap-4">
            <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold text-neutral-700">3</p>
              <p className="text-sm text-neutral-500">Verified</p>
            </div>
          </div>
          <div className="card flex items-center gap-4">
            <div className="w-12 h-12 bg-data-medium/10 rounded-full flex items-center justify-center">
              <Clock className="w-6 h-6 text-data-medium" />
            </div>
            <div>
              <p className="text-2xl font-bold text-neutral-700">1</p>
              <p className="text-sm text-neutral-500">Pending Review</p>
            </div>
          </div>
          <div className="card flex items-center gap-4">
            <div className="w-12 h-12 bg-error/10 rounded-full flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-error" />
            </div>
            <div>
              <p className="text-2xl font-bold text-neutral-700">1</p>
              <p className="text-sm text-neutral-500">Attention Required</p>
            </div>
          </div>
        </div>

        {/* Search & Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input 
              type="text" 
              placeholder="Search documents..." 
              className="input pl-10 py-2 text-sm"
            />
          </div>
          <button className="btn-primary py-2 text-sm">
            <Upload className="w-4 h-4 mr-2" />
            Upload New Document
          </button>
        </div>

        {/* Documents Table */}
        <div className="card">
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Document Name</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Expiry Date</th>
                  <th>File Size</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {documents.map((doc) => (
                  <tr key={doc.id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-neutral-100 rounded flex items-center justify-center">
                          <FileText className="w-4 h-4 text-neutral-500" />
                        </div>
                        <span className="font-medium text-neutral-700">{doc.name}</span>
                      </div>
                    </td>
                    <td><span className="text-xs font-medium text-neutral-500 px-2 py-1 bg-neutral-100 rounded">{doc.type}</span></td>
                    <td>
                      <span className={clsx(
                        'badge',
                        doc.status === 'verified' && 'badge-success',
                        doc.status === 'pending' && 'badge-warning',
                        doc.status === 'expired' && 'badge-error'
                      )}>
                        {doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}
                      </span>
                    </td>
                    <td className={clsx(
                      'text-sm font-data',
                      doc.status === 'expired' ? 'text-error font-bold' : 'text-neutral-500'
                    )}>
                      {doc.expiry}
                    </td>
                    <td className="text-sm text-neutral-400 font-data">{doc.fileSize}</td>
                    <td className="text-right">
                      <div className="flex justify-end gap-2">
                        <button className="p-2 text-neutral-400 hover:text-primary hover:bg-neutral-50 rounded transition-colors" title="View">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-neutral-400 hover:text-primary hover:bg-neutral-50 rounded transition-colors" title="Download">
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Warning Section */}
        <div className="bg-error/5 border border-error/20 rounded-card p-4">
          <div className="flex items-start gap-4">
            <AlertCircle className="w-6 h-6 text-error flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-error">Document Expiry Alert</h4>
              <p className="text-sm text-neutral-600 mt-1">
                Your <strong>Medical Certificate</strong> has expired. Please upload a fresh certificate in Form B to remain eligible for upcoming match registrations.
              </p>
              <button className="text-sm font-bold text-error mt-2 hover:underline">
                Download Form B Template
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ShooterDocumentsPage

