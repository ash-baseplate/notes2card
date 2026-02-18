'use client';
import React from 'react';

function ScoreCard({ correct, total, percentage }) {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
      <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide mb-3">Score</p>
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-700">Correct</span>
          <span className="text-2xl font-bold text-green-600">{correct}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-700">Total</span>
          <span className="text-2xl font-bold text-gray-900">{total}</span>
        </div>
        <div className="pt-2 border-t border-blue-200">
          <span className="text-xs text-gray-600">Accuracy</span>
          <p className="text-xl font-bold text-blue-600">{percentage}%</p>
        </div>
      </div>
    </div>
  );
}

export default ScoreCard;
