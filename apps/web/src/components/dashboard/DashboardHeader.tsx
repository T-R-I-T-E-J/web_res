'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Bell, Search, User, ChevronDown } from 'lucide-react'
import clsx from 'clsx'

type DashboardHeaderProps = {
  title: string
  subtitle?: string
}

const notifications = [
  { id: 1, message: 'Your profile has been verified', time: '2 hours ago', read: false },
  { id: 2, message: 'Registration opens for NSCC 2026', time: '1 day ago', read: false },
  { id: 3, message: 'Your payment was successful', time: '2 days ago', read: true },
]

const DashboardHeader = ({ title, subtitle }: DashboardHeaderProps) => {
  const [showNotifications, setShowNotifications] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)

  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <header className="bg-white border-b border-neutral-200 px-6 py-4 sticky top-0 z-30">
      <div className="flex items-center justify-between">
        {/* Page Title */}
        <div>
          <h1 className="font-heading text-xl font-bold text-primary">{title}</h1>
          {subtitle && <p className="text-sm text-neutral-500">{subtitle}</p>}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="hidden md:block relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="search"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 w-64 bg-neutral-50 border border-neutral-200 rounded-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 text-neutral-600 hover:bg-neutral-100 rounded-card transition-colors"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-accent text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowNotifications(false)}
                />
                <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-card shadow-card-hover border border-neutral-200 z-50">
                  <div className="p-4 border-b border-neutral-100">
                    <h3 className="font-semibold text-neutral-700">Notifications</h3>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={clsx(
                          'p-4 border-b border-neutral-50 hover:bg-neutral-50 cursor-pointer',
                          !notification.read && 'bg-primary/5'
                        )}
                      >
                        <p className="text-sm text-neutral-700">{notification.message}</p>
                        <p className="text-xs text-neutral-400 mt-1">{notification.time}</p>
                      </div>
                    ))}
                  </div>
                  <div className="p-3 text-center border-t border-neutral-100">
                    <Link href="/shooter/notifications" className="text-sm text-interactive hover:text-primary">
                      View all notifications
                    </Link>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 p-2 hover:bg-neutral-100 rounded-card transition-colors"
            >
              <div className="w-8 h-8 bg-neutral-100 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-neutral-400" />
              </div>
              <ChevronDown className="w-4 h-4 text-neutral-400" />
            </button>

            {showUserMenu && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowUserMenu(false)}
                />
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-card shadow-card-hover border border-neutral-200 z-50 py-2">
                  <Link
                    href="/shooter/profile"
                    className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50"
                  >
                    My Profile
                  </Link>
                  <Link
                    href="/shooter/settings"
                    className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50"
                  >
                    Settings
                  </Link>
                  <hr className="my-2 border-neutral-100" />
                  <button
                    className="block w-full text-left px-4 py-2 text-sm text-error hover:bg-error/5"
                  >
                    Logout
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default DashboardHeader

