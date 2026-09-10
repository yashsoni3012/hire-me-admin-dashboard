import { useState } from 'react'
import useDebounce from './useDebounce'

const useSearch = (delay = 400) => {
  const [query, setQuery] = useState('')
  const debouncedQuery = useDebounce(query, delay)
  return { query, setQuery, debouncedQuery }
}

export default useSearch
