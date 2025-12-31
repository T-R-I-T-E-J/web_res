import type { Metadata } from 'next'
import { Users, Shield, Briefcase, Calendar, ChevronRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Leadership & Committee',
  description: 'Meet the executive committee and leadership of Para Shooting India.',
}

const leadershipData = {
  officeBearers: [
    { name: 'Mr. Raninder Singh', position: 'President', role: 'Strategic direction and overall governance of para shooting in India.' },
    { name: 'Mr. K. Sultan Singh', position: 'Senior Vice President', role: 'Support to President and management of national championships.' },
    { name: 'Mr. D.V. Seetharama Rao', position: 'Secretary General', role: 'Administrative head and primary contact for WSPS and Paralympic Committee of India.' },
    { name: 'Mr. Rajiv Bhatia', position: 'Treasurer', role: 'Financial management, budgeting, and audit compliance.' },
  ],
  executiveCommittee: [
    { name: 'Mr. Kalikesh Narayan Singh Deo', position: 'Vice President' },
    { name: 'Mr. Amit Khanna', position: 'Member' },
    { name: 'Ms. Sheila Kanungo', position: 'Member' },
    { name: 'Mr. Pawan Singh', position: 'Member' },
  ],
  subCommittees: [
    { name: 'Technical Committee', head: 'Mr. Pawan Singh', description: 'Rules compliance, equipment control, and range technical standards.' },
    { name: 'Selection Committee', head: 'Mr. Jaspal Rana', description: 'Identification of talent and selection trials for international squads.' },
    { name: 'Medical & Classification', head: 'Dr. S. Radhakrishnan', description: 'Functional classification of athletes and anti-doping coordination.' },
  ]
}

const LeadershipPage = () => {
  return (
    <>
      <section className="gradient-hero py-16 md:py-20 text-center text-white">
        <div className="container-main">
          <h1 className="font-heading text-3xl md:text-4xl font-bold mb-4">Leadership & Committee</h1>
          <p className="opacity-90 max-w-2xl mx-auto">
            Governed by a dedicated team of professionals committed to the excellence of para-athletes.
          </p>
        </div>
      </section>

      <section className="section bg-white">
        <div className="container-main">
          <h2 className="section-title">Office Bearers</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {leadershipData.officeBearers.map((member) => (
              <div key={member.name} className="card border-t-4 border-t-primary">
                <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mb-4">
                  <Users className="w-8 h-8 text-neutral-400" />
                </div>
                <h3 className="font-heading font-bold text-primary">{member.name}</h3>
                <p className="text-accent text-sm font-medium mb-3">{member.position}</p>
                <p className="text-xs text-neutral-500 leading-relaxed">{member.role}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="section-title">Executive Committee</h2>
              <div className="card p-0 overflow-hidden">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Position</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leadershipData.executiveCommittee.map((member) => (
                      <tr key={member.name}>
                        <td className="font-medium">{member.name}</td>
                        <td className="text-neutral-500 text-sm">{member.position}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="space-y-6">
              <h2 className="section-title">Specialized Sub-Committees</h2>
              {leadershipData.subCommittees.map((committee) => (
                <div key={committee.name} className="card bg-neutral-50 border-neutral-200">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-card flex items-center justify-center flex-shrink-0">
                      <Shield className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold text-primary">{committee.name}</h3>
                      <p className="text-xs text-accent font-medium mt-0.5">Head: {committee.head}</p>
                      <p className="text-xs text-neutral-600 mt-2">{committee.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section bg-neutral-50">
        <div className="container-main">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="section-title">Term & Tenure</h2>
            <div className="card mt-8">
              <div className="flex items-center justify-center gap-8 py-4">
                <div className="text-center">
                  <p className="text-sm text-neutral-500 uppercase font-bold tracking-wider">Current Term</p>
                  <p className="text-2xl font-bold text-primary">2024 - 2028</p>
                </div>
                <div className="w-px h-12 bg-neutral-200" />
                <div className="text-center">
                  <p className="text-sm text-neutral-500 uppercase font-bold tracking-wider">Next Election</p>
                  <p className="text-2xl font-bold text-accent">May 2028</p>
                </div>
              </div>
              <p className="text-sm text-neutral-600 mt-6 px-8">
                The committee serves a 4-year term in accordance with the National Sports Development Code of India and the PSCI Constitution.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default LeadershipPage

