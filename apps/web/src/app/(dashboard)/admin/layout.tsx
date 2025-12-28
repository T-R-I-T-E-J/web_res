'use client'

import { Home, Users, Trophy } from 'lucide-react'
import { Sidebar } from '@/components/dashboard'

const adminNavItems = [
  { label: 'Overview', href: '/admin', icon: Home },
  { label: 'User Management', href: '/admin/users', icon: Users },
  { label: 'Scores & Results', href: '/admin/scores', icon: Trophy },
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

