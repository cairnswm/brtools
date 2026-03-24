import { useState } from 'react';
import Header from '../components/Header';
import { accessElf } from '../components/accessElf';

function ScoutingPage() {
  accessElf.track("Scouting");

  const [filters, setFilters] = useState({
    nationality: '',
    ageMin: '',
    ageMax: '',
    heightMin: '',
    heightMax: '',
    weightMin: '',
    weightMax: '',
    playerType: 'senior'
  });

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Search filters:', filters);
    // TODO: Implement search functionality
  };

  const handleReset = () => {
    setFilters({
      nationality: '',
      ageMin: '',
      ageMax: '',
      heightMin: '',
      heightMax: '',
      weightMin: '',
      weightMax: '',
      playerType: 'senior'
    });
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Scouting</h1>

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

        {/* Results section placeholder */}
        <div className="mt-6 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Search Results</h2>
          <p className="text-gray-600">
            Use the filters above to search for players
          </p>
        </div>
      </div>
    </div>
  );
}

export default ScoutingPage;
