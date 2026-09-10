import { useState } from 'react'
import { PAGINATION } from '../utils/constants'

const usePagination = (initialLimit = PAGINATION.DEFAULT_LIMIT) => {
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(initialLimit)

  const nextPage = () => setPage(p => p + 1)
  const prevPage = () => setPage(p => Math.max(1, p - 1))
  const goToPage = (p) => setPage(p)
  const reset = () => setPage(1)

  return { page, limit, setLimit, nextPage, prevPage, goToPage, reset }
}

export default usePagination
