import clsx from 'clsx'

const variants = {
 primary: 'bg-gradient-to-r from-[#b03cff] via-[#7938fa] to-[#4934f5] hover:from-[#a12ff2] hover:via-[#6d30ed] hover:to-[#3d28e8] text-white',
  secondary: 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-300',
  danger:    'bg-red-600 hover:bg-red-700 text-white',
  ghost:     'hover:bg-gray-100 text-gray-600',
  success:   'bg-green-600 hover:bg-green-700 text-white',
}

const sizes = {
  xs: 'px-2.5 py-1.5 text-xs',
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
}

const Button = ({ children, variant = 'primary', size = 'md', loading = false, className = '', icon: Icon, ...props }) => (
  <button
    className={clsx(
      'inline-flex items-center gap-2 font-medium rounded-lg transition-colors duration-200',
      'focus:outline-none focus:ring-2 focus:ring-[#4529f7] focus:ring-offset-2',
      'disabled:opacity-50 disabled:cursor-not-allowed',
      variants[variant], sizes[size], className
    )}
    disabled={loading || props.disabled}
    {...props}
  >
    {loading ? (
      <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
      </svg>
    ) : Icon ? <Icon className="h-4 w-4" /> : null}
    {children}
  </button>
)

export default Button
