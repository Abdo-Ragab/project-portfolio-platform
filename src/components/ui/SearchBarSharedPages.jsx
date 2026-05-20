import { Search } from 'lucide-react'
import React from 'react'

const SearchBarSharedPages = ({ query, setQuery, placeholder }) => {

  return (
    <div className='relative w-full'>
        <Search className='absolute left-3 top-1/2 -translate-y-1/2 text-[#0f172b]/50 w-4 h-4' />
        <input
        id='search'
        type='text'
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder ? placeholder : 'Search by title, description, or tags...'}
        className='
          w-full
          pl-9 pr-4 py-3
          bg-white
          border border-[#E2E8F0]
          rounded-md
          text-sm
          text-navy
          placeholder:text-navy/50
          outline-none
          focus:border-[#432DD7] focus:border focus:ring-2 focus:ring-[#432DD7]/20
          transition-all duration-200
        '
      />
    </div>
  )
}

export default SearchBarSharedPages