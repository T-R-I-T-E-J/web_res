import { Home, Users, Calendar, Trophy, FileText, CreditCard, Settings, BarChart3, Shield } from 'lucide-react'
import { Sidebar } from '@/components/dashboard'

const adminNavItems = [
  { label: 'Overview', href: '/admin', icon: Home },
  { label: 'User Management', href: '/admin/users', icon: Users, badge: 5 },
  { label: 'Competitions', href: '/admin/competitions', icon: Calendar },
  { label: 'Scores & Results', href: '/admin/scores', icon: Trophy },
  { label: 'Content (CMS)', href: '/admin/content', icon: FileText },
  { label: 'Financials', href: '/admin/finance', icon: CreditCard },
  { label: 'Reports', href: '/admin/reports', icon: BarChart3 },
  { label: 'Access Control', href: '/admin/access', icon: Shield },
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

