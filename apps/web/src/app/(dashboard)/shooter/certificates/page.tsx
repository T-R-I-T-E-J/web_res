'use client'

import { DashboardHeader } from '@/components/dashboard'
import { Award, Download, Eye, Search, Filter } from 'lucide-react'
import clsx from 'clsx'

const certificates = [
  { id: 1, name: 'Participation Certificate - 67th NSCC', event: '10m Air Rifle', date: '2024-01-15', type: 'Participation' },
  { id: 2, name: 'Merit Certificate - Zonal Championship', event: '10m Air Rifle', date: '2023-11-20', type: 'Merit', rank: 'Gold' },
  { id: 3, name: 'Classification Certificate', event: 'Para Shooting', date: '2018-05-10', type: 'Classification' },
]

const CertificatesPage = () => {
  return (
    <>
      <DashboardHeader
        title="My Certificates"
        subtitle="View and download your merit and participation certificates"
      />

      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certificates.map((cert) => (
            <div key={cert.id} className="card-hover flex flex-col items-center text-center p-8">
              <div className="w-20 h-20 bg-primary/5 rounded-full flex items-center justify-center mb-4 border-2 border-primary/10">
                <Award className="w-10 h-10 text-primary" />
              </div>
              <h3 className="font-heading font-bold text-neutral-700 mb-1">{cert.name}</h3>
              <p className="text-sm text-neutral-500 mb-4">{cert.event} • {cert.date}</p>
              
              <div className="flex gap-2 w-full mt-auto">
                <button className="btn-outline flex-1 py-2 text-sm">
                  <Eye className="w-4 h-4 mr-2" />
                  View
                </button>
                <button className="btn-primary flex-1 py-2 text-sm">
                  <Download className="w-4 h-4 mr-2" />
                  PDF
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

export default CertificatesPage

