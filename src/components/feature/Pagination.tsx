
import Link from "next/link";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  buildHref: (page: number) => string; // funzione generica per costruire gli href
};

export default function Pagination({ currentPage, totalPages, buildHref }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages: number[] = [];
  const startPage = Math.max(1, currentPage - 2);
  const endPage = Math.min(totalPages, currentPage + 2);

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return (
    <nav className="flex justify-center mt-12 mb-8">
      <div className="flex gap-2">
        {currentPage > 1 && (
          <Link
            href={buildHref(currentPage - 1)}
            className="px-3 py-2 text-sm font-medium text-blue-600 border border-blue-200 rounded-md hover:bg-blue-50"
          >
            ← Precedente
          </Link>
        )}

        {startPage > 1 && (
          <>
            <Link
              href={buildHref(1)}
              className="px-3 py-2 text-sm font-medium text-gray-700 border border-gray-200 rounded-md hover:bg-gray-50"
            >
              1
            </Link>
            {startPage > 2 && <span className="px-2 py-2 text-gray-400">...</span>}
          </>
        )}

        {pages.map((page) => (
          <Link
            key={page}
            href={buildHref(page)}
            className={`px-3 py-2 text-sm font-medium border rounded-md ${
              page === currentPage
                ? "bg-blue-600 text-white border-blue-600"
                : "text-gray-700 border-gray-200 hover:bg-gray-50"
            }`}
          >
            {page}
          </Link>
        ))}

        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && <span className="px-2 py-2 text-gray-400">...</span>}
            <Link
              href={buildHref(totalPages)}
              className="px-3 py-2 text-sm font-medium text-gray-700 border border-gray-200 rounded-md hover:bg-gray-50"
            >
              {totalPages}
            </Link>
          </>
        )}

        {currentPage < totalPages && (
          <Link
            href={buildHref(currentPage + 1)}
            className="px-3 py-2 text-sm font-medium text-blue-600 border border-blue-200 rounded-md hover:bg-blue-50"
          >
            Successiva →
          </Link>
        )}
      </div>
    </nav>
  );
}
