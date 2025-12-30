
import { ArrowRight, Calendar, Tag } from 'lucide-react'

export default function Loading() {
  return (
    <>
      <section className="gradient-hero py-16 md:py-20 text-center text-white">
        <div className="container-main">
            <h1 className="font-heading text-3xl md:text-4xl font-bold mb-4">News & Updates</h1>
          <p className="opacity-90 max-w-2xl mx-auto">
            Stay updated with the latest news, announcements, and achievements from Para Shooting India.
          </p>
        </div>
      </section>

      <nav className="bg-neutral-100 py-3 text-sm">
        <div className="container-main">
           <div className="h-4 w-32 bg-neutral-200 rounded animate-pulse"></div>
        </div>
      </nav>

       <section className="py-6 bg-white border-b border-neutral-200">
        <div className="container-main">
          <div className="flex flex-wrap gap-2">
            {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-8 w-24 bg-neutral-100 rounded-full animate-pulse"></div>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-white">
        <div className="container-main">
             <div className="h-8 w-48 bg-neutral-200 rounded mb-8 animate-pulse"></div>
             
             {/* Hero Skeleton */}
             <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
                 <div className="lg:col-span-2">
                     <div className="aspect-[16/9] rounded-card bg-neutral-200 animate-pulse mb-4"></div>
                     <div className="h-6 w-1/3 bg-neutral-200 rounded mb-4 animate-pulse"></div>
                     <div className="h-8 w-3/4 bg-neutral-200 rounded mb-4 animate-pulse"></div>
                     <div className="h-4 w-full bg-neutral-200 rounded mb-2 animate-pulse"></div>
                     <div className="h-4 w-2/3 bg-neutral-200 rounded animate-pulse"></div>
                 </div>
                 
                 {/* Side Skeletons */}
                 <div className="space-y-6">
                    {[1, 2].map(i => (
                        <div key={i} className="flex gap-4">
                            <div className="w-24 h-24 rounded-card bg-neutral-200 animate-pulse flex-shrink-0"></div>
                            <div className="flex-1 space-y-2">
                                <div className="h-4 w-20 bg-neutral-200 rounded animate-pulse"></div>
                                <div className="h-5 w-full bg-neutral-200 rounded animate-pulse"></div>
                                <div className="h-5 w-2/3 bg-neutral-200 rounded animate-pulse"></div>
                            </div>
                        </div>
                    ))}
                 </div>
             </div>

             {/* Grid Skeletons */}
             <div className="h-8 w-32 bg-neutral-200 rounded mb-8 animate-pulse"></div>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map(i => (
                    <div key={i} className="card">
                        <div className="aspect-[16/10] bg-neutral-200 rounded-card mb-4 animate-pulse"></div>
                        <div className="h-4 w-24 bg-neutral-200 rounded mb-2 animate-pulse"></div>
                        <div className="h-6 w-3/4 bg-neutral-200 rounded mb-2 animate-pulse"></div>
                        <div className="h-4 w-full bg-neutral-200 rounded mb-4 animate-pulse"></div>
                    </div>
                ))}
             </div>
        </div>
      </section>
    </>
  )
}
