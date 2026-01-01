'use client'

import Link from 'next/link'
import { ArrowRight, Calendar, Clock, MapPin, ChevronRight, Share2, Info } from 'lucide-react'
import clsx from 'clsx'

// Featured Card for Home/News Hero
type FeaturedCardProps = {
  title: string
  excerpt?: string
  date: string
  href: string
  imageUrl: string
  category?: string
}

export const FeaturedCard = ({ title, excerpt, date, href, imageUrl, category }: FeaturedCardProps) => {
  return (
    <Link href={href} className="group relative block w-full overflow-hidden rounded-2xl bg-white shadow-card transition-all hover:shadow-card-hover border border-neutral-200 h-full">
      <div className="flex flex-col md:flex-row h-full">
         {/* Image Section */}
         <div className="relative h-52 w-full md:w-[55%] overflow-hidden">
             <img 
                src={imageUrl} 
                alt={title} 
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent md:hidden" />
              {category && (
                <div className="absolute top-4 left-4">
                  <span className="inline-block rounded-md bg-white/90 backdrop-blur-sm px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary shadow-sm border border-neutral-100">
                    {category}
                  </span>
                </div>
              )}
         </div>

         {/* Content Section */}
         <div className="flex flex-col justify-center p-6 md:p-8 w-full md:w-[45%] bg-white relative">
            {/* Category for desktop - optional position */}
            <div className="mb-4">
               {category && (
                 <span className="text-xs font-bold text-interactive uppercase tracking-wider mb-2 block md:inline-block">
                    {category}
                 </span>
               )}
               <h3 className="text-2xl md:text-3xl font-bold leading-tight text-neutral-900 group-hover:text-primary transition-colors">
                  {title}
               </h3>
            </div>
            
            {excerpt && (
              <p className="mb-6 text-neutral-600 line-clamp-3 leading-relaxed">
                {excerpt}
              </p>
            )}

            <div className="mt-auto pt-4 flex items-center justify-between border-t border-neutral-100">
               <span className="flex items-center gap-1.5 text-sm font-medium text-neutral-500">
                  <Clock className="h-4 w-4" />
                  {date}
               </span>
               <div className="bg-secondary text-white px-5 py-2 rounded-lg text-sm font-bold shadow-md group-hover:bg-primary transition-colors flex items-center gap-2">
                 View Details
               </div>
            </div>
         </div>
      </div>
    </Link>
  )
}

// News Card (Vertical Grid Style)
type NewsCardProps = {
  title: string
  excerpt?: string
  category?: string
  date?: string
  href: string
  imageUrl?: string
}

export const NewsCard = ({ title, excerpt, category, date, href, imageUrl }: NewsCardProps) => {
  return (
    <Link 
      href={href} 
      className="group flex flex-col overflow-hidden rounded-xl bg-white shadow-card transition-all hover:-translate-y-1 hover:shadow-card-hover border border-neutral-200 h-[400px]"
    >
      {/* Image Section - Fixed height */}
      <div className="relative h-52 w-full shrink-0 overflow-hidden bg-neutral-100">
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt={title} 
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-neutral-300">
             <span className="text-4xl">📰</span>
          </div>
        )}
        {category && (
             <div className="absolute bottom-3 left-3">
                <span className="rounded bg-white/95 backdrop-blur-sm px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-primary shadow-sm">
                  {category}
                </span>
             </div>
        )}
      </div>

      {/* Content Section */}
      <div className="flex flex-1 flex-col justify-between p-5 overflow-hidden">
        <div className="overflow-hidden">
          <h3 className="mb-2 text-lg font-bold leading-snug text-neutral-900 group-hover:text-interactive transition-colors line-clamp-2">
            {title}
          </h3>
          
          {excerpt && (
            <p className="text-sm text-neutral-600 line-clamp-3 leading-relaxed">
               {excerpt}
            </p>
          )}
        </div>
        
        <div className="flex items-center justify-between pt-3 border-t border-neutral-50 shrink-0">
           {date ? (
            <span className="text-xs font-medium text-neutral-400">
               {date}
            </span>
           ) : (
             <span /> 
           )}
           <span className="flex items-center justify-center w-8 h-8 rounded-full bg-neutral-50 text-neutral-400 group-hover:bg-primary group-hover:text-white transition-all">
             <ArrowRight className="h-4 w-4" />
           </span>
        </div>
      </div>
    </Link>
  )
}

// Event Card (Date Badge style)
type EventCardProps = {
  title: string
  date: string // Expected format: full date string
  location: string
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled'
  href: string
  day?: string // newly added for explicit badge
  month?: string // newly added for explicit badge
}

