import React from 'react';
import { Crown } from 'lucide-react';

function PricingHeader({ isMember }) {
  return (
    <div className="text-center mb-8">
      <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Choose Your Plan</h1>
      <p className="text-xl text-gray-600 mb-2">Unlock unlimited study materials and AI features</p>
      {isMember && (
        <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 px-4 py-2 rounded-full mt-4">
          <Crown className="w-5 h-5 text-green-600" />
          <span className="text-green-700 font-medium">You&apos;re a Premium Member</span>
        </div>
      )}
    </div>
  );
}

export default PricingHeader;
