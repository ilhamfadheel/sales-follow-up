"use client";

export default function LoadingSkeleton() {
  return (
    <div className="w-full">
      {/* Toolbar skeleton */}
      <div className="flex items-center justify-between mb-6">
        <div className="h-10 w-72 bg-gray-200 rounded-lg animate-pulse" />
        <div className="h-10 w-32 bg-gray-200 rounded-lg animate-pulse" />
      </div>

      {/* Table skeleton */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="grid grid-cols-6 gap-4 px-6 py-4 bg-gray-50 border-b border-gray-200">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-4 bg-gray-300 rounded animate-pulse" />
          ))}
        </div>

        {/* Rows */}
        {[...Array(5)].map((_, rowIdx) => (
          <div
            key={rowIdx}
            className="grid grid-cols-6 gap-4 px-6 py-4 border-b border-gray-100 items-center"
          >
            <div className="h-4 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
            <div className="h-6 bg-gray-200 rounded-full animate-pulse w-20" />
            <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2" />
            <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3" />
            <div className="h-8 bg-gray-200 rounded animate-pulse w-24" />
          </div>
        ))}
      </div>
    </div>
  );
}
