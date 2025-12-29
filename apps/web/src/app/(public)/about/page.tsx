import type { Metadata } from 'next'
import { Users, History } from 'lucide-react'

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn about the Para Shooting Committee of India - our history, mission, and leadership.',
}

const committeeMembers = [
  { name: 'Mr. Raninder Singh', position: 'President', since: '2008' },
  { name: 'Mr. K. Sultan Singh', position: 'Senior Vice President', since: '2012' },
  { name: 'Mr. Kalikesh Narayan Singh Deo', position: 'Vice President', since: '2014' },
  { name: 'Mr. D.V. Seetharama Rao', position: 'Secretary General', since: '2010' },
  { name: 'Mr. Rajiv Bhatia', position: 'Treasurer', since: '2016' },
]

const achievements = [
  { year: '2024', event: 'Paris Paralympics', medals: '4 Gold, 2 Silver, 3 Bronze' },
  { year: '2023', event: 'World Championships', medals: '2 Gold, 4 Silver' },
  { year: '2022', event: 'Asian Para Games', medals: '8 Gold, 5 Silver, 7 Bronze' },
  { year: '2021', event: 'Tokyo Paralympics', medals: '2 Gold, 1 Silver, 2 Bronze' },
]

const AboutPage = () => {
  return (
    <>
      {/* Hero Banner */}
      <section className="gradient-hero py-16 md:py-20">
        <div className="container-main text-center">
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-white mb-4">
            About Para Shooting India
          </h1>
          <p className="text-white/90 max-w-2xl mx-auto">
            Dedicated to promoting and developing para shooting sports across India since 1951
          </p>
        </div>
      </section>

      {/* Breadcrumb */}
      <nav className="bg-neutral-100 py-3 text-sm" aria-label="Breadcrumb">
        <div className="container-main">
          <ol className="flex items-center gap-2">
            <li><a href="/" className="text-interactive hover:text-primary">Home</a></li>
            <li className="text-neutral-400">/</li>
            <li className="text-neutral-600">About Us</li>
          </ol>
        </div>
      </nav>

      {/* Introduction Section */}
      <section id="intro" className="section bg-white">
        <div className="container-main">
          <div className="max-w-4xl mx-auto">
            <h2 className="section-title text-center">Introduction</h2>
            <div className="prose prose-lg text-neutral-600 space-y-6 text-center">
              <p>
                Disabled at birth or rendered differently abled due to unforeseen accidents, our para shooters have never allowed circumstance to define their limits. Rather than seeking sympathy, they have emerged as powerful symbols of determination, self-belief, resilience, and an indomitable never-say-die spirit. Through grit and discipline, they continue to inspire the nation by transforming adversity into excellence.
              </p>
              <p>
                The journey of Para Shooting in India truly began in 2015, making it a relatively young sport in terms of global presence and elite-level performance. Yet, in this short span, the progress has been extraordinary. Across two Paralympic Games—Tokyo and Paris—India's para shooters have secured an impressive total of nine medals: three Gold, two Silver, and four Bronze. These achievements stand as a testament to focused vision, structured development, and unwavering commitment.
              </p>
              <p>
                Para Shooting in India has witnessed exponential growth across every dimension. There has been a remarkable increase in the number of para shooters, international medals, and world records, alongside the development of world-class WSPS technical officials and certified medical classifiers. Indian para shooters have also consistently secured first positions at multiple World Cups, asserting their dominance on the global stage.
              </p>
              <p>
                Today, India's para shooting ecosystem represents a true paradigm shift—rising from obscurity to global leadership. From having virtually no presence to standing at the very top of the world, this journey reflects not just sporting success, but the triumph of human spirit, vision, and purpose.
              </p>
              <div className="mt-8 text-right">
                <p className="font-semibold text-primary">Jaiprakash Nautiyal</p>
                <p className="text-sm text-neutral-500">Dronacharya Awardee</p>
                <p className="text-sm text-neutral-500">Chairman, STC Para Shooting</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Embedded Document Section */}
      <section className="section bg-neutral-50">
        <div className="container-main">
          <h2 className="section-title text-center">Para Shooting Criteria Document</h2>
          <p className="text-neutral-600 text-center mb-8 max-w-2xl mx-auto">
            View the official Para Shooting criteria and guidelines document below.
          </p>
          <div className="max-w-5xl mx-auto">
            <div className="bg-white rounded-card shadow-card overflow-hidden border border-neutral-200">
              <iframe
                src="/para-shooting-criteria.pdf"
                className="w-full h-[800px]"
                title="Para Shooting Criteria Document"
              />
            </div>
            <div className="mt-4 text-center">
              <a
                href="/para-shooting-criteria.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary inline-flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Download Full Document
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* History Section */}
      <section id="history" className="section bg-white">
        <div className="container-main">
          <h2 className="section-title">Our History</h2>
          <div className="max-w-3xl">
            <div className="space-y-6 relative before:absolute before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-primary/20">
              {[
                { year: '1951', event: 'Para Shooting Committee of India established' },
                { year: '1972', event: 'First National Para Shooting Championship organized' },
                { year: '1984', event: 'First participation in Paralympics (Seoul)' },
                { year: '2000', event: 'First Paralympic medal in Shooting' },
                { year: '2012', event: 'Established High-Performance Centre in New Delhi' },
                { year: '2021', event: 'Historic performance at Tokyo Paralympics' },
                { year: '2024', event: 'Record medal haul at Paris Paralympics' },
              ].map((item) => (
                <div key={item.year} className="flex gap-4 pl-10 relative">
                  <div className="absolute left-2 top-1 w-4 h-4 rounded-full bg-primary border-4 border-white" />
                  <div>
                    <div className="font-heading font-bold text-primary">{item.year}</div>
                    <div className="text-neutral-600">{item.event}</div>
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
          <p className="text-neutral-600 mb-8 max-w-2xl">
            Our leadership team is committed to advancing para shooting sports in India through 
            strategic initiatives and athlete-centered programs.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {committeeMembers.map((member) => (
              <div key={member.name} className="card text-center">
                <div className="w-20 h-20 bg-neutral-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Users className="w-10 h-10 text-neutral-400" />
                </div>
                <h3 className="font-heading font-semibold text-lg text-primary">{member.name}</h3>
                <p className="text-accent font-medium">{member.position}</p>
                <p className="text-sm text-neutral-500">Since {member.since}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Achievements */}
      <section className="section bg-neutral-50">
        <div className="container-main">
          <h2 className="section-title">Recent Achievements</h2>
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Year</th>
                  <th>Event</th>
                  <th>Medals</th>
                </tr>
              </thead>
              <tbody>
                {achievements.map((item) => (
                  <tr key={item.year + item.event}>
                    <td className="font-data font-semibold">{item.year}</td>
                    <td>{item.event}</td>
                    <td className="text-success font-medium">{item.medals}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

    </>
  )
}

export default AboutPage

