'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, X, ChevronDown, User, LogIn } from 'lucide-react'
import clsx from 'clsx'

type NavItem = {
  label: string
  href: string
  children?: { label: string; href: string }[]
}

const navItems: NavItem[] = [
  { label: 'Home', href: '/' },
  {
    label: 'About Us',
    href: '/about',
    children: [
      { label: 'Introduction', href: '/about#intro' },
      { label: 'History', href: '/about#history' },
      { label: 'Executive Committee', href: '/about#committee' },
      { label: 'Constitution', href: '/about#constitution' },
    ],
  },
  {
    label: 'Championships',
    href: '/events',
    children: [
      { label: 'Shooting Events', href: '/events#events' },
      { label: 'International', href: '/events#international' },
      { label: 'National Competitions', href: '/events#national' },
    ],
  },
  {
    label: 'Downloads',
    href: '/downloads',
    children: [
      { label: 'Forms', href: '/downloads#forms' },
      { label: 'Rules & Guidelines', href: '/downloads#rules' },
    ],
  },
  { label: 'Rankings', href: '/rankings' },
  { label: 'Results', href: '/results' },
  { label: 'Contact', href: '/contact' },
]

const topBarLinks = [
  { label: 'Notification', href: '/notifications' },
  { label: 'Election 2025', href: '/election' },
  { label: 'Newsletter', href: '/newsletter' },
  { label: 'RTI', href: '/rti' },
]

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)

  const handleToggleMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  const handleDropdownToggle = (label: string) => {
    setActiveDropdown(activeDropdown === label ? null : label)
  }

  return (
    <header>
      {/* Top Bar */}
      <div className="bg-secondary text-white py-2 text-sm">
        <div className="container-main flex flex-wrap justify-center md:justify-end items-center gap-4 md:gap-6">
          {topBarLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="uppercase font-semibold text-white/90 hover:text-accent transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Logo Section */}
      <div className="bg-white py-6 text-center">
        <div className="container-main">
          <Link href="/" className="inline-block">
            <Image
              src="/logo.png"
              alt="Paralympic Committee India - Para Shooting"
              width={160}
              height={178}
              className="mx-auto"
              priority
            />
          </Link>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="bg-white border-y border-neutral-200 sticky top-0 z-50 shadow-nav">
        <div className="container-main">
          {/* Mobile Menu Button */}
          <div className="flex md:hidden py-3">
            <button
              onClick={handleToggleMenu}
              className="p-2 rounded-card hover:bg-neutral-100 transition-colors"
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6 text-primary" />
              ) : (
                <Menu className="w-6 h-6 text-primary" />
              )}
            </button>
          </div>

          {/* Navigation Menu */}
          <ul
            className={clsx(
              'md:flex md:justify-center md:items-center flex-wrap',
              mobileMenuOpen ? 'flex flex-col' : 'hidden'
            )}
          >
            {navItems.map((item) => (
              <li key={item.href} className="relative group">
                {item.children ? (
                  <>
                    {/* Desktop: Hover dropdown */}
                    <Link
                      href={item.href}
                      className="hidden md:flex items-center gap-1 px-4 py-4 text-primary font-semibold text-sm hover:bg-neutral-100 hover:text-accent transition-colors"
                    >
                      {item.label}
                      <ChevronDown className="w-4 h-4" />
                    </Link>
                    
                    {/* Mobile: Click to expand */}
                    <button
                      onClick={() => handleDropdownToggle(item.label)}
                      className="md:hidden flex items-center justify-between w-full px-5 py-3 text-primary font-semibold text-sm border-b border-neutral-100"
                      aria-expanded={activeDropdown === item.label}
                    >
                      {item.label}
                      <ChevronDown
                        className={clsx(
                          'w-4 h-4 transition-transform',
                          activeDropdown === item.label && 'rotate-180'
                        )}
                      />
                    </button>

                    {/* Dropdown */}
                    <ul
                      className={clsx(
                        'md:absolute md:top-full md:left-0 md:hidden md:group-hover:block',
                        'bg-white md:shadow-card md:min-w-[220px] md:border-t-4 md:border-accent md:rounded-b-card',
                        activeDropdown === item.label ? 'block bg-neutral-50 pl-4' : 'hidden'
                      )}
                    >
                      {item.children.map((child) => (
                        <li key={child.href} className="border-b border-neutral-100 last:border-0">
                          <Link
                            href={child.href}
                            className="block px-5 py-3 text-sm text-neutral-600 hover:bg-neutral-100 hover:text-interactive transition-colors"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            {child.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </>
                ) : (
                  <Link
                    href={item.href}
                    className="block px-4 py-4 md:py-4 text-primary font-semibold text-sm hover:bg-neutral-100 hover:text-accent transition-colors border-b md:border-0 border-neutral-100"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            ))}

            {/* Login Button */}
            <li className="md:ml-4 py-2 md:py-0">
              <Link
                href="/login"
                className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white font-semibold text-sm rounded-card hover:bg-primary-dark transition-colors mx-4 md:mx-0"
              >
                <LogIn className="w-4 h-4" />
                Login
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  )
}

export default Header

