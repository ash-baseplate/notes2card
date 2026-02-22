import React from 'react';

function FeatureComparison({ features }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900">Feature Comparison</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="px-6 py-4 text-left font-semibold text-gray-900 bg-gray-50">
                Feature
              </th>
              <th className="px-6 py-4 text-center font-semibold text-gray-900 bg-gray-50">Free</th>
              <th className="px-6 py-4 text-center font-semibold text-gray-900 bg-blue-50">
                Premium
              </th>
            </tr>
          </thead>
          <tbody>
            {features.map((feature, idx) => (
              <tr key={idx} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="px-6 py-4 text-gray-900 font-medium">{feature.name}</td>
                <td className="px-6 py-4 text-center text-gray-700">{feature.free}</td>
                <td className="px-6 py-4 text-center text-gray-700 bg-blue-50/50">
                  {feature.paid}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default FeatureComparison;
