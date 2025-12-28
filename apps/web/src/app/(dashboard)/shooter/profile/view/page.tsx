'use client'

import { DashboardHeader } from '@/components/dashboard'
import { User, Mail, Phone, MapPin, Calendar, Shield, CheckCircle, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

const ShooterViewInfoPage = () => {
  const profile = {
    firstName: 'Avani',
    lastName: 'Lekhara',
    email: 'avani@example.com',
    phone: '+91 98765 43210',
    dateOfBirth: '2001-11-08',
    gender: 'Female',
    state: 'Rajasthan',
    city: 'Jaipur',
    classification: 'SH1',
    psciId: 'PSCI-2018-00234',
    memberSince: '2018',
  }

  return (
    <>
      <DashboardHeader
        title="View Profile Information"
        subtitle="Institutional record of your shooter profile"
      />

      <div className="p-6 space-y-6">
        <div className="mb-4">
          <Link href="/shooter" className="flex items-center gap-2 text-sm text-neutral-500 hover:text-primary transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
        </div>

        <div className="card max-w-4xl">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Avatar & Verification */}
            <div className="w-full md:w-1/3 flex flex-col items-center border-b md:border-b-0 md:border-r border-neutral-100 pb-8 md:pb-0 md:pr-8">
              <div className="w-32 h-32 bg-neutral-100 rounded-full flex items-center justify-center mb-4 border-4 border-white shadow-md">
                <User className="w-16 h-16 text-neutral-400" />
              </div>
              <h2 className="font-heading font-bold text-xl text-primary">{profile.firstName} {profile.lastName}</h2>
              <span className="badge-success mt-2">
                <CheckCircle className="w-3 h-3 mr-1" />
                VERIFIED ATHLETE
              </span>
              <div className="mt-6 w-full space-y-2">
                <div className="p-3 bg-neutral-50 rounded text-center">
                  <p className="text-[10px] text-neutral-500 uppercase font-bold">NPSML ID</p>
                  <p className="font-data font-bold text-neutral-700">{profile.psciId}</p>
                </div>
                <div className="p-3 bg-primary/5 rounded text-center">
                  <p className="text-[10px] text-primary uppercase font-bold">Classification</p>
                  <p className="font-heading font-bold text-primary">{profile.classification}</p>
                </div>
              </div>
            </div>

            {/* Detailed Info */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
              <div>
                <p className="text-[10px] text-neutral-400 uppercase font-bold mb-1">Email Address</p>
                <p className="text-neutral-700 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-neutral-300" />
                  {profile.email}
                </p>
              </div>
              <div>
                <p className="text-[10px] text-neutral-400 uppercase font-bold mb-1">Phone Number</p>
                <p className="text-neutral-700 flex items-center gap-2">
                  <Phone className="w-4 h-4 text-neutral-300" />
                  {profile.phone}
                </p>
              </div>
              <div>
                <p className="text-[10px] text-neutral-400 uppercase font-bold mb-1">Date of Birth</p>
                <p className="text-neutral-700 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-neutral-300" />
                  {profile.dateOfBirth}
                </p>
              </div>
              <div>
                <p className="text-[10px] text-neutral-400 uppercase font-bold mb-1">State Association</p>
                <p className="text-neutral-700 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-neutral-300" />
                  {profile.state}
                </p>
              </div>
              <div>
                <p className="text-[10px] text-neutral-400 uppercase font-bold mb-1">City</p>
                <p className="text-neutral-700">{profile.city}</p>
              </div>
              <div>
                <p className="text-[10px] text-neutral-400 uppercase font-bold mb-1">Member Since</p>
                <p className="text-neutral-700">{profile.memberSince}</p>
              </div>
              <div className="md:col-span-2 mt-4">
                <Link href="/shooter/profile" className="btn-outline w-full py-2">
                  Update Information
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ShooterViewInfoPage

