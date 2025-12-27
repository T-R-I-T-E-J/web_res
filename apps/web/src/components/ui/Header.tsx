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
    <header className="bg-white">
      {/* Top Bar with Navigation */}
      <nav className="bg-secondary text-white py-1 text-sm hidden md:block">
        <div className="container-main flex justify-end items-center">
          <ul className="flex items-center gap-1">
            {navItems.map((item) => (
              <li key={item.href} className="relative group">
                {item.children ? (
                  <>
                    <Link
                      href={item.href}
                      className="flex items-center gap-1 px-3 py-2 uppercase font-semibold text-white/90 hover:text-accent transition-colors"
                    >
                      {item.label}
                      <ChevronDown className="w-3 h-3" />
                    </Link>
                    <ul className="absolute top-full left-0 hidden group-hover:block bg-white shadow-card min-w-[200px] border-t-2 border-accent z-[60]">
                      {item.children.map((child) => (
                        <li key={child.href} className="border-b border-neutral-100 last:border-0">
                          <Link
                            href={child.href}
                            className="block px-4 py-2 text-xs text-neutral-600 hover:bg-neutral-50 hover:text-interactive transition-colors"
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
                    className="block px-3 py-2 uppercase font-semibold text-white/90 hover:text-accent transition-colors"
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            ))}
            <li className="ml-2">
              <Link
                href="/login"
                className="flex items-center gap-2 px-4 py-1.5 bg-accent text-white font-semibold text-xs rounded-card hover:bg-accent-dark transition-colors"
              >
                <LogIn className="w-3 h-3" />
                LOGIN
              </Link>
            </li>
          </ul>
        </div>
      </nav>

      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 border-b border-neutral-200">
        <button
          onClick={handleToggleMenu}
          className="p-2 rounded-card hover:bg-neutral-100 transition-colors"
          aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
        >
          {mobileMenuOpen ? (
            <X className="w-6 h-6 text-primary" />
          ) : (
            <Menu className="w-6 h-6 text-primary" />
          )}
        </button>
        <Link href="/login" className="text-primary p-2">
          <LogIn className="w-6 h-6" />
        </Link>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-neutral-200">
          <ul className="flex flex-col">
            {navItems.map((item) => (
              <li key={item.href} className="border-b border-neutral-50 last:border-0">
                {item.children ? (
                  <>
                    <button
                      onClick={() => handleDropdownToggle(item.label)}
                      className="flex items-center justify-between w-full px-5 py-3 text-primary font-semibold text-sm"
                    >
                      {item.label}
                      <ChevronDown className={clsx('w-4 h-4 transition-transform', activeDropdown === item.label && 'rotate-180')} />
                    </button>
                    {activeDropdown === item.label && (
                      <ul className="bg-neutral-50 pl-4">
                        {item.children.map((child) => (
                          <li key={child.href}>
                            <Link
                              href={child.href}
                              className="block px-5 py-2.5 text-sm text-neutral-600"
                              onClick={() => setMobileMenuOpen(false)}
                            >
                              {child.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </>
                ) : (
                  <Link
                    href={item.href}
                    className="block px-5 py-3 text-primary font-semibold text-sm"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Logo Section */}
      <div className="bg-white py-12 text-center">
        <div className="container-main">
          <Link href="/" className="inline-block relative">
            <div className="absolute -inset-8 bg-white rounded-full shadow-[0_0_40px_rgba(0,0,0,0.05)] -z-10"></div>
            <Image
              src="/logo.png"
              alt="Paralympic Committee India - Para Shooting"
              width={220}
              height={245}
              className="mx-auto"
              priority
            />
          </Link>
        </div>
      </div>
    </header>
  )
}
  )
}

export default Header

