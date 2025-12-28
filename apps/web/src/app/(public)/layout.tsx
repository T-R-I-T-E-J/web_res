import { Header, Footer } from '@/components/ui'

type PublicLayoutProps = {
  children: React.ReactNode
}

const PublicLayout = ({ children }: PublicLayoutProps) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main id="main-content" className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  )
}

export default PublicLayout

