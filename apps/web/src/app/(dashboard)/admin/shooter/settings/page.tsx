'use client'

import { useState } from 'react'
import { DashboardHeader } from '@/components/dashboard'
import { Save } from 'lucide-react'

export default function ShooterSettingsPage() {
  const [settings, setSettings] = useState({
    autoApprove: false,
    requireVerification: true,
    allowPublicProfiles: true,
    enableNotifications: true,
    maxPhotosPerShooter: 10,
    defaultClassification: '',
  })

  const handleSave = () => {
    console.log('Saving settings:', settings)
    // TODO: Implement save functionality
  }

  return (
    <>
      <DashboardHeader
        title="Shooter Settings"
        subtitle="Configure settings for shooter profiles and registrations"
      />

      <div className="p-6 space-y-6">
        {/* General Settings */}
        <div className="card">
          <h3 className="text-lg font-heading font-semibold text-primary mb-4">General Settings</h3>
          <div className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="maxPhotos" className="block text-sm font-medium text-neutral-700">
                Maximum Photos per Shooter
              </label>
              <input
                id="maxPhotos"
                type="number"
                value={settings.maxPhotosPerShooter}
                onChange={(e) => setSettings({ ...settings, maxPhotosPerShooter: parseInt(e.target.value) })}
                className="input"
              />
              <p className="text-sm text-neutral-500">
                Limit the number of photos each shooter can upload
              </p>
            </div>

            <div className="space-y-2">
              <label htmlFor="defaultClass" className="block text-sm font-medium text-neutral-700">
                Default Classification
              </label>
              <input
                id="defaultClass"
                type="text"
                placeholder="e.g., SH1, SH2, etc."
                value={settings.defaultClassification}
                onChange={(e) => setSettings({ ...settings, defaultClassification: e.target.value })}
                className="input"
              />
              <p className="text-sm text-neutral-500">
                Default classification for new shooters
              </p>
            </div>

            <div className="flex items-center justify-between py-3 border-t border-neutral-100">
              <div className="space-y-0.5">
                <label className="text-sm font-medium text-neutral-700">Allow Public Profiles</label>
                <p className="text-sm text-neutral-500">
                  Make shooter profiles visible to the public
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.allowPublicProfiles}
                  onChange={(e) => setSettings({ ...settings, allowPublicProfiles: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Registration Settings */}
        <div className="card">
          <h3 className="text-lg font-heading font-semibold text-primary mb-4">Registration Settings</h3>
          <div className="space-y-6">
            <div className="flex items-center justify-between py-3">
              <div className="space-y-0.5">
                <label className="text-sm font-medium text-neutral-700">Auto-Approve Registrations</label>
                <p className="text-sm text-neutral-500">
                  Automatically approve new shooter registrations
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.autoApprove}
                  onChange={(e) => setSettings({ ...settings, autoApprove: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>

            <div className="flex items-center justify-between py-3 border-t border-neutral-100">
              <div className="space-y-0.5">
                <label className="text-sm font-medium text-neutral-700">Require Email Verification</label>
                <p className="text-sm text-neutral-500">
                  Shooters must verify their email before registration is complete
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.requireVerification}
                  onChange={(e) => setSettings({ ...settings, requireVerification: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>

            <div className="space-y-2 pt-3 border-t border-neutral-100">
              <label htmlFor="regInstructions" className="block text-sm font-medium text-neutral-700">
                Registration Instructions
              </label>
              <textarea
                id="regInstructions"
                placeholder="Enter instructions that will be shown to new shooters during registration..."
                rows={4}
                className="input"
              />
              <p className="text-sm text-neutral-500">
                Custom message displayed during shooter registration
              </p>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="card">
          <h3 className="text-lg font-heading font-semibold text-primary mb-4">Notification Settings</h3>
          <div className="space-y-6">
            <div className="flex items-center justify-between py-3">
              <div className="space-y-0.5">
                <label className="text-sm font-medium text-neutral-700">Enable Notifications</label>
                <p className="text-sm text-neutral-500">
                  Send notifications for shooter activities
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.enableNotifications}
                  onChange={(e) => setSettings({ ...settings, enableNotifications: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button onClick={handleSave} className="btn-primary flex items-center gap-2">
            <Save className="h-4 w-4" />
            Save Settings
          </button>
        </div>
      </div>
    </>
  )
}
