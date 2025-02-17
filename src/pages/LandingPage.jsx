import { Link } from 'react-router-dom';
import { useBRTools } from '../context/BRToolsContext';
import { useState } from 'react';

function LandingPage() {
  const { memberKey, setMemberKey } = useBRTools();
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">BlackoutRugby Tools</h1>
          <p className="text-xl text-gray-600 mb-8">Enhance your BlackoutRugby experience with our tools</p>
          <Link
            to="/home"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Open App
          </Link>
        </div>

        <div className="mt-16 max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-6 mb-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Key</h2>
            <p className="text-gray-600 mb-6">
              Your Access key needs to be entered to make using the site easier. The access key will be stored on your computer and not stored in any database. While some of the items on the site can be used without your access key, entering it will enhance your experience.
            </p>
            
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="memberKey" className="block text-sm font-medium text-gray-700">
                  Access Key
                </label>
                <div className="relative">
                  <button
                    type="button"
                    className="text-gray-400 hover:text-gray-500 focus:outline-none"
                    onClick={() => setShowTooltip(!showTooltip)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </button>
                  {showTooltip && (
                    <div className="absolute right-0 mt-2 w-64 bg-gray-800 text-white text-sm rounded-lg py-2 px-3 shadow-lg z-10">
                      Your access key is available in the Me | Account section on blackout rugby classic
                    </div>
                  )}
                </div>
              </div>
              <input
                type="text"
                id="memberKey"
                value={memberKey}
                onChange={(e) => setMemberKey(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your access key"
              />
            </div>
          </div>
        </div>

        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4">Stadium Calculator</h3>
              <p className="text-gray-600">Calculate optimal stadium seating distribution based on your club's membership.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4">Player Lists</h3>
              <p className="text-gray-600">View detailed player information with sortable lists, skill statistics, and Excel export capabilities.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;