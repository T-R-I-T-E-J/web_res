import type { Metadata } from 'next'
import { Image as ImageIcon, ExternalLink } from 'lucide-react'
import clsx from 'clsx'

export const metadata: Metadata = {
  title: 'Gallery & Media',
  description: 'View photos and videos from para shooting championships and events across India.',
}

const albums = [
  { 
    title: '68th NSCC Para Rifle', 
    year: '2025', 
    count: 42, 
    cover: '/logo.png',
    category: 'National'
  },
  { 
    title: 'Paris Paralympics 2024', 
    year: '2024', 
    count: 156, 
    cover: '/logo.png',
    category: 'International'
  },
  { 
    title: 'State Championship - RJ', 
    year: '2024', 
    count: 28, 
    cover: '/logo.png',
    category: 'State'
  },
  { 
    title: 'Selection Trials Delhi', 
    year: '2023', 
    count: 65, 
    cover: '/logo.png',
    category: 'National'
  },
]

const videos = [
  { id: 'PVKBcmWnlHw', title: 'National Para Shooting Championship Highlights' },
  { id: 'CC5oe68AkqE', title: 'Avani Lekhara - Gold Medal Moment Paris 2024' },
]

const GalleryPage = () => {
  return (
    <>
      <section className="gradient-hero py-16 md:py-20 text-center text-white">
        <div className="container-main">
          <h1 className="font-heading text-3xl md:text-4xl font-bold mb-4">Gallery & Media</h1>
          <p className="opacity-90 max-w-2xl mx-auto">
            Capturing the spirit of excellence and determination in para shooting.
          </p>
        </div>
      </section>

      {/* Photo Albums */}
      <section id="photos" className="section bg-neutral-50">
        <div className="container-main">
          <div className="flex items-center justify-between mb-8">
            <h2 className="section-title">Event Albums</h2>
            <div className="flex gap-2">
              <button className="btn-outline py-1.5 px-3 text-xs">All Years</button>
              <button className="btn-outline py-1.5 px-3 text-xs">National</button>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {albums.map((album, i) => (
              <div key={i} className="group cursor-pointer">
                <div className="relative aspect-[4/3] rounded-card overflow-hidden bg-neutral-200 border border-neutral-200">
                  <img 
                    src={album.cover} 
                    alt={album.title} 
                    className="w-full h-full object-contain p-8 grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all opacity-50 group-hover:opacity-100" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                    <span className="text-white text-xs font-bold flex items-center gap-1">
                      <ImageIcon className="w-3 h-3" />
                      {album.count} Photos
                    </span>
                  </div>
                  <div className="absolute top-2 right-2">
                    <span className="badge-info text-[10px]">{album.category}</span>
                  </div>
                </div>
                <div className="mt-3">
                  <h3 className="font-bold text-neutral-700 text-sm group-hover:text-primary transition-colors">{album.title}</h3>
                  <p className="text-xs text-neutral-400 mt-0.5">{album.year}</p>
                </div>
              </div>
            ))}
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

      {/* Press Coverage */}
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
    </>
  )
}

export default GalleryPage

