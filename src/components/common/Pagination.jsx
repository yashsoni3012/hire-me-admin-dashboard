import { useEffect } from "react";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";

const PAGE_SIZE_OPTIONS = [5, 10, 25, 50, 100];

const Pagination = ({
  page,
  total,
  limit,
  onChange,
  onLimitChange,
  itemsCount,
}) => {
  const safePage = Math.max(1, Number(page) || 1);
  const safeTotal = Math.max(0, Number(total) || 0);
  const safeItemsCount = Math.max(0, Number(itemsCount) || 0);
  const effectiveTotal = safeTotal > 0 ? safeTotal : safeItemsCount;
  const safeLimit = Math.max(1, Number(limit) || 10);
  const totalPages = Math.max(1, Math.ceil(effectiveTotal / safeLimit));

  useEffect(() => {
    if (safePage > totalPages && typeof onChange === "function") {
      onChange(1);
    }
  }, [safePage, totalPages, onChange]);

  // Don't render if no data
  if (effectiveTotal <= 0) {
    return null;
  }

  const clampedPage = Math.min(safePage, totalPages);
  const startItem = (clampedPage - 1) * safeLimit + 1;
  const endItem = Math.min(clampedPage * safeLimit, effectiveTotal);

  // Build page number list (show up to 5 page numbers)
  const getPages = () => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    if (clampedPage <= 3) return [1, 2, 3, 4, 5];
    if (clampedPage >= totalPages - 2)
      return [
        totalPages - 4,
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ];
    return [
      clampedPage - 2,
      clampedPage - 1,
      clampedPage,
      clampedPage + 1,
      clampedPage + 2,
    ];
  };

  const pages = getPages();

  return (
    <div className="flex flex-col gap-3 border-t border-gray-100 px-4 py-3 sm:flex-row sm:items-center sm:justify-between bg-white rounded-b-xl">
      {/* Left: Showing X-Y of Z results */}
      <p className="text-sm text-gray-500 whitespace-nowrap">
        Showing {startItem}–{endItem} of {effectiveTotal} results
      </p>

      {/* Right: Rows per page + navigation */}
      <div className="flex items-center gap-3">
        {/* Rows per page */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500 whitespace-nowrap">
            Rows per page:
          </span>
          <select
            value={safeLimit}
            onChange={(e) => {
              const newLimit = Number(e.target.value);
              if (typeof onLimitChange === "function") {
                onLimitChange(newLimit);
              }
              if (typeof onChange === "function") {
                onChange(1);
              }
            }}
            className="text-sm border border-gray-300 rounded-md px-2 py-1 bg-white focus:outline-none focus:ring-2 focus:ring-[#4529f7] cursor-pointer"
          >
            {PAGE_SIZE_OPTIONS.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>

        {/* Page navigation */}
        <div className="flex items-center gap-1">
          {/* Prev */}
          <button
            onClick={() => onChange?.(Math.max(1, clampedPage - 1))}
            disabled={clampedPage === 1}
            className="rounded-lg p-1.5 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40 text-gray-600"
            aria-label="Previous page"
          >
            <MdChevronLeft size={20} />
          </button>

          {/* Page numbers */}
          {pages.map((p) => (
            <button
              key={p}
              onClick={() => onChange?.(p)}
              className={`h-8 w-8 rounded-lg text-sm font-medium transition-colors ${p === clampedPage
                  ? "bg-[#2c0eee] text-white shadow-sm"
                  : "text-gray-600 hover:bg-gray-100"
                }`}
            >
              {p}
            </button>
          ))}

          {/* Next */}
          <button
            onClick={() =>
              onChange?.(Math.min(totalPages, clampedPage + 1))
            }
            disabled={clampedPage === totalPages}
            className="rounded-lg p-1.5 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40 text-gray-600"
            aria-label="Next page"
          >
            <MdChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Pagination;
