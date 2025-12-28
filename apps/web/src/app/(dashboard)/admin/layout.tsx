'use client'

import {
  Home, Users, Trophy, Calendar, FileText,
  Shield, Settings, Download, Activity,
  Database, UserCheck, MapPin
} from 'lucide-react'
import { Sidebar } from '@/components/dashboard'

const adminNavItems = [
  { label: 'Dashboard Overview', href: '/admin', icon: Home },
  {
    label: 'Shooter Management',
    href: '/admin/users',
    icon: Users,
    subItems: [
      { label: 'All Shooters', href: '/admin/users' },
      { label: 'Pending Approvals', href: '/admin/users/pending' },
      { label: 'Import Shooters', href: '/admin/users/import' },
      { label: 'ID Card Requests', href: '/admin/users/id-cards' },
    ]
  },
  {
    label: 'State/Unit Management',
    href: '/admin/states',
    icon: MapPin,
    subItems: [
      { label: 'State Associations', href: '/admin/states' },
      { label: 'Unit Management', href: '/admin/units' },
    ]
  },
  {
    label: 'Competitions',
    href: '/admin/events',
    icon: Calendar,
    subItems: [
      { label: 'Manage Matches', href: '/admin/events' },
      { label: 'Score Management', href: '/admin/scores' },
      { label: 'Match Reports', href: '/admin/events/reports' },
    ]
  },
  {
    label: 'Content Management',
    href: '/admin/content',
    icon: FileText,
    subItems: [
      { label: 'Circulars/Downloads', href: '/admin/downloads' },
      { label: 'News & Updates', href: '/admin/news' },
      { label: 'Gallery', href: '/admin/gallery' },
    ]
  },
  { label: 'Audit Logs', href: '/admin/audit', icon: Activity },
  { label: 'System Settings', href: '/admin/settings', icon: Settings },
]

type AdminLayoutProps = {
  children: React.ReactNode
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const user = {
    name: 'Admin User',
    role: 'Super Admin',
    avatar: undefined,
  }

  return (
    <div className="flex min-h-screen bg-neutral-100">
      <Sidebar items={adminNavItems} user={user} />
      <div className="flex-1 flex flex-col min-w-0">
        {children}
      </div>
    </div>
  )
}

export default AdminLayout

