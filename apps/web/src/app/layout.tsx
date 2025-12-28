import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'Para Shooting Committee of India',
    template: '%s | Para Shooting India',
  },
  description: 'Official website of the Para Shooting Committee of India - Promoting and developing para shooting sports across India.',
  keywords: ['para shooting', 'India', 'Paralympic', 'shooting sports', 'WSPS', 'disabled athletes'],
}

type RootLayoutProps = {
  children: React.ReactNode
}

const RootLayout = ({ children }: RootLayoutProps) => {
  return (
    <html lang="en">
      <body className="min-h-screen bg-neutral-50 text-neutral-700 font-body">
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        {children}
      </body>
    </html>
  )
}

export default RootLayout