export const EventCard = ({ title, date, location, status, href, day, month }: EventCardProps) => {
    // Helper to parse date if day/month not provided
    const dateObj = new Date(date);
    // Fallback if parsing fails or input is random string
    const displayDay = day || (isNaN(dateObj.getDate()) ? '??' : dateObj.getDate().toString());
    const displayMonth = month || (isNaN(dateObj.getMonth()) ? 'Event' : dateObj.toLocaleString('default', { month: 'short' }).toUpperCase());

  return (
    <Link href={href} className="group relative flex flex-col overflow-hidden rounded-xl bg-white shadow-card transition-all hover:-translate-y-1 hover:shadow-card-hover border-t-4 border-t-primary border-x border-b border-neutral-200 h-full">
      <div className="flex flex-1 flex-col p-5">
        <div className="flex gap-4">
            {/* Date Badge */}
            <div className="flex h-16 w-16 flex-shrink-0 flex-col items-center justify-center rounded-lg bg-secondary text-white shadow-md group-hover:bg-primary transition-colors">
                <span className="text-xs font-medium uppercase tracking-wider opacity-90">{displayMonth}</span>
                <span className="text-2xl font-bold leading-none">{displayDay}</span>
            </div>
            
            <div className="flex-1 min-w-0">
                 <h3 className="mb-1 text-lg font-bold leading-tight text-neutral-700 group-hover:text-primary transition-colors line-clamp-2">
                    {title}
                </h3>
                 <div className="mt-2 space-y-1.5">
                    <div className="flex items-center text-sm text-neutral-400">
                        <MapPin className="mr-1.5 h-3.5 w-3.5 flex-shrink-0" />
                        <span className="truncate">{location}</span>
                    </div>
                     <div className="flex items-center text-sm text-neutral-400">
                        <Info className="mr-1.5 h-3.5 w-3.5 flex-shrink-0" />
                        <span className="capitalize">{status}</span>
                    </div>
                </div>
            </div>
        </div>
      </div>
      <div className="p-4 pt-0">
        <div className="bg-[#9ca3af] px-5 py-3 rounded-lg shadow-md flex items-center justify-between group-hover:bg-[#6b7280] group-hover:shadow-lg transition-all">
           <span className="text-xs font-bold text-white uppercase tracking-wider">View Details</span>
           <ArrowRight className="h-4 w-4 text-white transform group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </Link>
  )
}

// Shooter Card (for rankings)
type ShooterCardProps = {
  rank: number
  name: string
  state: string
  event: string
  score: number
  change?: 'up' | 'down' | 'same'
}

export const ShooterCard = ({ rank, name, state, event, score, change }: ShooterCardProps) => {
  return (
    <div className="card flex items-center gap-4 py-4">
      <div
        className={clsx(
          'w-12 h-12 rounded-full flex items-center justify-center font-heading font-bold text-lg',
          rank <= 3 ? 'bg-accent text-white' : 'bg-neutral-100 text-neutral-600'
        )}
      >
        {rank}
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-primary truncate">{name}</h4>
        <p className="text-sm text-neutral-500">{state} • {event}</p>
      </div>
      <div className="text-right">
        <div className="font-data text-lg font-semibold text-neutral-700">{score.toFixed(1)}</div>
        {change && (
          <div
            className={clsx(
              'text-xs font-medium',
              change === 'up' && 'text-success',
              change === 'down' && 'text-error',
              change === 'same' && 'text-neutral-400'
            )}
          >
            {change === 'up' && '↑ Up'}
            {change === 'down' && '↓ Down'}
            {change === 'same' && '— Same'}
          </div>
        )}
      </div>
    </div>
  )
}

// Download Card
type DownloadCardProps = {
  title: string
  description: string
  fileType: string
  href: string
}

export const DownloadCard = ({ title, description, fileType, href }: DownloadCardProps) => {
  return (
    <article className="card-hover group">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-primary/10 rounded-card flex items-center justify-center flex-shrink-0">
          <span className="text-xs font-bold text-primary uppercase">{fileType}</span>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-primary mb-1 group-hover:text-interactive transition-colors">
            {title}
          </h3>
          <p className="text-sm text-neutral-600">{description}</p>
        </div>
      </div>
      <div className="mt-4 pt-4 border-t border-neutral-100">
        <a
          href={href}
          className="inline-flex items-center text-sm font-semibold text-primary hover:text-accent transition-colors"
          download
        >
          Download {fileType.toUpperCase()}
          <ArrowRight className="w-4 h-4 ml-1" />
        </a>
      </div>
    </article>
  )
}

