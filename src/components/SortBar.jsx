import { useTeam } from '../context/TeamContext';

function SortBar() {
  const { 
    sortField, 
    sortDirection, 
    handleSort, 
    sortOptions, 
    exportToExcel,
    playersView,
    setPlayersView
  } = useTeam();

  return (
    <div className="bg-white rounded-lg shadow-md p-4 flex justify-between items-center">
      <div className="flex space-x-4">
        <button
          onClick={() => setPlayersView('summary')}
          className={`px-4 py-2 rounded-md ${
            playersView === 'summary'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Summary
        </button>
        <button
          onClick={() => setPlayersView('details')}
          className={`px-4 py-2 rounded-md ${
            playersView === 'details'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Details
        </button>
      </div>
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <label htmlFor="sortField" className="text-sm font-medium text-gray-700">
            Sort:
          </label>
          <select
            id="sortField"
            value={sortField}
            onChange={(e) => handleSort(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {sortOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <button
            onClick={() => handleSort(sortField)}
            className="px-2 py-2 text-gray-600 hover:text-gray-900"
          >
            {sortDirection === 'asc' ? '↑' : '↓'}
          </button>
        </div>
        <button
          onClick={exportToExcel}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
        >
          Export to Excel
        </button>
      </div>
    </div>
  );
}

export default SortBar;