import React from 'react';
import { Button } from '@/components/ui/button';

function CTASection({ isMember, upgradeLoading, onUpgrade }) {
  return (
    <div className="mt-12 bg-blue-50 rounded-xl border border-blue-200 p-8 text-center">
      <h3 className="text-2xl font-bold text-gray-900 mb-3">Ready to upgrade?</h3>
      <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
        Join thousands of students using Premium to master their subjects faster with unlimited
        study materials.
      </p>
      <Button
        size="lg"
        className="bg-blue-600 hover:bg-blue-700"
        disabled={isMember || upgradeLoading !== null}
        onClick={() => onUpgrade('monthly')}
      >
        {isMember ? 'Already Premium' : 'Start Your Premium Journey'}
      </Button>
    </div>
  );
}

export default CTASection;
