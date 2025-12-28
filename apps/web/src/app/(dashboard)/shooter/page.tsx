'use client'

import Link from 'next/link'
import { DashboardHeader } from '@/components/dashboard'
import {
  Trophy, User, Award, FileText, Globe, 
  Medal, History, FileCheck, Eye, Edit3,
  ChevronRight, Target, Ribbon, Calendar,
  TrendingUp, Shield, AlertCircle, ArrowRight
} from 'lucide-react'
import clsx from 'clsx'

const ShooterDashboardPage = () => {
  const profileCompletion = 85

  return (
    <>
      <DashboardHeader
        title="Shooter Portal"
        subtitle="Welcome back, Avani. Monitor your performance and institutional records."
      />

      <div className="p-6 space-y-8 max-w-7xl mx-auto">
        {/* Top Row: Welcome & Quick Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 card bg-primary text-white overflow-hidden relative">
            <div className="relative z-10 flex flex-col justify-center h-full">
              <h2 className="text-2xl font-bold mb-2 font-heading">Season 2025 Overview</h2>
              <p className="text-white/80 text-sm max-w-md mb-6">
                You are currently ranked #2 in 10m Air Rifle SH1. 
                Complete your medical verification to maintain eligibility for the upcoming National Trials.
              </p>
              <div className="flex gap-4">
                <div className="bg-white/10 px-4 py-2 rounded-card backdrop-blur-sm">
                  <p className="text-[10px] uppercase font-bold opacity-60">National Rank</p>
                  <p className="text-xl font-bold font-data">#02</p>
                </div>
                <div className="bg-white/10 px-4 py-2 rounded-card backdrop-blur-sm">
                  <p className="text-[10px] uppercase font-bold opacity-60">MQS Status</p>
                  <p className="text-xl font-bold font-data text-accent">MET</p>
                </div>
              </div>
            </div>
            {/* Abstract Background Icon */}
            <Trophy className="absolute -right-8 -bottom-8 w-64 h-64 text-white/5 rotate-12" />
          </div>

          <div className="card flex flex-col items-center justify-center text-center">
            <div className="relative w-24 h-24 mb-4">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="48" cy="48" r="40" className="fill-none stroke-neutral-100" strokeWidth="8" />
                <circle 
                  cx="48" cy="48" r="40" 
                  className="fill-none stroke-success" 
                  strokeWidth="8" 
                  strokeLinecap="round"
                  strokeDasharray={`${(profileCompletion / 100) * 251} 251`}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-heading text-xl font-bold text-neutral-700">{profileCompletion}%</span>
              </div>
            </div>
            <h3 className="font-bold text-neutral-700 text-sm">Profile Complete</h3>
            <Link href="/shooter/profile" className="text-primary text-xs font-bold mt-2 hover:underline">
              Finish Setup →
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Column: Grouped Sections */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Section 1: Competitive & Matches */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-heading font-bold text-lg text-primary flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Competitions & Events
                </h3>
                <Link href="/shooter/events" className="text-xs font-bold text-primary hover:underline">View Calendar</Link>
              </div>
              <div className="space-y-3">
                <Link href="/shooter/events/68-nscc-para-rifle" className="flex items-center p-4 bg-white border border-neutral-200 rounded-card hover:border-primary/40 hover:bg-primary/5 transition-all group">
                  <div className="w-10 h-10 bg-primary/10 text-primary rounded-full flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                    <Ribbon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-neutral-700 uppercase">68th National (Para Rifle Events)</p>
                    <p className="text-xs text-neutral-500">Registration Closes in 4 days</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-neutral-300 group-hover:text-primary" />
                </Link>
                <Link href="/shooter/events/68-nscc-para-pistol" className="flex items-center p-4 bg-white border border-neutral-200 rounded-card hover:border-primary/40 hover:bg-primary/5 transition-all group">
                  <div className="w-10 h-10 bg-primary/10 text-primary rounded-full flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                    <Ribbon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-neutral-700 uppercase">68th National (Para Pistol Events)</p>
                    <p className="text-xs text-neutral-500">Starts Jan 08, 2026</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-neutral-300 group-hover:text-primary" />
                </Link>
              </div>
            </section>

            {/* Section 2: Results & Performance */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-heading font-bold text-lg text-primary flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Results & Performance
                </h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Link href="/shooter/certificates" className="card flex items-center gap-4 group hover:bg-neutral-50 border-neutral-100 shadow-none">
                  <div className="w-12 h-12 bg-accent/10 text-accent rounded-card flex items-center justify-center group-hover:bg-accent group-hover:text-white transition-colors">
                    <Award className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-bold text-sm text-neutral-700">Certificates</p>
                    <p className="text-[10px] text-neutral-400">View merit & participation</p>
                  </div>
                </Link>
                <Link href="/shooter/international-medalist" className="card flex items-center gap-4 group hover:bg-neutral-50 border-neutral-100 shadow-none">
                  <div className="w-12 h-12 bg-primary/10 text-primary rounded-card flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                    <Medal className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-bold text-sm text-neutral-700">Podium Records</p>
                    <p className="text-[10px] text-neutral-400">International achievements</p>
                  </div>
                </Link>
              </div>
            </section>
          </div>

          {/* Sidebar Column: Administrative & Info */}
          <div className="space-y-8">
            <section>
              <h3 className="font-heading font-bold text-lg text-primary mb-4">Institutional Records</h3>
              <div className="card p-0 overflow-hidden shadow-none border-neutral-100">
                <div className="divide-y divide-neutral-100">
                  <Link href="/shooter/profile/view" className="flex items-center justify-between p-4 hover:bg-neutral-50 transition-colors group">
                    <div className="flex items-center gap-3">
                      <Eye className="w-4 h-4 text-neutral-400" />
                      <span className="text-sm font-medium text-neutral-600">View Profile Info</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-neutral-300 group-hover:text-primary" />
                  </Link>
                  <Link href="/shooter/nationality" className="flex items-center justify-between p-4 hover:bg-neutral-50 transition-colors group">
                    <div className="flex items-center gap-3">
                      <Globe className="w-4 h-4 text-neutral-400" />
                      <span className="text-sm font-medium text-neutral-600">Nationality Status</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-neutral-300 group-hover:text-primary" />
                  </Link>
                  <Link href="/shooter/equipment-control" className="flex items-center justify-between p-4 hover:bg-neutral-50 transition-colors group">
                    <div className="flex items-center gap-3">
                      <FileCheck className="w-4 h-4 text-neutral-400" />
                      <span className="text-sm font-medium text-neutral-600">Equipment Control</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-neutral-300 group-hover:text-primary" />
                  </Link>
                  <Link href="/shooter/history" className="flex items-center justify-between p-4 hover:bg-neutral-50 transition-colors group">
                    <div className="flex items-center gap-3">
                      <History className="w-4 h-4 text-neutral-400" />
                      <span className="text-sm font-medium text-neutral-600">Athlete History</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-neutral-300 group-hover:text-primary" />
                  </Link>
                </div>
              </div>
            </section>

            <section>
              <div className="card bg-accent/5 border-accent/20">
                <div className="flex items-center gap-3 mb-3">
                  <FileText className="w-5 h-5 text-accent" />
                  <h4 className="font-bold text-neutral-700 text-sm">Import Permit</h4>
                </div>
                <p className="text-[11px] text-neutral-500 mb-4">
                  Planning to import ammunition or spare parts? Start your application here.
                </p>
                <Link href="/shooter/import-permit" className="btn-accent w-full py-2 text-xs">
                  Apply for Permit
                </Link>
              </div>
            </section>

            <section className="bg-neutral-50 p-4 rounded-card border border-neutral-100">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-4 h-4 text-error flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-xs text-neutral-700">Notice Board</h4>
                  <p className="text-[10px] text-neutral-500 mt-1">
                    Renewal of Firearms License for session 2026 is now open. Submit your docs by Nov 30.
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  )
}

export default ShooterDashboardPage
