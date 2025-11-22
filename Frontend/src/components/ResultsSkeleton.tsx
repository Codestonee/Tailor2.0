import React from 'react';

export const ResultsSkeleton: React.FC = () => {
  return (
    <div className="bg-gray-900 rounded-xl border border-gray-800 shadow-sm overflow-hidden h-full flex flex-col animate-pulse">
      {/* Header Tabs */}
      <div className="border-b border-gray-800 flex h-14">
        <div className="flex-1 bg-gray-800/50 m-2 rounded-lg"></div>
        <div className="flex-1 m-2 rounded-lg"></div>
      </div>

      <div className="flex-1 p-6 space-y-6">
        {/* Score Section */}
        <div className="flex items-center gap-6 p-6 rounded-xl bg-gray-950 border border-gray-800">
          <div className="w-24 h-24 rounded-full bg-gray-800"></div>
          <div className="flex-1 space-y-3">
            <div className="h-6 bg-gray-800 rounded w-1/3"></div>
            <div className="h-4 bg-gray-800 rounded w-full"></div>
            <div className="h-4 bg-gray-800 rounded w-2/3"></div>
          </div>
        </div>

        {/* Score Breakdown Skeleton */}
        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-2 bg-gray-800 rounded-full"></div>
          ))}
        </div>

        {/* Keywords Grid */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-4 rounded-lg bg-gray-800/20 border border-gray-800 h-32"></div>
          <div className="p-4 rounded-lg bg-gray-800/20 border border-gray-800 h-32"></div>
        </div>

        {/* Improvements */}
        <div className="space-y-3">
          <div className="h-5 bg-gray-800 rounded w-1/4 mb-2"></div>
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-gray-800/50 rounded-lg border border-gray-800"></div>
          ))}
        </div>
      </div>
    </div>
  );
};