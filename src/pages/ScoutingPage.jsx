import Header from '../components/Header';
import { accessElf } from '../components/accessElf';
import { useScouting } from '../scouting/hooks/useScouting';

function ScoutingPage() {
  accessElf.track("Scouting");

  const {
    filters,
    updateFilters,
    searchResults,
    isLoading,
    error,
    hasSearched,
    isFormCollapsed,
    totalLoaded,
    fetchSearchResults,
    fetchNextPage,
    resetSearch,
    toggleFormCollapse
  } = useScouting();

  const handleFilterChange = (field, value) => {
    updateFilters({ [field]: value });
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    await fetchSearchResults(0);
  };

  const handleReset = () => {
    resetSearch();
  };

  const handleLoadMore = async () => {
    await fetchNextPage();
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Scouting</h1>
          {hasSearched && (
            <button
              onClick={toggleFormCollapse}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              {isFormCollapsed ? 'Show Filters' : 'Hide Filters'}
            </button>
          )}
        </div>

        {!isFormCollapsed && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <form onSubmit={handleSearch} className="space-y-6">
            {/* Player Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Player Type
              </label>
              <div className="flex gap-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="playerType"
                    value="senior"
                    checked={filters.playerType === 'senior'}
                    onChange={(e) => handleFilterChange('playerType', e.target.value)}
                    className="mr-2"
                  />
                  <span className="text-gray-700">Senior</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="playerType"
                    value="youth"
                    checked={filters.playerType === 'youth'}
                    onChange={(e) => handleFilterChange('playerType', e.target.value)}
                    className="mr-2"
                  />
                  <span className="text-gray-700">Youth</span>
                </label>
              </div>
            </div>

            {/* Nationality */}
            <div>
              <label htmlFor="nationality" className="block text-sm font-medium text-gray-700 mb-2">
                Nationality
              </label>
              <select
                id="nationality"
                value={filters.nationality}
                onChange={(e) => handleFilterChange('nationality', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Nationalities</option>
                <option value="AR">Argentina</option>
                <option value="AU">Australia</option>
                <option value="BE">Belgium</option>
                <option value="BR">Brazil</option>
                <option value="CA">Canada</option>
                <option value="CL">Chile</option>
                <option value="HR">Croatia</option>
                <option value="CZ">Czech Republic</option>
                <option value="EN">England</option>
                <option value="FR">France</option>
                <option value="GE">Georgia</option>
                <option value="DE">Germany</option>
                <option value="HK">Hong Kong</option>
                <option value="IE">Ireland</option>
                <option value="IT">Italy</option>
                <option value="CI">Ivory Coast</option>
                <option value="JP">Japan</option>
                <option value="KE">Kenya</option>
                <option value="NA">Namibia</option>
                <option value="NL">Netherlands</option>
                <option value="NZ">New Zealand</option>
                <option value="PI">Pacific Islands</option>
                <option value="PL">Poland</option>
                <option value="PT">Portugal</option>
                <option value="RO">Romania</option>
                <option value="RU">Russia</option>
                <option value="SL">Scotland</option>
                <option value="ZA">South Africa</option>
                <option value="KR">South Korea</option>
                <option value="ES">Spain</option>
                <option value="US">United States</option>
                <option value="UY">Uruguay</option>
                <option value="WA">Wales</option>
                <option value="ZW">Zimbabwe</option>
              </select>
            </div>

            {/* Age Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Age Range
              </label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <input
                    type="number"
                    placeholder="Min Age"
                    value={filters.ageMin}
                    onChange={(e) => handleFilterChange('ageMin', e.target.value)}
                    min="16"
                    max="45"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <input
                    type="number"
                    placeholder="Max Age"
                    value={filters.ageMax}
                    onChange={(e) => handleFilterChange('ageMax', e.target.value)}
                    min="16"
                    max="45"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Height Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Height Range (cm)
              </label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <input
                    type="number"
                    placeholder="Min Height"
                    value={filters.heightMin}
                    onChange={(e) => handleFilterChange('heightMin', e.target.value)}
                    min="150"
                    max="220"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <input
                    type="number"
                    placeholder="Max Height"
                    value={filters.heightMax}
                    onChange={(e) => handleFilterChange('heightMax', e.target.value)}
                    min="150"
                    max="220"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Weight Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Weight Range (kg)
              </label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <input
                    type="number"
                    placeholder="Min Weight"
                    value={filters.weightMin}
                    onChange={(e) => handleFilterChange('weightMin', e.target.value)}
                    min="60"
                    max="150"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <input
                    type="number"
                    placeholder="Max Weight"
                    value={filters.weightMax}
                    onChange={(e) => handleFilterChange('weightMax', e.target.value)}
                    min="60"
                    max="150"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                type="submit"
                className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Search
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                Reset
              </button>
            </div>
          </form>
        </div>
        )}

        {/* Results section */}
        {hasSearched && (
          <div className="mt-6 bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Search Results {searchResults.length > 0 && `(${searchResults.length} players)`}
            </h2>

            {isLoading && searchResults.length === 0 && (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <p className="mt-2 text-gray-600">Loading players...</p>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {!isLoading && searchResults.length === 0 && !error && (
              <p className="text-gray-600 text-center py-8">
                No players found matching your criteria
              </p>
            )}

            {searchResults.length > 0 && (
              <>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Team</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Age</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nat</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Height</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Weight</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stars</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Form</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Agg</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Disc</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ldr</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {searchResults.map((player) => (
                        <tr key={player.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{player.name}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{player.teamname}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{player.age}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{player.nat1}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{player.height}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{player.weight}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{player.stars}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{player.form}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{player.agg}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{player.disc}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{player.ldr}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="mt-4 flex justify-center">
                  <button
                    onClick={handleLoadMore}
                    disabled={isLoading}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                  >
                    {isLoading ? 'Loading...' : 'Load More'}
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default ScoutingPage;
