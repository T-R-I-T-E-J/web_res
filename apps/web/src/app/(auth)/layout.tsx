import Link from 'next/link'
import Image from 'next/image'

type AuthLayoutProps = {
  children: React.ReactNode
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col">
      {/* Minimal Header */}
      <header className="bg-white border-b border-neutral-200 py-3">
        <div className="container-main">
          <Link href="/" className="inline-flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="Paralympic Committee India"
              width={60}
              height={67}
              className="object-contain"
            />
            <span className="font-heading font-bold text-lg text-primary hidden sm:block">
              Para Shooting India
            </span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center py-12 px-4">
        {children}
      </main>

      {/* Minimal Footer */}
      <footer className="bg-white border-t border-neutral-200 py-4">
        <div className="container-main text-center text-sm text-neutral-500">
          <p>© {new Date().getFullYear()} Para Shooting Committee of India</p>
          <div className="flex justify-center gap-4 mt-2">
            <Link href="/privacy" className="hover:text-primary">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-primary">Terms of Use</Link>
            <Link href="/contact" className="hover:text-primary">Help</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default AuthLayout

