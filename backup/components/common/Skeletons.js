export function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-3xl shadow-soft overflow-hidden animate-pulse">
      <div className="aspect-square shimmer" />
      <div className="p-4 space-y-3">
        <div className="h-3 shimmer rounded-full w-1/3" />
        <div className="h-4 shimmer rounded-full w-3/4" />
        <div className="h-3 shimmer rounded-full w-1/2" />
        <div className="h-5 shimmer rounded-full w-1/2" />
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {[...Array(count)].map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function HeroBannerSkeleton() {
  return (
    <div className="h-[85vh] min-h-[500px] max-h-[700px] shimmer" />
  );
}

export function PageHeaderSkeleton() {
  return (
    <div className="py-12 px-4 bg-gray-100 animate-pulse">
      <div className="max-w-7xl mx-auto text-center space-y-3">
        <div className="h-8 shimmer rounded-full w-64 mx-auto" />
        <div className="h-4 shimmer rounded-full w-32 mx-auto" />
      </div>
    </div>
  );
}

export function ProductDetailSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-pulse">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-4">
          <div className="aspect-square shimmer rounded-3xl" />
          <div className="flex gap-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="w-20 h-20 shimmer rounded-2xl" />
            ))}
          </div>
        </div>
        <div className="space-y-4">
          <div className="h-4 shimmer rounded-full w-1/4" />
          <div className="h-8 shimmer rounded-full w-3/4" />
          <div className="h-6 shimmer rounded-full w-1/2" />
          <div className="h-10 shimmer rounded-full w-1/3" />
          <div className="flex gap-2">
            {[...Array(4)].map((_, i) => <div key={i} className="h-10 w-16 shimmer rounded-xl" />)}
          </div>
          <div className="flex gap-3">
            <div className="flex-1 h-14 shimmer rounded-2xl" />
            <div className="flex-1 h-14 shimmer rounded-2xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
