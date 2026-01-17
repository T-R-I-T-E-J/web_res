'use client'

import { DashboardHeader } from '@/components/dashboard'
import { Save } from 'lucide-react'

export default function ShooterSettingsPage() {
  const handleSave = () => {
    alert('Settings saved (Simulation)')
  }

  return (
    <>
      <DashboardHeader
        title="Settings"
        subtitle="Manage your account preferences"
      />

      <div className="p-6 max-w-4xl">
        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6 space-y-8">
          
          {/* Notification Preferences */}
          <div>
            <h3 className="text-lg font-semibold text-neutral-900 mb-4 border-b pb-2">Notification Preferences</h3>
            <div className="space-y-4">
              <label className="flex items-center gap-3">
                <input type="checkbox" defaultChecked className="w-4 h-4 text-primary rounded border-neutral-300 focus:ring-primary" />
                <span className="text-sm text-neutral-700">Email notifications for match updates</span>
              </label>
              <label className="flex items-center gap-3">
                <input type="checkbox" defaultChecked className="w-4 h-4 text-primary rounded border-neutral-300 focus:ring-primary" />
                <span className="text-sm text-neutral-700">SMS alerts for important announcements</span>
              </label>
              <label className="flex items-center gap-3">
                <input type="checkbox" className="w-4 h-4 text-primary rounded border-neutral-300 focus:ring-primary" />
                <span className="text-sm text-neutral-700">Marketing emails and newsletters</span>
              </label>
            </div>
          </div>

          {/* Account Security */}
          <div>
            <h3 className="text-lg font-semibold text-neutral-900 mb-4 border-b pb-2">Account Security</h3>
            <div className="space-y-4">
              <button className="btn-secondary text-sm">Change Password</button>
              <p className="text-xs text-neutral-500">Last password change: 3 months ago</p>
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
