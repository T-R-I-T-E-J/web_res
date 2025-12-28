'use client'

import { DashboardHeader } from '@/components/dashboard'
import { Medal, Trophy, Star, TrendingUp } from 'lucide-react'

const InternationalMedalistPage = () => {
  return (
    <>
      <DashboardHeader
        title="International Achievements"
        subtitle="Recognition and records of international podium finishes"
      />

      <div className="p-6 space-y-6">
        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card text-center bg-gradient-to-br from-amber-400/20 to-amber-600/20 border-amber-500/30">
            <Medal className="w-12 h-12 text-amber-600 mx-auto mb-2" />
            <p className="text-3xl font-bold text-amber-700">2</p>
            <p className="text-sm font-semibold text-amber-800">Gold Medals</p>
          </div>
          <div className="card text-center bg-gradient-to-br from-neutral-300/20 to-neutral-500/20 border-neutral-400/30">
            <Medal className="w-12 h-12 text-neutral-500 mx-auto mb-2" />
            <p className="text-3xl font-bold text-neutral-700">1</p>
            <p className="text-sm font-semibold text-neutral-800">Silver Medals</p>
          </div>
          <div className="card text-center bg-gradient-to-br from-orange-400/20 to-orange-600/20 border-orange-500/30">
            <Medal className="w-12 h-12 text-orange-600 mx-auto mb-2" />
            <p className="text-3xl font-bold text-orange-700">1</p>
            <p className="text-sm font-semibold text-orange-800">Bronze Medals</p>
          </div>
        </div>

        <div className="card">
          <h3 className="font-heading font-semibold text-primary mb-6">Podium History</h3>
          <div className="space-y-4">
            {[
              { match: 'Paris 2024 Paralympic Games', event: '10m Air Rifle SH1', rank: 'Gold', year: '2024' },
              { match: 'Tokyo 2020 Paralympic Games', event: '10m Air Rifle SH1', rank: 'Gold', year: '2021' },
              { match: 'Tokyo 2020 Paralympic Games', event: '50m Rifle 3P SH1', rank: 'Bronze', year: '2021' },
              { match: 'World Para Shooting Cup', event: '10m Air Rifle SH1', rank: 'Silver', year: '2022' },
            ].map((medal, i) => (
              <div key={i} className="flex items-center justify-between p-4 border border-neutral-200 rounded-card hover:bg-neutral-50 transition-colors">
                <div className="flex items-center gap-4">
                  <Star className={clsx(
                    'w-6 h-6',
                    medal.rank === 'Gold' ? 'text-amber-500' : 
                    medal.rank === 'Silver' ? 'text-neutral-400' : 'text-orange-500'
                  )} />
                  <div>
                    <h4 className="font-bold text-neutral-700">{medal.match}</h4>
                    <p className="text-sm text-neutral-500">{medal.event}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-bold text-neutral-700">{medal.rank}</span>
                  <p className="text-xs text-neutral-400">{medal.year}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

import clsx from 'clsx'
export default InternationalMedalistPage

