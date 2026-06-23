import { CardLoadingSkeleton } from "@/components/LoadingSkeleton"

export default function Loading() {
  return (
    <div className="flex flex-col h-screen bg-grey-200">
      {/* Header Skeleton */}
      <div className="h-16 border-b border-grey-200 bg-white flex items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <div className="w-4 h-4 bg-grey-200 rounded animate-pulse"></div>
          <div className="h-5 bg-grey-200 rounded w-48 animate-pulse"></div>
        </div>
        <div className="h-9 bg-grey-200 rounded-full w-64 animate-pulse"></div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {/* Filtros Skeleton */}
        <div className="mb-6">
          <div className="h-4 bg-grey-200 rounded w-24 mb-4 animate-pulse"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i}>
                <div className="h-4 bg-grey-200 rounded w-32 mb-2 animate-pulse"></div>
                <div className="h-10 bg-grey-200 rounded animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Grid Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <CardLoadingSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  )
}
