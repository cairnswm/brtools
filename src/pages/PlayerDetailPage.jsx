import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useTeam } from '../hooks/useTeam';
import { useBRTools } from '../hooks/useBRTools';
import { accessElf } from "../components/accessElf";
import { formatCSR } from "../utils/formatters";
import { API_BASE_URL } from "../config/api";

const PlayerDetailPage = () => {
  const { playerId, teamId } = useParams();
  const { players } = useTeam();
  const { memberKey } = useBRTools();
  const [activeTab, setActiveTab] = useState('information');
  const [playerStats, setPlayerStats] = useState(null);
  const [playerHistory, setPlayerHistory] = useState(null);
  const [loadingStats, setLoadingStats] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(false);

  const player = players.find(p => p.id === playerId);

  useEffect(() => {
    if (playerId && teamId) {
      accessElf.track("Team/Player/Detail", teamId);
    }
  }, [playerId, teamId]);

  useEffect(() => {
    if (activeTab === 'statistics' && !playerStats && !loadingStats) {
      fetchPlayerStats();
    }
    if (activeTab === 'history' && !playerHistory && !loadingHistory) {
      fetchPlayerHistory();
    }
  }, [activeTab]);

  const fetchPlayerStats = async () => {
    if (!playerId || loadingStats) return;

    setLoadingStats(true);
    try {
      const response = await fetch(`${API_BASE_URL}/player/${playerId}/stats`, {
        headers: { 'accesskey': memberKey }
      });
      const data = await response.json();

      if (data.data?.status === 'Ok' && data.data?.stats) {
        setPlayerStats(data.data.stats);
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

      if (data.data?.status === 'Ok' && data.data?.history) {
        setPlayerHistory(data.data.history);
      }
    } catch (err) {
      console.error('Error fetching player history:', err);
    } finally {
      setLoadingHistory(false);
    }
  };

  if (!player) {
    return (
      <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative">
        Player not found.
      </div>
    );
  }

  const tabs = [
    { id: 'information', label: 'Information' },
    { id: 'statistics', label: 'Statistics' },
    { id: 'caps', label: 'Caps' },
    { id: 'history', label: 'History' },
    { id: 'training', label: 'Training' }
  ];

  const csrFormatted = formatCSR(player.csr);

  const getNationality = () => {
    let nat = player.nationality;
    if (player.capped_for && player.capped_for === player.nationality) {
      nat += '*';
    }
    if (player.dualnationality) {
      nat += `/${player.dualnationality}`;
    }
    if (player.capped_for && player.capped_for === player.dualnationality) {
      nat += '*';
    }
    return nat;
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'information':
        return (
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Full Name</span>
                    <span className="font-semibold text-gray-900">{player.fname} {player.lname}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Jersey Number</span>
                    <span className="font-semibold text-gray-900">{player.jersey !== "255" ? player.jersey : "N/A"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Position</span>
                    <span className="font-semibold text-gray-900 capitalize">{player.position}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Age</span>
                    <span className="font-semibold text-gray-900">{player.age}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Height</span>
                    <span className="font-semibold text-gray-900">{player.height} cm</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Weight</span>
                    <span className="font-semibold text-gray-900">{player.weight} kg</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Nationality</span>
                    <span className="font-semibold text-gray-900">{getNationality()}</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">CSR</span>
                    <span className={`font-bold ${csrFormatted.color}`}>{csrFormatted.value}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Energy</span>
                    <span className="font-semibold text-gray-900">{player.energy}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Form</span>
                    <span className="font-semibold text-gray-900">{player.form}/11</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Leadership</span>
                    <span className="font-semibold text-gray-900">{player.leadership}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Experience</span>
                    <span className="font-semibold text-gray-900">{player.experience}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Discipline</span>
                    <span className="font-semibold text-gray-900">{player.discipline}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Aggression</span>
                    <span className="font-semibold text-gray-900">{player.aggression}</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Contract</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Salary</span>
                    <span className="font-semibold text-gray-900">${Number(player.salary).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Skills</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-gray-600">Stamina</span>
                      <span className="font-semibold text-gray-900">{player.stamina}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${(player.stamina / 20) * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-gray-600">Handling</span>
                      <span className="font-semibold text-gray-900">{player.handling}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${(player.handling / 20) * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-gray-600">Attack</span>
                      <span className="font-semibold text-gray-900">{player.attack}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${(player.attack / 20) * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-gray-600">Defense</span>
                      <span className="font-semibold text-gray-900">{player.defense}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${(player.defense / 20) * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-gray-600">Technique</span>
                      <span className="font-semibold text-gray-900">{player.technique}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${(player.technique / 20) * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-gray-600">Strength</span>
                      <span className="font-semibold text-gray-900">{player.strength}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${(player.strength / 20) * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-gray-600">Jumping</span>
                      <span className="font-semibold text-gray-900">{player.jumping}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${(player.jumping / 20) * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-gray-600">Speed</span>
                      <span className="font-semibold text-gray-900">{player.speed}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${(player.speed / 20) * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-gray-600">Agility</span>
                      <span className="font-semibold text-gray-900">{player.agility}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${(player.agility / 20) * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-gray-600">Kicking</span>
                      <span className="font-semibold text-gray-900">{player.kicking}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${(player.kicking / 20) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'statistics':
        if (loadingStats) {
          return (
            <div className="bg-gray-50 rounded-lg p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-600 mt-4">Loading statistics...</p>
            </div>
          );
        }

        if (!playerStats) {
          return (
            <div className="bg-gray-50 rounded-lg p-8 text-center">
              <p className="text-gray-600">No statistics available for this player.</p>
            </div>
          );
        }

        return (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Career Statistics</h3>
                <div className="space-y-3">
                  {playerStats.matches_played !== undefined && (
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-sm text-gray-600">Matches Played</span>
                      <span className="font-semibold">{playerStats.matches_played}</span>
                    </div>
                  )}
                  {playerStats.tries !== undefined && (
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-sm text-gray-600">Tries</span>
                      <span className="font-semibold">{playerStats.tries}</span>
                    </div>
                  )}
                  {playerStats.conversions !== undefined && (
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-sm text-gray-600">Conversions</span>
                      <span className="font-semibold">{playerStats.conversions}</span>
                    </div>
                  )}
                  {playerStats.penalties !== undefined && (
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-sm text-gray-600">Penalties</span>
                      <span className="font-semibold">{playerStats.penalties}</span>
                    </div>
                  )}
                  {playerStats.dropgoals !== undefined && (
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-sm text-gray-600">Drop Goals</span>
                      <span className="font-semibold">{playerStats.dropgoals}</span>
                    </div>
                  )}
                  {playerStats.total_points !== undefined && (
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-sm text-gray-600">Total Points</span>
                      <span className="font-semibold">{playerStats.total_points}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Stats</h3>
                <div className="space-y-3">
                  {playerStats.tackles !== undefined && (
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-sm text-gray-600">Tackles</span>
                      <span className="font-semibold">{playerStats.tackles}</span>
                    </div>
                  )}
                  {playerStats.missed_tackles !== undefined && (
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-sm text-gray-600">Missed Tackles</span>
                      <span className="font-semibold">{playerStats.missed_tackles}</span>
                    </div>
                  )}
                  {playerStats.metres_gained !== undefined && (
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-sm text-gray-600">Metres Gained</span>
                      <span className="font-semibold">{playerStats.metres_gained}</span>
                    </div>
                  )}
                  {playerStats.linebreaks !== undefined && (
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-sm text-gray-600">Linebreaks</span>
                      <span className="font-semibold">{playerStats.linebreaks}</span>
                    </div>
                  )}
                  {playerStats.turnovers !== undefined && (
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-sm text-gray-600">Turnovers</span>
                      <span className="font-semibold">{playerStats.turnovers}</span>
                    </div>
                  )}
                  {playerStats.yellow_cards !== undefined && (
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-sm text-gray-600">Yellow Cards</span>
                      <span className="font-semibold">{playerStats.yellow_cards}</span>
                    </div>
                  )}
                  {playerStats.red_cards !== undefined && (
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-sm text-gray-600">Red Cards</span>
                      <span className="font-semibold">{playerStats.red_cards}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {(playerStats.injuries !== undefined || playerStats.category_1_injuries !== undefined) && (
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Injury Record</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  {playerStats.injuries !== undefined && (
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">{playerStats.injuries}</div>
                      <div className="text-sm text-gray-600">Total Injuries</div>
                    </div>
                  )}
                  {playerStats.category_1_injuries !== undefined && (
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">{playerStats.category_1_injuries}</div>
                      <div className="text-sm text-gray-600">Category 1</div>
                    </div>
                  )}
                  {playerStats.category_2_injuries !== undefined && (
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">{playerStats.category_2_injuries}</div>
                      <div className="text-sm text-gray-600">Category 2</div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        );

      case 'caps':
        return (
          <div className="space-y-6">
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">International Caps</h3>
              <div className="space-y-3">
                {player.capped_for && (
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Capped For</span>
                      <span className="font-semibold text-lg">{player.capped_for}</span>
                    </div>
                    <div className="mt-2 text-xs text-gray-500">
                      This player has represented {player.capped_for} at the international level
                    </div>
                  </div>
                )}
                {!player.capped_for && (
                  <div className="text-center py-8">
                    <p className="text-gray-600">This player has not yet been capped at international level.</p>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Eligibility</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Primary Nationality</span>
                  <span className="font-semibold">{player.nationality}</span>
                </div>
                {player.dualnationality && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Dual Nationality</span>
                    <span className="font-semibold">{player.dualnationality}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case 'history':
        if (loadingHistory) {
          return (
            <div className="bg-gray-50 rounded-lg p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-600 mt-4">Loading history...</p>
            </div>
          );
        }

        if (!playerHistory || playerHistory.length === 0) {
          return (
            <div className="bg-gray-50 rounded-lg p-8 text-center">
              <p className="text-gray-600">No history available for this player.</p>
            </div>
          );
        }

        return (
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Career History</h3>
              <div className="space-y-3">
                {playerHistory.map((entry, index) => (
                  <div key={index} className="bg-white rounded-lg p-4 border border-gray-200">
                    <div className="grid md:grid-cols-2 gap-4">
                      {entry.season !== undefined && (
                        <div>
                          <span className="text-sm text-gray-600">Season:</span>
                          <span className="ml-2 font-semibold">{entry.season}</span>
                        </div>
                      )}
                      {entry.team_name !== undefined && (
                        <div>
                          <span className="text-sm text-gray-600">Team:</span>
                          <span className="ml-2 font-semibold">{entry.team_name}</span>
                        </div>
                      )}
                      {entry.competition !== undefined && (
                        <div>
                          <span className="text-sm text-gray-600">Competition:</span>
                          <span className="ml-2 font-semibold">{entry.competition}</span>
                        </div>
                      )}
                      {entry.matches_played !== undefined && (
                        <div>
                          <span className="text-sm text-gray-600">Matches:</span>
                          <span className="ml-2 font-semibold">{entry.matches_played}</span>
                        </div>
                      )}
                      {entry.tries !== undefined && (
                        <div>
                          <span className="text-sm text-gray-600">Tries:</span>
                          <span className="ml-2 font-semibold">{entry.tries}</span>
                        </div>
                      )}
                      {entry.points !== undefined && (
                        <div>
                          <span className="text-sm text-gray-600">Points:</span>
                          <span className="ml-2 font-semibold">{entry.points}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'training':
        return (
          <div className="bg-gray-50 rounded-lg p-8 text-center">
            <p className="text-gray-600">Training information coming soon...</p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-blue-700 text-2xl font-bold shadow-lg">
                {player.jersey !== "255" ? player.jersey : "?"}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">
                  {player.fname} {player.lname}
                </h1>
                <p className="text-blue-100 text-lg capitalize">{player.position}</p>
              </div>
            </div>
            <Link
              to={`/team/${teamId}/players`}
              className="px-4 py-2 bg-white text-blue-700 rounded-lg hover:bg-blue-50 transition-colors font-semibold"
            >
              Back to Players
            </Link>
          </div>
        </div>

        <div className="border-b border-gray-200">
          <div className="flex px-8 space-x-8">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="p-8">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default PlayerDetailPage;
