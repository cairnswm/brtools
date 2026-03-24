import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import { accessElf } from '../../components/accessElf';
import { useInternationalsHook } from '../hooks/useInternationalsHook';
import IntPlayersTab from '../components/IntPlayersTab';
import IntFixturesTab from '../components/IntFixturesTab';

function IntTeamDetailPage() {
  accessElf.track("International Team Detail");

  const { type, teamId } = useParams();
  const navigate = useNavigate();
  const {
    activeInternational,
    setActiveInternationalId,
    setActiveInternationalType,
    nationalTeams,
    u20Teams,
    loading
  } = useInternationalsHook();

  const [activeTab, setActiveTab] = useState('players');

  useEffect(() => {
    if (teamId && type) {
      setActiveInternationalId(teamId);
      setActiveInternationalType(type);
    }
  }, [teamId, type, setActiveInternationalId, setActiveInternationalType]);

  const handleBack = () => {
    navigate('/internationals');
  };

  const teamsLoaded = nationalTeams.length > 0 || u20Teams.length > 0;

  if (!activeInternational && (!teamsLoaded || loading)) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <p className="text-gray-600">Loading team...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!activeInternational && teamsLoaded && !loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <p className="text-gray-600">Team not found</p>
            <button
              onClick={handleBack}
              className="mt-4 text-blue-600 hover:text-blue-800"
            >
              Back to Internationals
            </button>
          </div>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'players', label: 'Players' },
    { id: 'fixtures', label: 'Fixtures' }
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <button
            onClick={handleBack}
            className="flex items-center text-blue-600 hover:text-blue-800 mb-4"
          >
            <span className="mr-2">←</span>
            Back to Internationals
          </button>

          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {activeInternational.name}
            </h1>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              <div>
                <p className="text-sm text-gray-500">World Rank</p>
                <p className="text-lg font-semibold text-gray-900">
                  {activeInternational.world_rank || 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Ranking Points</p>
                <p className="text-lg font-semibold text-gray-900">
                  {activeInternational.ranking_points ? Number(activeInternational.ranking_points).toFixed(2) : 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Average Top 15 CSR</p>
                <p className="text-lg font-semibold text-gray-900">
                  {activeInternational.average_top15_csr ? Number(activeInternational.average_top15_csr).toLocaleString() : 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Owner</p>
                <p className="text-lg font-semibold text-gray-900">
                  {activeInternational.owner || 'N/A'}
                </p>
              </div>
            </div>
          </div>

          <div className="border-b border-gray-200 mb-6">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    py-4 px-1 border-b-2 font-medium text-sm
                    ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }
                  `}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        <div>
          {activeTab === 'players' && <IntPlayersTab />}
          {activeTab === 'fixtures' && <IntFixturesTab />}
        </div>
      </div>
    </div>
  );
}

export default IntTeamDetailPage;
