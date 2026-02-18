'use client';
import React from 'react';

function EmptyState() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-1">Quiz</h1>
      </div>
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-col items-center justify-center h-96 space-y-4">
          <p className="text-gray-500 text-lg font-medium">No quiz questions available</p>
        </div>
      </div>
    </div>
  );
}

export default EmptyState;
