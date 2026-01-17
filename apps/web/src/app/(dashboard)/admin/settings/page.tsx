'use client'

import { DashboardHeader } from '@/components/dashboard'
import { Save } from 'lucide-react'

const AdminSettingsPage = () => {
  const handleSave = () => {
    alert('Settings saved (Simulation)')
  }

  return (
    <>
      <DashboardHeader
        title="System Settings"
        subtitle="Manage application configuration and preferences"
      />

      <div className="p-6 max-w-4xl">
        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6 space-y-8">
          
          {/* General Settings */}
          <div>
            <h3 className="text-lg font-semibold text-neutral-900 mb-4 border-b pb-2">General Settings</h3>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-neutral-700">Site Name</label>
                <input 
                  type="text" 
                  defaultValue="Para Shooting Committee India"
                  className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-neutral-700">Contact Email</label>
                <input 
                  type="email" 
                  defaultValue="contact@parashooting.in"
                  className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
            </div>
          </div>

          {/* Database Info (Read Only) */}
          <div>
            <h3 className="text-lg font-semibold text-neutral-900 mb-4 border-b pb-2">System Info</h3>
            <div className="bg-neutral-50 rounded-md p-4 space-y-2 text-sm text-neutral-600">
              <div className="flex justify-between">
                <span>Frontend Version:</span>
                <span className="font-mono text-neutral-900">1.0.0</span>
              </div>
              <div className="flex justify-between">
                <span>API Status:</span>
                <span className="font-mono text-success">Online</span>
              </div>
              <div className="flex justify-between">
                <span>Environment:</span>
                <span className="font-mono text-neutral-900">{process.env.NODE_ENV}</span>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button
              onClick={handleSave}
              className="btn-primary flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Save Changes
            </button>
          </div>

        </div>
      </div>
    </>
  )
}

export default AdminSettingsPage
