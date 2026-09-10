export const timeAgo = (date) => {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000)
  const intervals = [
    { label: 'year', s: 31536000 }, { label: 'month', s: 2592000 },
    { label: 'day', s: 86400 }, { label: 'hour', s: 3600 }, { label: 'minute', s: 60 },
  ]
  for (const { label, s } of intervals) {
    const count = Math.floor(seconds / s)
    if (count >= 1) return `${count} ${label}${count > 1 ? 's' : ''} ago`
  }
  return 'just now'
}
