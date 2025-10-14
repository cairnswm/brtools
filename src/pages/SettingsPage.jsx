import { useBRTools } from '../hooks/useBRTools';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';

function SettingsPage() {
  const { memberKey, setMemberKey } = useBRTools();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <button
            onClick={() => navigate('/home')}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back
          </button>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Access Key</h2>
          <div className="mb-4">
            <label htmlFor="memberKey" className="block text-sm font-medium text-gray-700 mb-2">
              Your Access Key
            </label>
            <input
              type="text"
              id="memberKey"
              value={memberKey}
              onChange={(e) => setMemberKey(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your access key"
            />
            <p className="mt-2 text-sm text-gray-600">
              Your access key is available in the Me | Account section on blackout rugby classic
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SettingsPage;