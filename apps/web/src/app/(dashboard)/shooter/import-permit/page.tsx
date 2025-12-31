'use client'

import { DashboardHeader } from '@/components/dashboard'
import { FileText, Download, Shield, Info, AlertCircle } from 'lucide-react'

const ImportPermitPage = () => {
  return (
    <>
      <DashboardHeader
        title="Import Permit Application"
        subtitle="Apply for permits to import competition equipment"
      />

      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card border-l-4 border-l-accent">
            <h3 className="font-heading font-bold text-lg text-primary mb-4">Request New Permit</h3>
            <p className="text-neutral-600 mb-6">Apply for the import of rifles, pistols, or specialized ammunition for international competitions.</p>
            <div className="space-y-4">
              <button className="btn-primary w-full">
                Start New Application
              </button>
              <button className="btn-outline w-full">
                <Download className="w-4 h-4 mr-2" />
                Download Guidelines (PDF)
              </button>
            </div>
          </div>

          <div className="card">
            <h3 className="font-heading font-bold text-lg text-primary mb-4">Application History</h3>
            <div className="space-y-3">
              <div className="p-3 border border-neutral-100 rounded-card flex justify-between items-center">
                <div>
                  <p className="font-semibold text-neutral-700">10m Air Rifle (Walther)</p>
                  <p className="text-xs text-neutral-500">Submitted on Nov 10, 2024</p>
                </div>
                <span className="badge-success text-[10px]">APPROVED</span>
              </div>
              <div className="p-3 border border-neutral-100 rounded-card flex justify-between items-center">
                <div>
                  <p className="font-semibold text-neutral-700">JSB Match Pellets (5000 rounds)</p>
                  <p className="text-xs text-neutral-500">Submitted on Dec 01, 2024</p>
                </div>
                <span className="badge-warning text-[10px]">IN REVIEW</span>
              </div>
            </div>
          </div>
        </div>

        <div className="card bg-primary/5 border-primary/20">
          <div className="flex items-start gap-4">
            <AlertCircle className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
            <div>
              <h4 className="font-bold text-primary mb-1">Mandatory Requirement</h4>
              <p className="text-sm text-neutral-600">
                All import permit applications require a valid <strong>NRAI Shooter ID Card</strong> and a <strong>Recommendation Letter</strong> from the Paralympic Committee of India.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ImportPermitPage

