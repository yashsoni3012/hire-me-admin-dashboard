import { MdSearch, MdClose } from "react-icons/md";

const SearchBox = ({
  value,
  onChange,
  placeholder = "Search...",
  className = "",
}) => (
  <div className={`relative ${className}`}>
    <MdSearch
      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
      size={18}
    />
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="pl-9 pr-9 py-2 border border-gray-300 rounded-lg text-sm w-64 focus:outline-none focus:ring-2 focus:ring-[#4529f7] focus:border-transparent"
    />
    {value && (
      <button
        onClick={() => onChange("")}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
      >
        <MdClose size={16} />
      </button>
    )}
  </div>
);

export default SearchBox;
