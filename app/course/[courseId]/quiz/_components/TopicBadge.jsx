'use client';
import React from 'react';

function TopicBadge({ topic }) {
  if (!topic) return null;

  return (
    <div className="inline-block mb-4 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
      {topic}
    </div>
  );
}

export default TopicBadge;
