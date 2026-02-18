'use client';
import React from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const LOTTIE_LOADING_URL =
  'https://lottie.host/8a46a4d9-1cd2-4258-b472-543a7bf7b032/k33MzDw8sJ.lottie';

function LoadingState() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-col items-center justify-center h-96 space-y-4">
          <div className="w-64 h-64">
            <DotLottieReact src={LOTTIE_LOADING_URL} loop autoplay />
          </div>
          <p className="text-gray-500 text-lg font-medium">Loading quiz...</p>
        </div>
      </div>
    </div>
  );
}

export default LoadingState;
