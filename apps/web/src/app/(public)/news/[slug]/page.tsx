import type { Metadata } from 'next'
import Link from 'next/link'
import { Calendar, ArrowLeft, Share2, Facebook, Twitter, Linkedin } from 'lucide-react'

// Mock data - in production this would come from an API/CMS
const newsArticles: Record<string, {
  title: string
  excerpt: string
  content: string[]
  category: string
  date: string
  author: string
}> = {
  'election-2025': {
    title: 'Para Shooting Election 2025',
    excerpt: 'Important updates regarding the upcoming elections for the Para Shooting Committee of India.',
    content: [
      'The Para Shooting Committee of India announces the upcoming elections for the executive committee for the term 2025-2029. All affiliated units, state associations, and registered members are requested to take note of the following important information.',
      'The election process will be conducted in accordance with the constitution of the Para Shooting Committee of India and the guidelines issued by the Paralympic Committee of India. Nominations for various positions will be accepted from January 1, 2026, to January 15, 2026.',
      'Eligible candidates must have been active members of the committee for at least two consecutive years and must be nominated by a recognized state association. All nominations must be accompanied by the prescribed nomination form, a declaration of eligibility, and supporting documents.',
      'The election will be held on February 15, 2026, at the Para Shooting House, New Delhi. Detailed guidelines regarding the election process, eligibility criteria, and voting procedures will be circulated to all affiliated units shortly.',
      'Members are requested to update their contact information with the committee secretariat to ensure timely receipt of election-related communications.',
    ],
    category: 'Announcement',
    date: 'December 20, 2025',
    author: 'PSCI Secretariat',
  },
  'shooting-league': {
    title: 'Shooting League of India - Season 2026',
    excerpt: 'Registration for the new season of Shooting League of India is now open.',
    content: [
      'The Shooting League of India announces the commencement of registrations for the 2026 season. This prestigious league provides a platform for para shooters across the country to compete at the highest level.',
      'The league will feature multiple rounds of competition across different venues in India, culminating in a grand finale in New Delhi. Athletes will compete in various categories including Air Rifle, Air Pistol, and supported events.',
      'Registration is open to all licensed para shooters who have achieved the minimum qualifying scores (MQS) in their respective events. Athletes must have valid medical classification and a current sports license issued by the PSCI.',
      'Early bird registration closes on January 31, 2026. Athletes registering before this date will receive a discount on the participation fee. Regular registration will remain open until February 28, 2026.',
      'For registration details and required documents, please visit the official Shooting League portal or contact the PSCI secretariat.',
    ],
    category: 'Event',
    date: 'December 18, 2025',
    author: 'PSCI Events Team',
  },
  'nationals-2025': {
    title: '68th National Shooting Championship 2025',
    excerpt: 'Dates and venues for the 68th National Shooting Championship have been officially announced.',
    content: [
      'The Para Shooting Committee of India is pleased to announce the schedule for the 68th National Shooting Championship. This championship will be held across multiple phases at different venues across the country.',
      'Phase 1 - Para Rifle Events: December 15-20, 2025, at the Dr. Karni Singh Shooting Range, New Delhi. Events include 10m Air Rifle Standing SH1 and SH2, 50m Rifle 3 Positions SH1, and 50m Rifle Prone SH1 and SH2.',
      'Phase 2 - Para Pistol Events: January 10-15, 2026, at the M.P. State Shooting Academy, Bhopal. Events include 10m Air Pistol SH1, 25m Pistol SH1, and 50m Pistol SH1.',
      'All state associations are requested to submit their entries through the online portal by the specified deadlines. Late entries will not be accepted. Athletes must ensure their medical classification is valid and their competition licenses are current.',
      'Accommodation and logistical support will be provided at the venue. Detailed bulletins with complete event schedules, entry fees, and other information will be published on the official PSCI website.',
    ],
    category: 'Championship',
    date: 'December 15, 2025',
    author: 'PSCI Technical Committee',
  },
  'paris-paralympics-success': {
    title: 'Historic Success at Paris Paralympics 2024',
    excerpt: 'Indian para shooters created history at the Paris Paralympics 2024.',
    content: [
      'The Paris Paralympics 2024 marked a historic milestone for Indian para shooting as our athletes delivered their best-ever performance at the Paralympic Games. The team returned home with an impressive medal haul that has set new benchmarks for the sport in India.',
      'The Indian contingent showcased exceptional skill, determination, and mental fortitude across multiple events. Our shooters competed against the world\'s best and emerged victorious in several categories.',
      'This success is a testament to the systematic development programs, world-class training facilities, and dedicated coaching infrastructure that has been established over the past decade. The achievements at Paris 2024 have inspired a new generation of para athletes.',
      'The Para Shooting Committee of India extends its heartfelt congratulations to all medal winners and participants. We also acknowledge the tireless efforts of coaches, support staff, and sports scientists who played a crucial role in this success.',
      'Looking ahead, the committee is committed to building on this momentum as we prepare for the Los Angeles 2028 Paralympic Games.',
    ],
    category: 'Achievement',
    date: 'September 10, 2024',
    author: 'PSCI Media Team',
  },
  'avani-lekhara-gold': {
    title: 'Avani Lekhara Defends Paralympic Gold',
    excerpt: 'Avani Lekhara became the first Indian woman to win two Paralympic gold medals.',
    content: [
      'In a moment of supreme sporting excellence, Avani Lekhara etched her name in the annals of Paralympic history by becoming the first Indian woman to win two Paralympic gold medals. She successfully defended her title in the 10m Air Rifle Standing SH1 event at the Paris Paralympics 2024.',
      'Avani shot a total of 249.7 points in the final, showcasing remarkable composure and precision under pressure. Her performance was a masterclass in concentration and technical excellence.',
      'This achievement follows her historic gold medal at the Tokyo Paralympics 2021, where she became the first Indian woman to win a Paralympic gold medal in shooting. Her journey from a car accident victim to a double Paralympic champion is an inspiration to millions.',
      'The Para Shooting Committee of India is immensely proud of Avani\'s achievement. Her success reflects the potential of Indian para athletes and the effectiveness of our training programs.',
      'Avani received a hero\'s welcome upon her return to India, with the government and various sports bodies honoring her remarkable achievement.',
    ],
    category: 'Achievement',
    date: 'September 5, 2024',
    author: 'PSCI Media Team',
  },
  'world-cup-2024': {
    title: 'India Dominates at WSPS World Cup 2024',
    excerpt: 'Indian para shooters showcased exceptional performance at the WSPS World Cup 2024.',
    content: [
      'The Indian para shooting team delivered a dominant performance at the WSPS World Cup 2024, securing multiple medals and reaffirming India\'s position as a powerhouse in international para shooting.',
      'Our athletes competed across various events and achieved podium finishes in both rifle and pistol categories. The team\'s preparation and form heading into the competition were evident from the first day.',
      'Several Indian shooters also achieved new personal bests during the competition, indicating their continuous improvement and potential for future success at major championships.',
      'The World Cup served as an important preparation event for the Paris Paralympics, and the results demonstrated that our athletes were in peak form.',
      'The coaching staff implemented strategic changes in training methodology leading up to the World Cup, which clearly paid dividends in the competition.',
    ],
    category: 'Competition',
    date: 'August 20, 2024',
    author: 'PSCI Technical Team',
  },
  'training-camp-announcement': {
    title: 'National Training Camp Announced',
    excerpt: 'The Para Shooting Committee of India announces a national training camp.',
    content: [
      'The Para Shooting Committee of India announces a national training camp for selected athletes ahead of upcoming international competitions. The camp will be held at the Dr. Karni Singh Shooting Range, New Delhi.',
      'Athletes have been selected based on their performances at recent national championships and international events. The camp will focus on technical refinement, mental conditioning, and competition simulation.',
      'The training program will be led by national coaches with support from international experts in sports science, psychology, and biomechanics. Athletes will have access to state-of-the-art equipment and facilities.',
      'Selected athletes are required to report by the specified date with all necessary documents and equipment. Detailed joining instructions will be sent to selected athletes individually.',
      'The camp is part of the committee\'s preparation strategy for the upcoming Paralympic cycle.',
    ],
    category: 'Training',
    date: 'July 15, 2024',
    author: 'PSCI High Performance Team',
  },
  'equipment-regulations-update': {
    title: 'New Equipment Regulations for 2025',
    excerpt: 'Important updates to equipment regulations for the 2025 season.',
    content: [
      'The Para Shooting Committee of India announces important updates to equipment regulations effective from January 1, 2025. All athletes, coaches, and equipment officials are advised to familiarize themselves with these changes.',
      'The new regulations align with the latest WSPS (World Shooting Para Sport) equipment rules and include updates to permitted rifle and pistol specifications, clothing requirements, and support equipment.',
      'Athletes using equipment that does not comply with the new regulations will not be permitted to compete in PSCI-sanctioned events from 2025 onwards. Equipment checks will be strictly enforced at all competitions.',
      'A detailed document outlining all regulation changes is available on the PSCI website. Athletes are encouraged to have their equipment inspected by certified officials before the new season begins.',
      'For any queries regarding equipment compliance, please contact the PSCI Technical Committee.',
    ],
    category: 'Regulation',
    date: 'June 30, 2024',
    author: 'PSCI Technical Committee',
  },
}

