import Link from 'next/link'
import { ArrowRight, Calendar, MapPin } from 'lucide-react'
import clsx from 'clsx'

// News Card
type NewsCardProps = {
  title: string
  excerpt: string
  category: string
  date: string
  href: string
  imageUrl?: string
}

export const NewsCard = ({ title, excerpt, category, date, href, imageUrl }: NewsCardProps) => {
  return (
    <article className="card-hover group">
      {imageUrl ? (
        <div className="h-48 -mx-6 -mt-6 mb-4 bg-neutral-200 rounded-t-card overflow-hidden">
          <img src={imageUrl} alt="" className="w-full h-full object-cover" />
        </div>
      ) : (
        <div className="h-3 -mx-6 -mt-6 mb-4 bg-primary rounded-t-card" />
      )}
      <div className="flex items-center gap-2 mb-2">
        <span className="badge-info">{category}</span>
        <span className="text-xs text-neutral-400">{date}</span>
      </div>
      <h3 className="font-heading text-lg font-semibold text-primary mb-2 group-hover:text-interactive transition-colors">
        {title}
      </h3>
      <p className="text-sm text-neutral-600 mb-4 line-clamp-2">{excerpt}</p>
      <Link
        href={href}
        className="inline-flex items-center text-sm font-semibold text-primary hover:text-accent transition-colors"
      >
        Read More
        <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
      </Link>
    </article>
  )
}

// Event Card
type EventCardProps = {
  title: string
  date: string
  location: string
  status: 'upcoming' | 'ongoing' | 'completed'
  href: string
}

export const EventCard = ({ title, date, location, status, href }: EventCardProps) => {
  const statusStyles = {
    upcoming: 'badge-info',
    ongoing: 'badge-warning',
    completed: 'badge-success',
  }

  const statusLabels = {
    upcoming: 'Upcoming',
    ongoing: 'Live Now',
    completed: 'Completed',
  }

  return (
    <article className="card-hover group">
      <div className="flex items-start justify-between mb-3">
        <span className={statusStyles[status]}>
          {status === 'ongoing' && <span className="w-2 h-2 bg-current rounded-full mr-1.5 animate-pulse" />}
          {statusLabels[status]}
        </span>
      </div>
      <h3 className="font-heading text-lg font-semibold text-primary mb-3 group-hover:text-interactive transition-colors">
        {title}
      </h3>
      <div className="space-y-2 text-sm text-neutral-600">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-neutral-400" />
          {date}
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-neutral-400" />
          {location}
        </div>
      </div>
      <div className="mt-4 pt-4 border-t border-neutral-100">
        <Link
          href={href}
          className="btn-primary w-full text-sm py-2"
        >
          View Details
        </Link>
      </div>
    </article>
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

