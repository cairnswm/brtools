import Header from '../components/Header';
import { accessElf } from '../components/accessElf';

function ScoutingPage() {
  accessElf.track("Scouting");

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Scouting</h1>

        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-600">
            Scouting functionality coming soon...
          </p>
        </div>
      </div>
    </div>
  );
}

export default ScoutingPage;
