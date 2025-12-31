import Link from 'next/link'

type HeroProps = {
  title?: string
  subtitle?: string
}

export const HeroSection = ({
  title = 'STC Para Shooting (Paralympic Committee of India)',
  subtitle = 'Empowering para-athletes to achieve excellence in shooting sports',
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
        <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
          {subtitle}
        </p>
      </div>
    </section>
  )
}



