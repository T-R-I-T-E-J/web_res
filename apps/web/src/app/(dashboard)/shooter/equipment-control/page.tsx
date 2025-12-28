'use client'

import { DashboardHeader } from '@/components/dashboard'
import { FileText, Plus, Search, Download, Trash2 } from 'lucide-react'

const EquipmentControlPage = () => {
  return (
    <>
      <DashboardHeader
        title="Equipment Control Sheet"
        subtitle="Manage your equipment verification and control sheets"
      />

      <div className="p-6 space-y-6">
        <div className="card bg-neutral-50 border-neutral-200">
          <div className="flex flex-col md:flex-row items-center gap-6 p-4">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
              <FileText className="w-8 h-8 text-primary" />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h3 className="font-heading font-semibold text-lg text-primary">Pre-Competition Equipment Check</h3>
              <p className="text-neutral-600 text-sm">Download and fill the control sheet before arriving at the range for equipment inspection.</p>
            </div>
            <button className="btn-primary">
              <Download className="w-4 h-4 mr-2" />
              Download Form
            </button>
          </div>
        </div>

        <div className="card">
          <h3 className="font-heading font-semibold text-primary mb-4">My Control Sheets</h3>
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Match Name</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="font-medium">68th NSCC Para Events</td>
                  <td className="text-neutral-500">Dec 2025</td>
                  <td><span className="badge-warning">Required</span></td>
                  <td className="text-right">
                    <button className="btn-outline py-1 px-3 text-xs">Upload Scan</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  )
}

export default EquipmentControlPage

