'use client'

import { useState, useEffect } from 'react'
import Script from 'next/script'
import Link from 'next/link'
import Cookies from 'js-cookie'
import { X, Check, Shield } from 'lucide-react'

type ConsentState = 'undecided' | 'granted' | 'denied'

const COOKIE_NAME = 'cookie_consent'
const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID

export default function CookieConsent() {
  const [consent, setConsent] = useState<ConsentState>('undecided')
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Check for existing consent
    const storedConsent = Cookies.get(COOKIE_NAME)
    
    if (storedConsent === 'granted' || storedConsent === 'denied') {
      setConsent(storedConsent)
      setIsVisible(false)
    } else {
      setIsVisible(true)
    }
  }, [])

  const handleAccept = () => {
    setConsent('granted')
    setIsVisible(false)
    Cookies.set(COOKIE_NAME, 'granted', { expires: 365, sameSite: 'lax' }) // 1 year
  }

  const handleDecline = () => {
    setConsent('denied')
    setIsVisible(false)
    Cookies.set(COOKIE_NAME, 'denied', { expires: 365, sameSite: 'lax' }) // 1 year
  }

  return (
    <>
      {/* Analytics Script - Only loaded if granted */}
      {consent === 'granted' && GA_MEASUREMENT_ID && (
        <>
           <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_MEASUREMENT_ID}', {
                page_path: window.location.pathname,
                anonymize_ip: true, // Privacy compliance
              });
            `}
          </Script>
        </>
      )}

      {/* Consent Banner */}
      {isVisible && (
        <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6 bg-white border-t border-neutral-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] animate-in slide-in-from-bottom duration-300">
          <div className="container-main max-w-6xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            
            <div className="flex-1 space-y-2">
              <h3 className="flex items-center gap-2 font-heading font-bold text-lg text-primary">
                <Shield className="w-5 h-5" />
                We Value Your Privacy
              </h3>
              <p className="text-sm text-neutral-600 leading-relaxed max-w-2xl">
                We use cookies to enhance your experience and analyze website traffic. 
                Strictly necessary cookies are essential for the site to function (like secure login) and cannot be switched off.
                We would also like to use analytics cookies to help us improve our services.
                <br />
                <span className="mt-1 inline-block">
                  For more details, please review our{' '}
                  <Link href="/privacy" className="text-interactive hover:underline font-medium">
                    Privacy Policy
                  </Link>.
                </span>
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 min-w-[280px]">
              <button
                onClick={handleDecline}
                className="btn-outline text-sm py-2.5 px-6 justify-center"
              >
                Reject All
              </button>
              <button
                onClick={handleAccept}
                className="btn-primary text-sm py-2.5 px-6 justify-center shadow-lg hover:shadow-xl"
              >
                Accept All
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  )
}
