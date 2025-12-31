'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube } from 'lucide-react'

const quickLinks = [
  { label: 'About Us', href: '/about' },
  { label: 'Championships', href: '/events' },
  { label: 'Policies', href: '/policies' },
  { label: 'Classification', href: '/classification' },
  { label: 'Contact', href: '/contact' },
  { label: 'Accessibility', href: '/accessibility' },
]

const usefulLinks = [
  { label: 'ISSF', href: 'https://www.issf-sports.org' },
  { label: 'World Para Shooting', href: 'https://www.paralympic.org/shooting' },
  { label: 'Paralympic Committee of India', href: 'https://www.paralympicsindia.org' },
  { label: 'Sports Authority of India', href: 'https://sportsauthorityofindia.nic.in' },
]

// const socialLinks = [
//   { label: 'Facebook', href: '#', icon: Facebook },
//   { label: 'Twitter', href: '#', icon: Twitter },
//   { label: 'Instagram', href: '#', icon: Instagram },
//   { label: 'YouTube', href: '#', icon: Youtube },
// ]

export const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-neutral-100 border-t-4 border-primary">
      {/* Main Footer Content */}
      <div className="container-main py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About Section */}
          <div>
            <h3 className="font-heading font-bold text-lg text-secondary mb-4">
              About STC Para Shooting
            </h3>
            <p className="text-sm text-neutral-600 leading-relaxed mb-4">
              STC Para Shooting (Paralympic Committee of India) was founded with the view to promote and 
              popularize shooting sports among para-athletes in India. We are committed to developing 
              world-class shooters.
            </p>
            {/* <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="w-9 h-9 bg-primary/10 rounded-full flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors"
                  aria-label={social.label}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div> */}
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-heading font-bold text-lg text-secondary mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-neutral-600 hover:text-interactive transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Useful Links */}
          <div>
            <h3 className="font-heading font-bold text-lg text-secondary mb-4">
              Useful Links
            </h3>
            <ul className="space-y-2">
              {usefulLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-neutral-600 hover:text-interactive transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {link.label} ↗
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-heading font-bold text-lg text-secondary mb-4">
              Contact Us
            </h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <p className="text-sm text-neutral-600">
                  Jaisalmer House,<br />
                  26 Mansingh Road,<br />
                  New Delhi - 110011
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-primary flex-shrink-0" />
                <a
                  href="tel:+911123075126"
                  className="text-sm text-neutral-600 hover:text-interactive transition-colors"
                >
                  +91-11-23075126
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary flex-shrink-0" />
                <a
                  href="mailto:info@parashooting.org"
                  className="text-sm text-neutral-600 hover:text-interactive transition-colors"
                >
                  info@parashooting.org
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sponsor Section */}
      <div className="bg-white border-t border-neutral-200">
        <div className="container-main py-6 flex flex-col items-center gap-3">
          <p className="text-sm text-neutral-500 font-medium">Supported by</p>
          <Image
            src="/assets/images/vsk-logo.png"
            alt="VSK - Supported by"
            width={84}
            height={42}
            className="object-contain"
          />
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-secondary text-white">
        <div className="container-main py-4 flex flex-col md:flex-row justify-between items-center gap-2 text-sm">
          <p>© {currentYear} STC Para Shooting (Paralympic Committee of India). All rights reserved.</p>

          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-accent transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-accent transition-colors">
              Terms of Use
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}



