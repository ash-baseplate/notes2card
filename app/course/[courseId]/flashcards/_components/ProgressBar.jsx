/**
 * ProgressBar Component - Displays progress through flashcards
 * @param {number} currentIndex - Current card index (0-based)
 * @param {number} totalCards - Total number of cards
 */
function ProgressBar({ currentIndex = 0, totalCards = 0 }) {
  const percentage = Math.round(((currentIndex + 1) / (totalCards || 1)) * 100);

  return (
    <div className="w-full max-w-2xl">
      <div className="flex items-center justify-between mb-3">
        <div className="text-sm font-semibold text-gray-700">
          Card {currentIndex + 1} of {totalCards}
        </div>
        <div className="text-xs text-gray-500 font-medium">{percentage}%</div>
      </div>
      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-300 ease-out"
          style={{
            width: `${percentage}%`,
          }}
        ></div>
      </div>
    </div>
  );
}

export default ProgressBar;
