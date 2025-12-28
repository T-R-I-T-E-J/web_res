'use client'

import {
  Home, User, Trophy, Calendar, CreditCard,
  FileText, Target, Shield, HelpCircle, ClipboardList,
  Settings, Award, PieChart
} from 'lucide-react'
import { Sidebar } from '@/components/dashboard'

const shooterNavItems = [
  { label: 'Dashboard', href: '/shooter', icon: Home },
  {
    label: 'My Profile',
    href: '/shooter/profile',
    icon: User,
    subItems: [
      { label: 'Personal Details', href: '/shooter/profile#personal' },
      { label: 'View Profile Info', href: '/shooter/profile/view' },
      { label: 'Address Details', href: '/shooter/profile#address' },
      { label: 'Passport Details', href: '/shooter/profile#passport' },
      { label: 'Nationality', href: '/shooter/nationality' },
      { label: 'My ID Card', href: '/shooter/profile/id-card' },
    ]
  },
  {
    label: 'Documents',
    href: '/shooter/documents',
    icon: FileText,
    subItems: [
      { label: 'View Documents', href: '/shooter/documents' },
      { label: 'Upload New', href: '/shooter/documents/upload' },
      { label: 'Import Permit', href: '/shooter/import-permit' },
    ]
  },
  {
    label: 'Participation',
    href: '/shooter/events',
    icon: Calendar,
    badge: 2,
    subItems: [
      { label: 'Match Registration', href: '/shooter/events' },
      { label: 'My Matches', href: '/shooter/events/my-matches' },
      { label: 'Athlete History', href: '/shooter/history' },
    ]
  },
  {
    label: 'Results & Ranking',
    href: '/shooter/scores',
    icon: Trophy,
    subItems: [
      { label: 'My Scores', href: '/shooter/scores' },
      { label: 'National Ranking', href: '/shooter/rankings' },
      { label: 'International Medalist', href: '/shooter/international-medalist' },
      { label: 'Certificates', href: '/shooter/certificates' },
    ]
  },
  { 
    label: 'Equipment', 
    href: '/shooter/equipment', 
    icon: Target,
    subItems: [
      { label: 'My Equipment', href: '/shooter/equipment' },
      { label: 'Equipment Control', href: '/shooter/equipment-control' },
    ]
  },
  { label: 'Payments', href: '/shooter/payments', icon: CreditCard },
  { label: 'Support & FAQ', href: '/shooter/support', icon: HelpCircle },
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

