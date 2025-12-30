import type { Metadata } from 'next'
import Image from 'next/image'
import { ExternalLink, Camera } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Media',
  description: 'View photos and videos from para shooting championships and events across India.',
}

const GOOGLE_DRIVE_FOLDER_URL = 'https://drive.google.com/drive/folders/1GDxNaRyxYNDAtpQXoAKdPT1vcG3HQpNl?usp=drive_link'

const videos = [
  { id: 'PVKBcmWnlHw', title: 'National Para Shooting Championship Highlights' },
  { id: 'CC5oe68AkqE', title: 'Avani Lekhara - Gold Medal Moment Paris 2024' },
]

const GalleryPage = () => {
  return (
    <>
      <section className="gradient-hero py-16 md:py-20 text-center text-white">
        <div className="container-main">
          <h1 className="font-heading text-3xl md:text-4xl font-bold mb-4">Media</h1>
          <p className="opacity-90 max-w-2xl mx-auto">
            Capturing the spirit of excellence and determination in para shooting.
          </p>
        </div>
      </section>

      {/* 6th National Para Shooting Championship Gallery */}
      <section className="section bg-gradient-to-br from-primary via-primary to-secondary text-white">
        <div className="container-main">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Left Content */}
            <div>
              <span className="inline-block bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full mb-4">
                PHOTO GALLERY
              </span>
              <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">
                6th National Para Shooting Championship
              </h2>
              <p className="text-white/80 mb-6 leading-relaxed">
                Relive the memorable moments from our championship. Browse through photos 
                from the opening ceremony, competition days, medal ceremonies, and 
                exclusive behind-the-scenes moments.
              </p>
              <div className="flex flex-wrap gap-3 mb-8">
                <span className="bg-white/10 px-3 py-1 rounded-full text-sm">Opening Ceremony</span>
                <span className="bg-white/10 px-3 py-1 rounded-full text-sm">Day 1-5 Events</span>
                <span className="bg-white/10 px-3 py-1 rounded-full text-sm">Medal Ceremonies</span>
                <span className="bg-white/10 px-3 py-1 rounded-full text-sm">Videos</span>
              </div>
              <a
                href={GOOGLE_DRIVE_FOLDER_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-white text-primary font-bold px-6 py-3 rounded-card hover:bg-neutral-100 transition-colors shadow-lg"
              >
                <Camera className="w-5 h-5" />
                View Full Gallery
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
            
            {/* Right - Image Grid Preview */}
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-3">
                <div className="aspect-square rounded-card overflow-hidden shadow-lg">
                  <Image
                    src="/participants/participant-1.jpeg"
                    alt="Championship participant"
                    width={200}
                    height={200}
                    className="w-full h-full object-cover hover:scale-105 transition-transform"
                  />
                </div>
                <div className="aspect-[4/3] rounded-card overflow-hidden shadow-lg">
                  <Image
                    src="/participants/participant-2.jpeg"
                    alt="Championship participant"
                    width={200}
                    height={150}
                    className="w-full h-full object-cover hover:scale-105 transition-transform"
                  />
                </div>
              </div>
              <div className="space-y-3 pt-6">
                <div className="aspect-[4/3] rounded-card overflow-hidden shadow-lg">
                  <Image
                    src="/participants/participant-3.jpeg"
                    alt="Championship participant"
                    width={200}
                    height={150}
                    className="w-full h-full object-cover hover:scale-105 transition-transform"
                  />
                </div>
                <div className="aspect-square rounded-card overflow-hidden shadow-lg">
                  <Image
                    src="/participants/participant-4.jpeg"
                    alt="Championship participant"
                    width={200}
                    height={200}
                    className="w-full h-full object-cover hover:scale-105 transition-transform"
                  />
                </div>
              </div>
              <div className="space-y-3">
                <div className="aspect-square rounded-card overflow-hidden shadow-lg">
                  <Image
                    src="/participants/participant-5.jpeg"
                    alt="Championship participant"
                    width={200}
                    height={200}
                    className="w-full h-full object-cover hover:scale-105 transition-transform"
                  />
                </div>
                <div className="aspect-[4/3] rounded-card overflow-hidden shadow-lg relative group">
                  <Image
                    src="/participants/participant-6.jpeg"
                    alt="Championship participant"
                    width={200}
                    height={150}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <span className="text-white font-bold text-xl">14+</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Video Gallery */}
      <section id="videos" className="section bg-white">
        <div className="container-main">
          <h2 className="section-title">Video Gallery</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
            {videos.map((video) => (
              <div key={video.id} className="space-y-4">
                <div className="aspect-video rounded-card overflow-hidden shadow-card border border-neutral-100">
                  <iframe
                    className="w-full h-full"
                    src={`https://www.youtube.com/embed/${video.id}`}
                    title={video.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
                <h3 className="font-bold text-neutral-700">{video.title}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Press Coverage - HIDDEN (Mock Data) */}
      {/* 
      <section id="press" className="section bg-neutral-50">
        <div className="container-main">
          <h2 className="section-title">Press Coverage</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {[
              { source: 'The Hindu', title: 'India shines at Paris Para Shooting World Cup', date: 'Oct 12, 2024' },
              { source: 'Times of India', title: 'Avani Lekhara defends Gold at Paralympics', date: 'Aug 30, 2024' },
              { source: 'Sportstar', title: 'National Para Shooting: The rise of SH2 talent', date: 'Jan 15, 2024' },
            ].map((news, i) => (
              <div key={i} className="card hover:border-primary transition-colors flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-bold text-accent uppercase tracking-widest">{news.source}</span>
                    <span className="text-[10px] text-neutral-400">{news.date}</span>
                  </div>
                  <h3 className="font-bold text-neutral-700 leading-tight">{news.title}</h3>
                </div>
                <a href="#" className="mt-6 text-xs font-bold text-primary flex items-center gap-1 hover:underline">
                  READ FULL ARTICLE <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>
      */}
    </>
  )
}

export default GalleryPage
