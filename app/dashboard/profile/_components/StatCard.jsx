'use client';

function StatCard({ icon, label, value, color }) {
  return (
    <div className="bg-white rounded-xl border shadow-sm p-5 flex flex-col items-center text-center gap-2 hover:shadow-md transition-shadow">
      <div className={`text-2xl ${color || ''}`}>{icon}</div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-xs text-gray-500 font-medium">{label}</p>
    </div>
  );
}

export default StatCard;
