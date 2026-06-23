export function LoadingSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-4 bg-grey-200 rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-grey-200 rounded w-1/2"></div>
    </div>
  )
}

export function CardLoadingSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-grey-200 p-6 animate-pulse">
      <div className="aspect-square bg-grey-200 rounded-lg mb-4"></div>
      <div className="flex items-center gap-1 mb-2">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="w-4 h-4 bg-grey-200 rounded"></div>
        ))}
        <div className="w-8 h-4 bg-grey-200 rounded ml-2"></div>
      </div>
      <div className="h-5 bg-grey-200 rounded mb-2"></div>
      <div className="h-6 bg-grey-200 rounded w-20"></div>
    </div>
  )
}

export function PageLoadingSkeleton() {
  return (
    <div className="flex flex-col h-screen bg-grey-200">
      {/* Header Skeleton */}
      <div className="h-16 border-b border-grey-200 bg-white flex items-center justify-between px-6">
        <div className="h-5 bg-grey-200 rounded w-32 animate-pulse"></div>
        <div className="h-9 bg-grey-200 rounded-full w-64 animate-pulse"></div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {/* Title Skeleton */}
        <div className="h-8 bg-grey-200 rounded w-48 mb-6 animate-pulse"></div>

        {/* Grid Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl border border-grey-200 p-6 animate-pulse">
              <div className="aspect-square bg-grey-200 rounded-lg mb-4"></div>
              <div className="h-4 bg-grey-200 rounded mb-2"></div>
              <div className="h-4 bg-grey-200 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
