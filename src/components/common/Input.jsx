import clsx from 'clsx'

const Input = ({ label, error, className = '', required, ...props }) => (
  <div className="space-y-1">
    {label && (
      <label className="block text-sm font-medium text-gray-700">
        {label}{required && <span className="text-red-500 ml-1">*</span>}
      </label>
    )}
    <input
      className={clsx(
        'w-full px-3 py-2 border rounded-lg text-sm transition-all duration-200',
        'focus:outline-none focus:ring-2 focus:ring-[#4529f7] focus:border-transparent',
        'placeholder:text-gray-400',
        error ? 'border-red-400 bg-red-50' : 'border-gray-300 bg-white',
        className
      )}
      {...props}
    />
    {error && <p className="text-xs text-red-500">{error}</p>}
  </div>
)

export default Input
