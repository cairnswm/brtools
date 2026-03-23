import { useState } from 'react';
import { useImport } from '../hooks/useImport';
import Header from '../components/Header';

function ImportPage() {
  const { importing, importError, importRankings } = useImport();
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleImportRankings = async () => {
    if (!file) {
      alert('Please select a file to import');
      return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const content = e.target.result;
        const result = await importRankings(content);

        if (result.success) {
          alert('Rankings imported successfully!');
          setFile(null);
        } else {
          alert(`Import failed: ${result.error}`);
        }
      } catch (err) {
        alert(`Error reading file: ${err.message}`);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Import Data</h1>

        <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Import Rankings</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Rankings File
              </label>
              <input
                type="file"
                accept=".csv,.txt,.json"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
              />
              {file && (
                <p className="mt-2 text-sm text-gray-600">
                  Selected: {file.name}
                </p>
              )}
            </div>

            <button
              onClick={handleImportRankings}
              disabled={importing || !file}
              className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {importing ? 'Importing...' : 'Import Rankings'}
            </button>

            {importError && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                {importError}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ImportPage;