const relatedArticles = [
  { slug: 'election-2025', title: 'Para Shooting Election 2025', date: 'Dec 20, 2025' },
  { slug: 'shooting-league', title: 'Shooting League of India - Season 2026', date: 'Dec 18, 2025' },
  { slug: 'nationals-2025', title: '68th National Shooting Championship 2025', date: 'Dec 15, 2025' },
]

type Params = Promise<{ slug: string }>

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params
  const article = newsArticles[slug]
  
  if (!article) {
    return {
      title: 'Article Not Found',
    }
  }
  
  return {
    title: article.title,
    description: article.excerpt,
  }
}

export default async function NewsArticlePage({ params }: { params: Params }) {
  const { slug } = await params
  const article = newsArticles[slug]
  
  if (!article) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-heading text-4xl font-bold text-primary mb-4">Article Not Found</h1>
          <p className="text-neutral-600 mb-8">The article you're looking for doesn't exist.</p>
          <Link href="/news" className="btn-primary">
            Back to News
          </Link>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Hero Section */}
      <section className="gradient-hero py-12 md:py-16 text-white">
        <div className="container-main">
          <Link 
            href="/news" 
            className="inline-flex items-center text-white/80 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to News
          </Link>
          <div className="max-w-3xl">
            <span className="inline-block bg-accent text-white text-xs font-bold px-3 py-1 rounded-full mb-4">
              {article.category}
            </span>
            <h1 className="font-heading text-3xl md:text-4xl font-bold mb-4">
              {article.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-white/80 text-sm">
              <span className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {article.date}
              </span>
              <span>•</span>
              <span>By {article.author}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Breadcrumb */}
      <nav className="bg-neutral-100 py-3 text-sm" aria-label="Breadcrumb">
        <div className="container-main">
          <ol className="flex items-center gap-2 flex-wrap">
            <li><Link href="/" className="text-interactive hover:text-primary">Home</Link></li>
            <li className="text-neutral-400">/</li>
            <li><Link href="/news" className="text-interactive hover:text-primary">News</Link></li>
            <li className="text-neutral-400">/</li>
            <li className="text-neutral-600 truncate max-w-[200px]">{article.title}</li>
          </ol>
        </div>
      </nav>

      {/* Article Content */}
      <section className="section bg-white">
        <div className="container-main">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Featured Image Placeholder */}
              <div className="aspect-[16/9] rounded-card overflow-hidden bg-neutral-100 mb-8">
                <div className="w-full h-full bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
                  <span className="text-8xl">📰</span>
                </div>
              </div>

              {/* Article Body */}
              <div className="prose prose-lg max-w-none">
                {article.content.map((paragraph, index) => (
                  <p key={index} className="text-neutral-700 leading-relaxed mb-6">
                    {paragraph}
                  </p>
                ))}
              </div>

              {/* Share Section */}
              <div className="mt-12 pt-8 border-t border-neutral-200">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-2 text-neutral-600 font-medium">
                    <Share2 className="w-5 h-5" />
                    Share this article:
                  </span>
                  <div className="flex gap-2">
                    <a
                      href="#"
                      className="w-10 h-10 bg-[#1877f2] rounded-full flex items-center justify-center text-white hover:opacity-90 transition-opacity"
                      aria-label="Share on Facebook"
                    >
                      <Facebook className="w-5 h-5" />
                    </a>
                    <a
                      href="#"
                      className="w-10 h-10 bg-[#1da1f2] rounded-full flex items-center justify-center text-white hover:opacity-90 transition-opacity"
                      aria-label="Share on Twitter"
                    >
                      <Twitter className="w-5 h-5" />
                    </a>
                    <a
                      href="#"
                      className="w-10 h-10 bg-[#0077b5] rounded-full flex items-center justify-center text-white hover:opacity-90 transition-opacity"
                      aria-label="Share on LinkedIn"
                    >
                      <Linkedin className="w-5 h-5" />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              {/* Related Articles */}
              <div className="card">
                <h3 className="font-heading font-bold text-lg text-primary mb-4">Related Articles</h3>
                <div className="space-y-4">
                  {relatedArticles.filter(a => a.slug !== slug).map((related) => (
                    <Link
                      key={related.slug}
                      href={`/news/${related.slug}`}
                      className="block group"
                    >
                      <h4 className="font-medium text-neutral-700 group-hover:text-primary transition-colors line-clamp-2">
                        {related.title}
                      </h4>
                      <span className="text-xs text-neutral-400 mt-1 block">{related.date}</span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Quick Links */}
              <div className="card mt-6">
                <h3 className="font-heading font-bold text-lg text-primary mb-4">Quick Links</h3>
                <ul className="space-y-2">
                  <li>
                    <Link href="/events" className="text-neutral-600 hover:text-primary transition-colors text-sm">
                      → Upcoming Events
                    </Link>
                  </li>
                  <li>
                    <Link href="/results" className="text-neutral-600 hover:text-primary transition-colors text-sm">
                      → Competition Results
                    </Link>
                  </li>
                  <li>
                    <Link href="/downloads" className="text-neutral-600 hover:text-primary transition-colors text-sm">
                      → Criteria & Documents
                    </Link>
                  </li>
                  <li>
                    <Link href="/contact" className="text-neutral-600 hover:text-primary transition-colors text-sm">
                      → Contact Us
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

