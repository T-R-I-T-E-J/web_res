'use client'

import { DashboardHeader } from '@/components/dashboard'
import { History as HistoryIcon, Target, Trophy, Calendar } from 'lucide-react'

const AthleteHistoryPage = () => {
  return (
    <>
      <DashboardHeader
        title="Athlete Journey"
        subtitle="Timeline of your progression and major milestones"
      />

      <div className="p-6">
        <div className="relative border-l-2 border-primary/20 ml-4 space-y-12 pb-8">
          {[
            { year: '2024', title: 'World Record Holder', desc: 'Set a new World Record at the Paris Paralympics.', icon: Trophy },
            { year: '2021', title: 'Khel Ratna Award', desc: 'Received India\'s highest sporting honor.', icon: Target },
            { year: '2018', title: 'International Debut', desc: 'First appearance representing India at WSPS World Cup.', icon: Calendar },
            { year: '2017', title: 'National Champion', desc: 'Won first Gold at the National Shooting Championship.', icon: HistoryIcon },
          ].map((item, i) => (
            <div key={i} className="relative pl-10">
              <div className="absolute -left-[11px] top-0 w-5 h-5 bg-white border-4 border-primary rounded-full" />
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                <span className="font-data font-bold text-primary bg-primary/5 px-3 py-1 rounded w-fit">
                  {item.year}
                </span>
                <div>
                  <h3 className="font-heading font-bold text-neutral-700 text-lg">{item.title}</h3>
                  <p className="text-neutral-500">{item.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

export default AthleteHistoryPage

