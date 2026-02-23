'use client';

const DIFFICULTY_LEVELS = ['Easy', 'Moderate', 'Hard'];

const difficultyConfig = {
  Easy: { color: 'bg-green-500', emoji: '🟢' },
  Moderate: { color: 'bg-yellow-500', emoji: '🟡' },
  Hard: { color: 'bg-red-500', emoji: '🔴' },
};

// Normalize DB values ("easy", "moderate", "hard") to display labels
function normalizeDifficulty(raw) {
  if (!raw) return 'Easy';
  const lower = raw.toLowerCase();
  if (lower === 'easy') return 'Easy';
  if (lower === 'moderate' || lower === 'medium') return 'Moderate';
  if (lower === 'hard') return 'Hard';
  return 'Other';
}

function DifficultyChart({ courses }) {
  // Count courses by difficulty
  const grouped = {};
  courses.forEach((c) => {
    const level = normalizeDifficulty(c.diffcultyLevel);
    grouped[level] = (grouped[level] || 0) + 1;
  });

  // Always show all levels, even if zero
  const entries = DIFFICULTY_LEVELS.map((level) => [level, grouped[level] || 0]);
  const max = Math.max(...entries.map(([, count]) => count), 1);

  return (
    <div className="bg-white rounded-xl border shadow-sm p-5">
      <h3 className="text-sm font-semibold text-gray-700 mb-4">Difficulty Levels</h3>
      <div className="space-y-3">
        {entries.map(([level, count]) => {
          const config = difficultyConfig[level] || difficultyConfig.Easy;
          return (
            <div key={level}>
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-medium text-gray-600">
                  {config.emoji} {level}
                </span>
                <span className="text-xs font-bold text-gray-900">{count}</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${config.color}`}
                  style={{ width: count === 0 ? '0%' : `${(count / max) * 100}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
      {courses.length === 0 && <p className="text-sm text-gray-400 mt-4">No courses yet</p>}
    </div>
  );
}

export default DifficultyChart;
