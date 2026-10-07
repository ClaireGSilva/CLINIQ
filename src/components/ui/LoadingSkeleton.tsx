import React from 'react';

export const CardSkeleton: React.FC = () => (
  <div className="bg-white rounded-3xl p-6 border border-[#E6E5DE] space-y-4 animate-pulse">
    <div className="flex items-start justify-between">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-[#EFEFEA]" />
        <div className="space-y-2">
          <div className="w-36 h-4 bg-[#EFEFEA] rounded" />
          <div className="w-24 h-3 bg-[#EFEFEA] rounded" />
        </div>
      </div>
      <div className="w-16 h-4 bg-[#EFEFEA] rounded" />
    </div>

    <div className="pt-3 border-t border-[#F0EFEA] space-y-2">
      <div className="w-full h-3 bg-[#EFEFEA] rounded" />
      <div className="w-4/5 h-3 bg-[#EFEFEA] rounded" />
    </div>

    <div className="pt-2 flex gap-2">
      <div className="flex-1 h-9 bg-[#EFEFEA] rounded-xl" />
      <div className="flex-1 h-9 bg-[#EFEFEA] rounded-xl" />
    </div>
  </div>
);

export const ResultsGridSkeleton: React.FC = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <CardSkeleton />
    <CardSkeleton />
    <CardSkeleton />
    <CardSkeleton />
  </div>
);
