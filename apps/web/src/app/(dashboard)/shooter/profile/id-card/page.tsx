'use client'

import { DashboardHeader } from '@/components/dashboard'
import { Download, Printer, Share2, Shield, User, MapPin, Calendar } from 'lucide-react'
import Image from 'next/image'

const ShooterIDCardPage = () => {
  const shooter = {
    name: 'AVANI LEKHARA',
    id: 'PSCI-2018-00234',
    state: 'RAJASTHAN',
    dob: '08/11/2001',
    validUntil: '31/12/2028',
    event: 'RIFLE',
    classification: 'SH1'
  }

  return (
    <>
      <DashboardHeader
        title="My Shooter ID Card"
        subtitle="Digital version of your NRAI institutional identity"
      />

      <div className="p-6 space-y-8">
        {/* Card Display */}
        <div className="flex justify-center">
          <div className="relative w-full max-w-md bg-gradient-to-br from-primary to-secondary rounded-xl shadow-2xl overflow-hidden text-white aspect-[1.58/1]">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -mr-32 -mt-32" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full -ml-32 -mb-32" />
            </div>

            {/* Content */}
            <div className="relative h-full p-6 flex flex-col justify-between">
              {/* Header */}
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white rounded p-1">
                    <Image src="/logo.png" alt="Logo" width={40} height={40} className="object-contain" />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-xs leading-tight">NATIONAL PARA<br />SHOOTING FEDERATION</h3>
                    <p className="text-[10px] opacity-80">MEMBER OF WSPS / Paralympic Committee of India</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold bg-accent px-2 py-0.5 rounded">ATHLETE ID</span>
                  <p className="font-data text-sm mt-1">{shooter.id}</p>
                </div>
              </div>

              {/* Body */}
              <div className="flex gap-6 items-center">
                <div className="w-24 h-32 bg-white rounded-lg border-2 border-white/20 overflow-hidden flex-shrink-0">
                  <div className="w-full h-full bg-neutral-200 flex items-center justify-center">
                    <User className="w-12 h-12 text-neutral-400" />
                  </div>
                </div>
                <div className="flex-1 space-y-2">
                  <div>
                    <p className="text-[10px] opacity-70 uppercase font-semibold">Athlete Name</p>
                    <h4 className="font-heading font-bold text-lg leading-tight">{shooter.name}</h4>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <p className="text-[10px] opacity-70 uppercase font-semibold">State</p>
                      <p className="text-xs font-bold">{shooter.state}</p>
                    </div>
                    <div>
                      <p className="text-[10px] opacity-70 uppercase font-semibold">Event</p>
                      <p className="text-xs font-bold">{shooter.event}</p>
                    </div>
                    <div>
                      <p className="text-[10px] opacity-70 uppercase font-semibold">DOB</p>
                      <p className="text-xs font-bold font-data">{shooter.dob}</p>
                    </div>
                    <div>
                      <p className="text-[10px] opacity-70 uppercase font-semibold">Class</p>
                      <p className="text-xs font-bold">{shooter.classification}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex justify-between items-end border-t border-white/20 pt-3">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-accent" />
                  <span className="text-[10px] font-semibold">VERIFIED NATIONAL SHOOTER</span>
                </div>
                <div className="text-right">
                  <p className="text-[10px] opacity-70">VALID UNTIL</p>
                  <p className="text-xs font-bold font-data">{shooter.validUntil}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-center gap-4">
          <button className="btn-primary">
            <Download className="w-4 h-4 mr-2" />
            Download PDF
          </button>
          <button className="btn-outline">
            <Printer className="w-4 h-4 mr-2" />
            Print Card
          </button>
          <button className="btn-ghost">
            <Share2 className="w-4 h-4 mr-2" />
            Share Digital ID
          </button>
        </div>

        {/* Info Box */}
        <div className="max-w-2xl mx-auto card bg-neutral-50 border-neutral-200">
          <h4 className="font-heading font-semibold text-primary mb-3">Important Instructions</h4>
          <ul className="text-sm text-neutral-600 space-y-2 list-disc pl-5">
            <li>This is a digital version of your official shooter ID card.</li>
            <li>Carry a printed copy or digital version to all NPSML sanctioned matches.</li>
            <li>Possession of this card does not replace the requirement for a valid Arms License.</li>
            <li>Identity verification may be requested at any range entry.</li>
          </ul>
        </div>
      </div>
    </>
  )
}

export default ShooterIDCardPage

