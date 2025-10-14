import { useBRTools } from '../hooks/useBRTools';
import Header from '../components/Header';
import AccessKeyInput from '../components/AccessKeyInput';
import IconMenu from '../components/IconMenu';
import TeamsList from '../components/TeamsList';
import { accessElf } from '../components/accessElf';

function HomePage() {
  const { loading, error, teams, memberKey } = useBRTools();

  accessElf.track("Home");

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Welcome to BlackoutRugby Tools</h1>
        
        {!memberKey && <AccessKeyInput />}
        <IconMenu />

        {loading && (
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6">
            {error}
          </div>
        )}

        <TeamsList />

        {!loading && !error && teams.length === 0 && memberKey && (
          <div className="text-center text-gray-600">
            No teams found. Please check your access key.
          </div>
        )}
      </div>
    </div>
  );
}

export default HomePage