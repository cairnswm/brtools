import { useState } from 'react';
import { useBRTools } from '../context/BRToolsContext';

function AccessKeyInput() {
  const { memberKey, setMemberKey } = useBRTools();
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
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
  );
}

export default AccessKeyInput;