import type { Metadata } from 'next'
import { Users, Award, Target, History, FileText, Shield } from 'lucide-react'

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
                The Para Shooting Committee of India (PSCI) is the national governing body 
                for para shooting sports in India. Established in 1951, we have been at the 
                forefront of promoting, developing, and managing competitive shooting for 
                para-athletes across the nation.
              </p>
              <p>
                As a member of World Shooting Para Sport (WSPS) and the Paralympic Committee 
                of India, we organize national championships, selection trials, and training 
                programs to identify and nurture shooting talent among athletes with disabilities.
              </p>
              <p>
                Our mission is to provide equal opportunities for para-athletes to excel in 
                shooting sports, representing India at international competitions including 
                the Paralympic Games, World Championships, and Asian Para Games.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* History Section */}
      <section id="history" className="section bg-neutral-50">
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

      {/* Constitution Section */}
      <section id="constitution" className="section bg-white">
        <div className="container-main">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="card">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-card flex items-center justify-center flex-shrink-0">
                  <FileText className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-heading font-semibold text-lg text-primary mb-2">Constitution</h3>
                  <p className="text-neutral-600 text-sm mb-4">
                    Download the official constitution and bylaws of the Para Shooting Committee of India.
                  </p>
                  <a href="/downloads/constitution.pdf" className="btn-primary text-sm py-2">
                    Download PDF
                  </a>
                </div>
              </div>
            </div>
            <div className="card">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-card flex items-center justify-center flex-shrink-0">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-heading font-semibold text-lg text-primary mb-2">Anti-Doping Policy</h3>
                  <p className="text-neutral-600 text-sm mb-4">
                    We are committed to clean sport. Read our anti-doping policies and guidelines.
                  </p>
                  <a href="/downloads/anti-doping.pdf" className="btn-primary text-sm py-2">
                    View Policy
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default AboutPage

