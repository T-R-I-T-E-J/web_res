import Link from 'next/link'
import { ArrowRight, Calendar, Trophy } from 'lucide-react'

type HeroProps = {
  title?: string
  subtitle?: string
  showCTA?: boolean
}

const HeroSection = ({
  title = 'Para Shooting Committee of India',
  subtitle = 'Empowering para-athletes to achieve excellence in shooting sports',
  showCTA = true,
}: HeroProps) => {
  return (
    <section className="gradient-hero relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-white/20 rounded-full -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/20 rounded-full translate-x-1/2 translate-y-1/2" />
      </div>

      <div className="container-main relative py-20 md:py-28 text-center">
        <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 text-balance">
          {title}
        </h1>
        <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto mb-8">
          {subtitle}
        </p>

        {showCTA && (
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/events"
              className="btn bg-accent text-white hover:bg-accent-dark group"
            >
              <Calendar className="w-5 h-5 mr-2" />
              Upcoming Events
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/rankings"
              className="btn bg-white/10 text-white border-2 border-white/30 hover:bg-white/20"
            >
              <Trophy className="w-5 h-5 mr-2" />
              View Rankings
            </Link>
          </div>
        )}

        {/* Quick stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 max-w-3xl mx-auto">
          {[
            { value: '500+', label: 'Active Shooters' },
            { value: '35', label: 'State Associations' },
            { value: '50+', label: 'Events/Year' },
            { value: '100+', label: 'International Medals' },
          ].map((stat) => (
            <div key={stat.label} className="bg-white/10 backdrop-blur rounded-card p-4">
              <div className="font-heading text-2xl md:text-3xl font-bold text-white">
                {stat.value}
              </div>
              <div className="text-sm text-white/80">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default HeroSection

