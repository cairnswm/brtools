import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useInternationalsHook } from '../hooks/useInternationalsHook';
import { useBRTools } from '../../hooks/useBRTools';
import { accessElf } from "../../components/accessElf";
import { formatCSR } from "../../utils/formatters";
import { API_BASE_URL } from "../../config/api";
import Header from "../../components/Header";

const IntPlayerDetailPage = () => {
  const { type, teamId, playerId } = useParams();
  const navigate = useNavigate();
  const { internationalPlayers, activeInternational } = useInternationalsHook();
  const { memberKey } = useBRTools();
  const [activeTab, setActiveTab] = useState('information');
  const [playerStats, setPlayerStats] = useState(null);
  const [playerHistory, setPlayerHistory] = useState(null);
  const [loadingStats, setLoadingStats] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(false);

  const player = internationalPlayers.find(p => p.id === playerId);

  useEffect(() => {
    if (playerId) {
      accessElf.track("International/Player/Detail", playerId);
      fetchPlayerStats();
      fetchPlayerHistory();
    }
  }, [playerId]);

  const fetchPlayerStats = async () => {
    if (!playerId || loadingStats) return;

    setLoadingStats(true);
    try {
      const response = await fetch(`${API_BASE_URL}/player/${playerId}/stats`, {
        headers: { 'accesskey': memberKey }
      });
      const data = await response.json();

      if (data.data?.status === 'Ok' && data.data?.['player statistics']?.[playerId]) {
        setPlayerStats(data.data['player statistics'][playerId]);
      }
    } catch (err) {
      console.error('Error fetching player stats:', err);
    } finally {
      setLoadingStats(false);
    }
  };

  const fetchPlayerHistory = async () => {
    if (!playerId || loadingHistory) return;

    setLoadingHistory(true);
    try {
      const response = await fetch(`${API_BASE_URL}/player/${playerId}/history`, {
        headers: { 'accesskey': memberKey }
      });
      const data = await response.json();

      if (data.data?.status === 'Ok' && data.data?.entries) {
        setPlayerHistory(data.data.entries);
      }
    } catch (err) {
      console.error('Error fetching player history:', err);
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleBack = () => {
    navigate(`/internationals/${type}/${teamId}`);
  };

  if (!player) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <p className="text-gray-600">Player not found</p>
          </div>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'information', label: 'Information' },
    { id: 'statistics', label: 'Statistics' },
    { id: 'history', label: 'History' }
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <button
          onClick={handleBack}
          className="flex items-center text-blue-600 hover:text-blue-800 mb-4"
        >
          <span className="mr-2">←</span>
          Back to {activeInternational?.name || 'Team'}
        </button>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{player.name}</h1>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-500">CSR</p>
              <p className="text-lg font-semibold text-gray-900">
                {formatCSR(player.csr)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Age</p>
              <p className="text-lg font-semibold text-gray-900">{player.age}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Nationality</p>
              <p className="text-lg font-semibold text-gray-900">{player.nationality}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Form</p>
              <p className="text-lg font-semibold text-gray-900">{player.form}</p>
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

        {activeTab === 'information' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Player Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-700 mb-2">Physical</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Height:</span>
                    <span className="font-medium">{player.height} cm</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Weight:</span>
                    <span className="font-medium">{player.weight} kg</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Hand:</span>
                    <span className="font-medium">{player.hand}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Foot:</span>
                    <span className="font-medium">{player.foot}</span>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-700 mb-2">Attributes</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Energy:</span>
                    <span className="font-medium">{player.energy}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Experience:</span>
                    <span className="font-medium">{player.experience}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Leadership:</span>
                    <span className="font-medium">{player.leadership}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Aggression:</span>
                    <span className="font-medium">{player.aggression}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Discipline:</span>
                    <span className="font-medium">{player.discipline}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'statistics' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Player Statistics</h2>
            {loadingStats ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
              </div>
            ) : playerStats ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Matches Played</p>
                    <p className="text-lg font-semibold">{playerStats.matches || 0}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Tries</p>
                    <p className="text-lg font-semibold">{playerStats.tries || 0}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Points</p>
                    <p className="text-lg font-semibold">{playerStats.points || 0}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Conversions</p>
                    <p className="text-lg font-semibold">{playerStats.conversions || 0}</p>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-gray-600">No statistics available</p>
            )}
          </div>
        )}

        {activeTab === 'history' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Player History</h2>
            {loadingHistory ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
              </div>
            ) : playerHistory && playerHistory.length > 0 ? (
              <div className="space-y-2">
                {playerHistory.map((entry, index) => (
                  <div key={index} className="border-b border-gray-200 py-2">
                    <p className="text-sm text-gray-600">{entry.date}</p>
                    <p className="text-gray-900">{entry.event}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">No history available</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default IntPlayerDetailPage;
