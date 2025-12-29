import type { Metadata } from 'next'
import Script from 'next/script'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'Para Shooting Committee of India',
    template: '%s | Para Shooting India',
  },
  description: 'Official website of the Para Shooting Committee of India - Promoting and developing para shooting sports across India.',
  keywords: ['para shooting', 'India', 'Paralympic', 'shooting sports', 'WSPS', 'disabled athletes'],
  
  // Security Headers
  referrer: 'strict-origin-when-cross-origin',
  
  // Open Graph
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://parashootingindia.org',
    siteName: 'Para Shooting Committee of India',
    title: 'Para Shooting Committee of India',
    description: 'Official website of the Para Shooting Committee of India - Promoting and developing para shooting sports across India.',
  },
  
  // Twitter Card
  twitter: {
    card: 'summary_large_image',
    title: 'Para Shooting Committee of India',
    description: 'Official website of the Para Shooting Committee of India',
  },
  
  // Verification & Security
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

type RootLayoutProps = {
  children: React.ReactNode
}

const RootLayout = ({ children }: RootLayoutProps) => {
  return (
    <html lang="en">
      <head>
        {/* CookieYes - GDPR/DPDP Consent Management */}
        {/* TODO: Configure NEXT_PUBLIC_COOKIEYES_ID in production environment */}
        {/* Uncomment and replace YOUR_COOKIEYES_ID with actual CookieYes account ID */}
        {/* 
        <Script
          id="cookieyes"
          src={`https://cdn-cookieyes.com/client_data/${process.env.NEXT_PUBLIC_COOKIEYES_ID}/script.js`}
          strategy="beforeInteractive"
        />
        */}
        
        {/* Security: Content Security Policy */}
        <meta
          httpEquiv="Content-Security-Policy"
          content="upgrade-insecure-requests"
        />
      </head>
      <body className="min-h-screen bg-neutral-50 text-neutral-700 font-body">
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        {children}
        
        {/* Analytics Scripts (Loaded after consent) */}
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              // GA will be initialized after cookie consent
            `,
          }}
        />
      </body>
    </html>
  )
}

export default RootLayout

