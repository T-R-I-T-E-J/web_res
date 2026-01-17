'use client'

import { useState } from 'react'
import { Search } from 'lucide-react'
import { useDebounce } from '@/hooks/use-debounce'
import { useEffect } from 'react'

export const SearchBar = () => {
  const [query, setQuery] = useState('')
  const debouncedQuery = useDebounce(query, 500)

  useEffect(() => {
    if (debouncedQuery) {
      // TODO: Implement actual search API call here
    }
  }, [debouncedQuery])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Immediate search on submit
    console.log('Search submit:', query)
  }

  return (
    <section className="bg-primary py-6">
      <div className="container-main">
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 justify-center max-w-2xl mx-auto">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for news, results, shooters..."
              className="w-full pl-12 pr-4 py-3 rounded-card text-base border-2 border-transparent focus:border-accent focus:outline-none"
              aria-label="Search"
            />
          </div>
          <button
            type="submit"
            className="px-8 py-3 bg-accent text-white font-semibold rounded-card hover:bg-accent-dark transition-colors"
          >
            Search
          </button>
        </form>
      </div>
    </section>
  )
}



