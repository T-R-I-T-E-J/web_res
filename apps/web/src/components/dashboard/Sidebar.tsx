'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import clsx from 'clsx'
import Cookies from 'js-cookie'
import Image from 'next/image'
import {
  Home, User, Trophy, Calendar, CreditCard, Settings, LogOut,
  Menu, X, ChevronRight, Bell, Target
} from 'lucide-react'

type NavItem = {
  label: string
  href: string
  icon: typeof Home
  badge?: number
  subItems?: { label: string; href: string }[]
}

type SidebarProps = {
  items: NavItem[]
  user: {
    name: string
    role: string
    avatar?: string
  }
}

const Sidebar = ({ items, user }: SidebarProps) => {
  const pathname = usePathname()
  const router = useRouter()
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [expandedItems, setExpandedItems] = useState<string[]>([])

  const handleToggle = () => setCollapsed(!collapsed)
  const handleMobileToggle = () => setMobileOpen(!mobileOpen)

  const handleLogout = async () => {
    try {
      // Call backend to clear HttpOnly cookie
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';
      await fetch(`${API_URL}/auth/logout`, { 
        method: 'POST',
        credentials: 'include', // Send cookies with request
      });
    } catch (error) {
      console.error('Logout failed', error);
    } finally {
      // Clean up any potential client-side leftovers (if any existed previously)
      Cookies.remove('auth_token');
      router.push('/login');
    }
  }

  const toggleExpand = (label: string) => {
    if (collapsed) setCollapsed(false)
    setExpandedItems(prev =>
      prev.includes(label) ? prev.filter(i => i !== label) : [...prev, label]
    )
  }

  const NavLink = ({ item }: { item: NavItem }) => {
    const isActive = pathname === item.href || (item.subItems ? item.subItems.some(sub => pathname === sub.href) : pathname.startsWith(item.href + '/'))
    const isExpanded = expandedItems.includes(item.label)
    const hasSubItems = item.subItems && item.subItems.length > 0

    return (
      <div className="space-y-1">
        {hasSubItems ? (
          <button
            onClick={() => toggleExpand(item.label)}
            className={clsx(
              'w-full flex items-center gap-2 px-3 py-1.5 rounded-card transition-all duration-200 text-sm',
              isActive
                ? 'bg-primary/10 text-primary'
                : 'text-neutral-600 hover:bg-neutral-100 hover:text-primary'
            )}
          >
            <item.icon className="w-5 h-5 flex-shrink-0" />
            {!collapsed && (
              <>
                <span className="font-medium flex-1 text-left">{item.label}</span>
                <ChevronRight className={clsx('w-4 h-4 transition-transform', isExpanded && 'rotate-90')} />
              </>
            )}
          </button>
        ) : (
          <Link
            href={item.href}
            onClick={() => setMobileOpen(false)}
            className={clsx(
              'flex items-center gap-2 px-3 py-1.5 rounded-card transition-all duration-200 text-sm',
              isActive
                ? 'bg-primary text-white shadow-md'
                : 'text-neutral-600 hover:bg-neutral-100 hover:text-primary'
            )}
          >
            <item.icon className="w-4 h-4 flex-shrink-0" />
            {!collapsed && (
              <>
                <span className="font-medium flex-1">{item.label}</span>
                {item.badge && item.badge > 0 && (
                  <span className="bg-accent text-white text-xs font-bold px-2 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                )}
              </>
            )}
          </Link>
        )}

        {!collapsed && hasSubItems && isExpanded && (
          <div className="ml-6 space-y-0.5">
            {item.subItems!.map((sub) => (
              <Link
                key={sub.href}
                href={sub.href}
                onClick={() => setMobileOpen(false)}
                className={clsx(
                  'block px-3 py-1.5 text-xs rounded-card transition-colors',
                  pathname === sub.href
                    ? 'bg-primary/5 text-primary font-medium'
                    : 'text-neutral-500 hover:text-primary hover:bg-neutral-50'
                )}
              >
                {sub.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={handleMobileToggle}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-card shadow-card"
        aria-label="Toggle menu"
      >
        {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={clsx(
          'fixed lg:sticky top-0 left-0 h-screen bg-white border-r border-neutral-200 z-40 transition-all duration-300',
          collapsed ? 'w-20' : 'w-64',
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-2 border-b border-neutral-200">
            <Link href="/" className="flex items-center gap-3">
              <Image
                src="/logo.png"
                alt="Paralympic Committee India"
                width={collapsed ? 30 : 45}
                height={collapsed ? 28 : 42}
                className="object-contain flex-shrink-0"
                style={{ width: 'auto', height: 'auto' }}
              />

            </Link>
          </div>

          {/* User Info */}
          <div className={clsx('p-2 border-b border-neutral-200', collapsed && 'px-2')}>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-neutral-100 rounded-full flex items-center justify-center flex-shrink-0">
                {user.avatar ? (
                  <img src={user.avatar} alt="" className="w-full h-full rounded-full object-cover" />
                ) : (
                  <User className="w-5 h-5 text-neutral-400" />
                )}
              </div>
              {!collapsed && (
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-neutral-700 truncate text-sm">{user.name}</p>
                  <p className="text-xs text-neutral-500">{user.role}</p>
                </div>
              )}
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
            {items.map((item) => (
              <NavLink key={item.href} item={item} />
            ))}
          </nav>

          {/* Bottom Actions */}
          <div className="p-2 border-t border-neutral-200 space-y-1">
            <Link
              href="/shooter/settings"
              className="flex items-center gap-2 px-3 py-1.5 text-neutral-600 hover:bg-neutral-100 hover:text-primary rounded-card transition-colors text-sm"
            >
              <Settings className="w-4 h-4" />
              {!collapsed && <span className="font-medium">Settings</span>}
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-1.5 text-error hover:bg-error/10 rounded-card transition-colors w-full text-sm"
            >
              <LogOut className="w-4 h-4" />
              {!collapsed && <span className="font-medium">Logout</span>}
            </button>
          </div>

          {/* Collapse Button (Desktop) */}
          <button
            onClick={handleToggle}
            className="hidden lg:flex items-center justify-center p-2 border-t border-neutral-200 text-neutral-400 hover:text-primary transition-colors"
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <ChevronRight className={clsx('w-5 h-5 transition-transform', !collapsed && 'rotate-180')} />
          </button>
        </div>
      </aside>
    </>
  )
}

export default Sidebar

