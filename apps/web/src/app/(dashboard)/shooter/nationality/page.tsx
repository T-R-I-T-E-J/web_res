'use client'

import { DashboardHeader } from '@/components/dashboard'
import { Globe, Shield, AlertCircle, CheckCircle, Upload } from 'lucide-react'

const NationalityPage = () => {
  return (
    <>
      <DashboardHeader
        title="Nationality Verification"
        subtitle="Verification records for international representation"
      />

      <div className="p-6 space-y-6">
        <div className="card max-w-2xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-success" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-neutral-700">Verified Indian National</h3>
              <p className="text-sm text-neutral-500">Confirmed on Jan 12, 2018</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-neutral-50 rounded-card">
                <p className="text-xs text-neutral-500 uppercase font-bold mb-1">Passport Country</p>
                <p className="font-semibold text-neutral-700">INDIA</p>
              </div>
              <div className="p-4 bg-neutral-50 rounded-card">
                <p className="text-xs text-neutral-500 uppercase font-bold mb-1">Sporting Nationality</p>
                <p className="font-semibold text-neutral-700">IND</p>
              </div>
            </div>

            <div className="border-t border-neutral-100 pt-6">
              <h4 className="font-semibold text-neutral-700 mb-2">Supporting Documents</h4>
              <ul className="space-y-3">
                <li className="flex items-center justify-between p-3 border border-neutral-200 rounded-card">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-primary" />
                    <span className="text-sm">Indian Passport Copy</span>
                  </div>
                  <span className="text-xs text-success font-bold">VERIFIED</span>
                </li>
                <li className="flex items-center justify-between p-3 border border-neutral-200 rounded-card">
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-primary" />
                    <span className="text-sm">Birth Certificate</span>
                  </div>
                  <span className="text-xs text-success font-bold">VERIFIED</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default NationalityPage

