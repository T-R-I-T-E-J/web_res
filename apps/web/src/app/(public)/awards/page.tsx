import type { Metadata } from 'next'
import { Trophy, Medal, Star, Award, Crown, Zap } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Awards & Recognition | STC Para Shooting',
  description: 'Celebrating excellence in Para Shooting. Discover our annual awards, hall of fame, and achievement recognition.',
}

export default function AwardsPage() {
  const currentAwards = [
    {
      title: 'Shooter of the Year',
      category: 'Rifle (SH1)',
      winner: 'Avani Lekhara',
      image: '/images/awards/shooter-year.jpg', // Placeholder
      description: 'Awarded for outstanding performance in international events.',
      icon: Trophy,
      color: 'text-amber-500',
      bg: 'bg-amber-500/10',
    },
    {
      title: 'Rising Star',
      category: 'Pistol (SH1)',
      winner: 'Rudransh Khandelwal',
      image: '/images/awards/rising-star.jpg', // Placeholder
      description: 'Recognizing exceptional potential and rapid improvement.',
      icon: Star,
      color: 'text-blue-500',
      bg: 'bg-blue-500/10',
    },
    {
      title: 'Coach of the Year',
      category: 'National Team',
      winner: 'Chandra Shekhar',
      image: '/images/awards/coach.jpg', // Placeholder
      description: 'For dedicated mentorship and team success.',
      icon: Medal,
      color: 'text-emerald-500',
      bg: 'bg-emerald-500/10',
    },
  ]

  const hallOfFame = [
    { name: 'Manish Narwal', year: '2024', achievement: 'Paralympic Gold Medalist' },
    { name: 'Singhraj Adhana', year: '2024', achievement: 'Paralympic Silver & Bronze' },
    { name: 'Rubina Francis', year: '2023', achievement: 'World Record Holder' },
    { name: 'Sidhartha Babu', year: '2023', achievement: 'Asian Para Games Champion' },
  ]

  return (
    <div className="bg-neutral-50 min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 bg-primary overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10"></div>
        <div className="container-main relative z-10 text-center text-white">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6 animate-fade-in-up">
            <Crown className="w-4 h-4 text-accent" />
            <span className="text-sm font-medium tracking-wide uppercase">Celebrating Excellence</span>
          </div>
          <h1 className="font-heading text-4xl md:text-6xl font-bold mb-6 animate-fade-in-up delay-100">
            Awards & <span className="text-accent-gradient">Recognition</span>
          </h1>
          <p className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto animate-fade-in-up delay-200">
            Honoring the dedication, skill, and triumphs of our extraordinary para-shooters.
          </p>
        </div>
      </section>

      {/* Featured Awards */}
      <section className="py-16 container-main">
        <div className="text-center mb-12">
          <h2 className="font-heading text-3xl font-bold text-primary mb-4">Current Champions</h2>
          <div className="h-1 w-20 bg-accent mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {currentAwards.map((award, index) => (
            <div key={index} className="group bg-white rounded-card shadow-card hover:shadow-lg transition-all duration-300 overflow-hidden border border-neutral-100">
              <div className="h-48 bg-neutral-200 relative overflow-hidden">
                {/* Fallback pattern if image fails */}
                <div className={`absolute inset-0 ${award.bg} opacity-20 group-hover:opacity-30 transition-opacity`}></div>
                <div className="absolute inset-0 flex items-center justify-center">
                   <award.icon className={`w-16 h-16 ${award.color}`} />
                </div>
              </div>
              <div className="p-6 relative">
                 <div className="absolute -top-8 right-6 w-12 h-12 bg-white rounded-full shadow-md flex items-center justify-center border-2 border-neutral-50">
                    <award.icon className={`w-6 h-6 ${award.color}`} />
                 </div>
                <h3 className="text-2xl font-heading font-bold text-neutral-800 mb-1">{award.winner}</h3>
                <p className="text-sm font-medium text-accent uppercase tracking-wider mb-3">{award.title}</p>
                <div className="w-full h-px bg-neutral-100 my-3"></div>
                <p className="text-neutral-600 text-sm">{award.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Hall of Fame / Past Winners */}
      <section className="py-16 bg-white border-t border-neutral-200">
        <div className="container-main">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <h2 className="font-heading text-3xl font-bold text-primary mb-2">Hall of Fame</h2>
              <p className="text-neutral-600">Legends who have made history for India.</p>
            </div>
            <button className="btn-outline">View All History</button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {hallOfFame.map((item, i) => (
              <div key={i} className="p-6 rounded-card bg-neutral-50 border border-neutral-100 hover:border-primary/20 transition-colors">
                 <div className="flex items-start justify-between mb-4">
                    <div className="p-2 bg-white rounded-full shadow-sm">
                        <Award className="w-6 h-6 text-primary" />
                    </div>
                    <span className="text-xs font-bold bg-neutral-200 text-neutral-700 px-2 py-1 rounded-full">{item.year}</span>
                 </div>
                 <h4 className="font-bold text-lg text-neutral-800 mb-1">{item.name}</h4>
                 <p className="text-sm text-neutral-500">{item.achievement}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-secondary text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-accent/10 rounded-full blur-3xl"></div>
        
        <div className="container-main relative z-10 text-center">
          <Zap className="w-12 h-12 text-accent mx-auto mb-6" />
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">Nominate for Next Season</h2>
          <p className="text-blue-100 max-w-xl mx-auto mb-8">
            Know a shooter or coach who deserves recognition? Nominations for the upcoming season awards are now open.
          </p>
          <button className="btn-primary bg-accent text-primary hover:bg-white hover:text-primary border-transparent">
            Submit Nomination
          </button>
        </div>
      </section>
    </div>
  )
}
