import Image from 'next/image'
import type { Metadata } from 'next'
import { Users } from 'lucide-react'

export const metadata: Metadata = {
  title: 'About STC Para Shooting',
  description: 'Learn about STC Para Shooting (PCI) - our history, mission, and leadership.',
}

const committeeMembers = [
  { name: 'Dr. Deepa Malik', position: 'President, PCI', since: '2020' },
  { name: 'Mr. Gursharan Singh', position: 'Secretary General, PCI', since: '2020' },
  { name: 'Mr. Jaiprakash Nautiyal', position: 'Chairperson, STC Shooting', since: '2015' },
  { name: 'Mr. Rahul Swami', position: 'Chief Administrator', since: '2021' },
]


const AboutPage = () => {
  return (
    <>


      {/* Breadcrumb */}
      <nav className="bg-neutral-50 border-b border-neutral-200 py-4 text-sm" aria-label="Breadcrumb">
        <div className="container-main">
          <ol className="flex items-center gap-2 text-neutral-500">
            <li><a href="/" className="hover:text-primary transition-colors">Home</a></li>
            <li>/</li>
            <li className="text-neutral-900 font-medium">About Us</li>
          </ol>
        </div>
      </nav>

      {/* Introduction Section */}
      <section id="intro" className="section bg-white">
        <div className="container-main">
          <h2 className="section-title">Introduction</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            <div className="prose prose-lg text-neutral-700 space-y-6 leading-relaxed">
              <p>
                Disabled at birth or rendered differently abled due to unforeseen accidents, our para shooters have never allowed circumstance to define their limits. Rather than seeking sympathy, they have emerged as powerful symbols of determination, self-belief, resilience, and an indomitable never-say-die spirit. Through grit and discipline, they continue to inspire the nation by transforming adversity into excellence.
              </p>
              <p>
                The journey of STC Para Shooting in India truly began in 2015, making it a relatively young sport in terms of global presence and elite-level performance. Yet, in this short span, the progress has been extraordinary. Across two Paralympic Games—Tokyo and Paris—India's para shooters have secured an impressive total of nine medals: three Gold, two Silver, and four Bronze. These achievements stand as a testament to focused vision, structured development, and unwavering commitment.
              </p>
              <p>
                STC Para Shooting has witnessed exponential growth across every dimension. There has been a remarkable increase in the number of para shooters, international medals, and world records, alongside the development of world-class WSPS technical officials and certified medical classifiers. Indian para shooters have also consistently secured first positions at multiple World Cups, asserting their dominance on the global stage.
              </p>
              <p>
                Today, India's STC Para Shooting ecosystem represents a true paradigm shift—rising from obscurity to global leadership. From having virtually no presence to standing at the very top of the world, this journey reflects not just sporting success, but the triumph of human spirit, vision, and purpose.
              </p>
              <div className="mt-10 pt-6 border-t border-neutral-100">
                <p className="font-heading font-bold text-lg text-neutral-900">Jaiprakash Nautiyal</p>
                <p className="text-sm font-medium text-neutral-600">Dronacharya Awardee</p>
                <p className="text-sm text-neutral-500">Chairman, STC Para Shooting</p>
              </div>
            </div>
            
            {/* Right Column: Image */}
            <div className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl border-4 border-white ring-1 ring-neutral-200 mt-4 lg:mt-0">
              <Image 
                src="/assets/images/president-award.jpg" 
                alt="Jaiprakash Nautiyal receiving the Dronacharya Award from the President of India" 
                fill 
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                <p className="text-white font-medium text-sm">Receiving the Dronacharya Award</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* History Section */}
      <section id="history" className="section bg-neutral-50">
        <div className="container-main">
          <h2 className="section-title">History of STC Para Shooting</h2>
          <div className="max-w-3xl pt-2">
            <div className="space-y-8 relative before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-0.5 before:bg-primary/20">
              {[
                { year: '2015', event: 'The journey of STC Para Shooting in India truly begins' },
                { year: '2021', event: 'First Zonal Para Shooting Championship (February)' },
                { year: '2021', event: 'First National Para Shooting Championship (March)' },
                { year: '2021', event: 'Historic performance at Tokyo Paralympics (5 Medals)' },
                { year: '2022', event: 'Best-ever World Championship performance (5 Medals)' },
                { year: '2024', event: 'Record medal haul at Paris Paralympics' },
              ].map((item) => (
                <div key={item.year + item.event} className="flex gap-6 pl-0 relative group">
                  <div className="w-10 h-10 flex-shrink-0 bg-white border-4 border-primary rounded-full z-10 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300">
                    <div className="w-2 h-2 bg-primary rounded-full" />
                  </div>
                  <div className="pt-1">
                    <div className="font-heading font-bold text-xl text-primary mb-1">{item.year}</div>
                    <div className="text-lg text-neutral-700 leading-snug">{item.event}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Executive Committee Section */}
      <section id="committee" className="section bg-white">
        <div className="container-main">
          <h2 className="section-title">Executive Committee</h2>
          <p className="text-neutral-600 text-lg mb-10 max-w-2xl leading-relaxed">
            Our leadership team is committed to advancing para shooting sports in India through 
            strategic initiatives and athlete-centered programs under PCI.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {committeeMembers.map((member) => (
              <div key={member.name} className="card bg-white border border-neutral-100 shadow-sm hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300 p-8 flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-primary/5 rounded-full mb-6 flex items-center justify-center text-primary">
                  <Users className="w-8 h-8" strokeWidth={1.5} />
                </div>
                <h3 className="font-heading font-bold text-xl text-neutral-900 mb-2">{member.name}</h3>
                <p className="text-primary font-semibold mb-4">{member.position}</p>
                <div className="mt-auto pt-4 border-t border-neutral-100 w-full">
                   <p className="text-xs font-medium text-neutral-400 uppercase tracking-widest">Since {member.since}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


    </>
  )
}

export default AboutPage
