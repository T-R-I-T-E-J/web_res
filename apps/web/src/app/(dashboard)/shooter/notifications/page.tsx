'use client'

import { DashboardHeader } from '@/components/dashboard'
import clsx from 'clsx'

const notifications = [
  { id: 1, message: 'Your profile has been verified', time: '2 hours ago', read: false, type: 'success' },
  { id: 2, message: 'Registration opens for NSCC 2026', time: '1 day ago', read: false, type: 'info' },
  { id: 3, message: 'Your payment was successful', time: '2 days ago', read: true, type: 'success' },
  { id: 4, message: 'Match schedule updated for 10m Air Rifle', time: '3 days ago', read: true, type: 'warning' },
]

export default function ShooterNotificationsPage() {
  return (
    <>
      <DashboardHeader
        title="Notifications"
        subtitle="Stay updated with latest alerts"
      />

      <div className="p-6 max-w-4xl">
        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 overflow-hidden">
          <div className="divide-y divide-neutral-100">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={clsx(
                  'p-4 hover:bg-neutral-50 transition-colors cursor-pointer',
                  !notification.read ? 'bg-primary/5' : 'bg-white'
                )}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className={clsx('text-sm text-neutral-900', !notification.read && 'font-semibold')}>
                      {notification.message}
                    </p>
                    <p className="text-xs text-neutral-500 mt-1">{notification.time}</p>
                  </div>
                  {!notification.read && (
                    <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-2" />
                  )}
                </div>
              </div>
            ))}
          </div>
          
          {notifications.length === 0 && (
            <div className="p-8 text-center text-neutral-500">
              No notifications yet.
            </div>
          )}
        </div>
      </div>
    </>
  )
}
