'use client'

import { Home, User, Trophy, Calendar, CreditCard, FileText, Target } from 'lucide-react'
import { Sidebar } from '@/components/dashboard'

const shooterNavItems = [
  { label: 'Dashboard', href: '/shooter', icon: Home },
  { label: 'My Profile', href: '/shooter/profile', icon: User },
  { label: 'My Scores', href: '/shooter/scores', icon: Trophy },
  { label: 'Competitions', href: '/shooter/events', icon: Calendar, badge: 2 },
  { label: 'Payments', href: '/shooter/payments', icon: CreditCard },
  { label: 'Documents', href: '/shooter/documents', icon: FileText },
  { label: 'Equipment', href: '/shooter/equipment', icon: Target },
]

type ShooterLayoutProps = {
  children: React.ReactNode
}

const ShooterLayout = ({ children }: ShooterLayoutProps) => {
  const user = {
    name: 'Avani Lekhara',
    role: 'Verified Shooter',
    avatar: undefined,
  }

  return (
    <div className="flex min-h-screen bg-neutral-50">
      <Sidebar items={shooterNavItems} user={user} />
      <div className="flex-1 flex flex-col min-w-0">
        {children}
      </div>
    </div>
  )
}

export default ShooterLayout

