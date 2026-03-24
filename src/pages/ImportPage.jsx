import { useImport } from '../hooks/useImport';
import Header from '../components/Header';
import { useEffect } from 'react';

function ImportPage() {
  const {
    loading,
    error,
    totalLoaded,
    isImporting,
    fetchRankings,
    teamsProcessed,
    totalTeamsToProcess,
    isProcessingTeams,
    lastDataLoad,
    fetchLastDataLoad
  } = useImport();

  useEffect(() => {
    fetchLastDataLoad();
  }, []);

  const handleImportRankings = async () => {
    await fetchRankings();
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Import Data</h1>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Import Data from Blackout Rugby</h2>

          {lastDataLoad && (
            <p className="text-sm text-gray-600 mb-4">
              Last data load: {lastDataLoad.gamedate}
            </p>
          )}

          <div className="space-y-4">
            <button
              onClick={handleImportRankings}
              disabled={isImporting}
              className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {isImporting ? 'Importing...' : 'Import Now'}
            </button>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                {error}
              </div>
            )}
          </div>
        </div>

        {totalLoaded > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Import Progress</h2>
              </div>

              <div className="flex items-center justify-end">
                <div className="text-lg font-bold text-blue-600">
                  Records Loaded: {totalLoaded}
                </div>
              </div>

              {totalTeamsToProcess > 0 && (
                <div className="flex items-center justify-end">
                  <div className="text-lg font-bold text-green-600">
                    Teams Processed: {teamsProcessed} of {totalTeamsToProcess}
                    {isProcessingTeams && ' (processing...)'}
                  </div>
                </div>
              )}
            </div>

            {loading && (
              <div className="mt-4 text-center text-gray-600">
                Loading more records...
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default ImportPage;
