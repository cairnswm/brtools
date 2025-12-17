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
      fetchPlayerStats();
      fetchPlayerHistory();
    }
  }, [playerId, teamId]);

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

  const parseHistoryEvent = (eventText) => {
    // Replace skill tags
    let parsed = eventText.replace(/<skill type=(\w+) \/>/g, (match, skillType) => {
      return skillType.charAt(0).toUpperCase() + skillType.slice(1);
    });

    // Replace rank tags
    parsed = parsed.replace(/<rank value=(\d+) \/>/g, (match, rankValue) => {
      return rankValue;
    });

    // Replace comp tags
    parsed = parsed.replace(/<comp type=(\w+) \/>/g, (match, compType) => {
      return compType;
    });

    // Parse and create React elements
    const parts = [];
    let lastIndex = 0;
    const anchorRegex = /<a href="([^"]+)">([^<]+)<\/a>/g;
    let match;

    while ((match = anchorRegex.exec(parsed)) !== null) {
      // Add text before the link
      if (match.index > lastIndex) {
        parts.push(parsed.substring(lastIndex, match.index));
      }

      // Add the link as a React element
      const href = `https://www.blackoutrugby.com/game/${match[1]}`;
      parts.push(
        <a
          key={match.index}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800 underline"
        >
          {match[2]}
        </a>
      );

      lastIndex = anchorRegex.lastIndex;
    }

    // Add remaining text
    if (lastIndex < parsed.length) {
      parts.push(parsed.substring(lastIndex));
    }

    // If no links found, return the parsed text
    if (parts.length === 0) {
      return parsed;
    }

    return parts;
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
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Scoring</h3>
                <div className="space-y-2">
                  {playerStats.totalpoints !== undefined && (
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-sm text-gray-600">Total Points</span>
                      <span className="font-semibold">{playerStats.totalpoints}</span>
                    </div>
                  )}
                  {playerStats.tries !== undefined && (
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-sm text-gray-600">Tries</span>
                      <span className="font-semibold">{playerStats.tries}</span>
                    </div>
                  )}
                  {playerStats.tryassists !== undefined && (
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-sm text-gray-600">Try Assists</span>
                      <span className="font-semibold">{playerStats.tryassists}</span>
                    </div>
                  )}
                  {playerStats.conversions !== undefined && (
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-sm text-gray-600">Conversions</span>
                      <span className="font-semibold">{playerStats.conversions}</span>
                    </div>
                  )}
                  {playerStats.missedconversions !== undefined && (
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-sm text-gray-600">Missed Conversions</span>
                      <span className="font-semibold">{playerStats.missedconversions}</span>
                    </div>
                  )}
                  {playerStats.penalties !== undefined && (
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-sm text-gray-600">Penalties</span>
                      <span className="font-semibold">{playerStats.penalties}</span>
                    </div>
                  )}
                  {playerStats.missedpenalties !== undefined && (
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-sm text-gray-600">Missed Penalties</span>
                      <span className="font-semibold">{playerStats.missedpenalties}</span>
                    </div>
                  )}
                  {playerStats.dropgoals !== undefined && (
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-sm text-gray-600">Drop Goals</span>
                      <span className="font-semibold">{playerStats.dropgoals}</span>
                    </div>
                  )}
                  {playerStats.misseddropgoals !== undefined && (
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-sm text-gray-600">Missed Drop Goals</span>
                      <span className="font-semibold">{playerStats.misseddropgoals}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Attack</h3>
                <div className="space-y-2">
                  {playerStats.metresgained !== undefined && (
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-sm text-gray-600">Metres Gained</span>
                      <span className="font-semibold">{playerStats.metresgained}</span>
                    </div>
                  )}
                  {playerStats.linebreaks !== undefined && (
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-sm text-gray-600">Line Breaks</span>
                      <span className="font-semibold">{playerStats.linebreaks}</span>
                    </div>
                  )}
                  {playerStats.beatendefenders !== undefined && (
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-sm text-gray-600">Beaten Defenders</span>
                      <span className="font-semibold">{playerStats.beatendefenders}</span>
                    </div>
                  )}
                  {playerStats.balltime !== undefined && (
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-sm text-gray-600">Ball Time</span>
                      <span className="font-semibold">{playerStats.balltime}</span>
                    </div>
                  )}
                  {playerStats.intercepts !== undefined && (
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-sm text-gray-600">Intercepts</span>
                      <span className="font-semibold">{playerStats.intercepts}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Defense</h3>
                <div className="space-y-2">
                  {playerStats.tackles !== undefined && (
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-sm text-gray-600">Tackles</span>
                      <span className="font-semibold">{playerStats.tackles}</span>
                    </div>
                  )}
                  {playerStats.missedtackles !== undefined && (
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-sm text-gray-600">Missed Tackles</span>
                      <span className="font-semibold">{playerStats.missedtackles}</span>
                    </div>
                  )}
                  {playerStats.turnoverswon !== undefined && (
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-sm text-gray-600">Turnovers Won</span>
                      <span className="font-semibold">{playerStats.turnoverswon}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Kicking</h3>
                <div className="space-y-2">
                  {playerStats.kicks !== undefined && (
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-sm text-gray-600">Kicks</span>
                      <span className="font-semibold">{playerStats.kicks}</span>
                    </div>
                  )}
                  {playerStats.goodkicks !== undefined && (
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-sm text-gray-600">Good Kicks</span>
                      <span className="font-semibold">{playerStats.goodkicks}</span>
                    </div>
                  )}
                  {playerStats.badkicks !== undefined && (
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-sm text-gray-600">Bad Kicks</span>
                      <span className="font-semibold">{playerStats.badkicks}</span>
                    </div>
                  )}
                  {playerStats.kicksoutonthefull !== undefined && (
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-sm text-gray-600">Kicks Out on Full</span>
                      <span className="font-semibold">{playerStats.kicksoutonthefull}</span>
                    </div>
                  )}
                  {playerStats.kickingmetres !== undefined && (
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-sm text-gray-600">Kicking Metres</span>
                      <span className="font-semibold">{playerStats.kickingmetres}</span>
                    </div>
                  )}
                  {playerStats.avkickingmetres !== undefined && (
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-sm text-gray-600">Avg Kicking Metres</span>
                      <span className="font-semibold">{playerStats.avkickingmetres}</span>
                    </div>
                  )}
                  {playerStats.upandunders !== undefined && (
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-sm text-gray-600">Up & Unders</span>
                      <span className="font-semibold">{playerStats.upandunders}</span>
                    </div>
                  )}
                  {playerStats.goodupandunders !== undefined && (
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-sm text-gray-600">Good Up & Unders</span>
                      <span className="font-semibold">{playerStats.goodupandunders}</span>
                    </div>
                  )}
                  {playerStats.badupandunders !== undefined && (
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-sm text-gray-600">Bad Up & Unders</span>
                      <span className="font-semibold">{playerStats.badupandunders}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Line-outs</h3>
                <div className="space-y-2">
                  {playerStats.lineoutssecured !== undefined && (
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-sm text-gray-600">Secured</span>
                      <span className="font-semibold">{playerStats.lineoutssecured}</span>
                    </div>
                  )}
                  {playerStats.lineoutsstolen !== undefined && (
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-sm text-gray-600">Stolen</span>
                      <span className="font-semibold">{playerStats.lineoutsstolen}</span>
                    </div>
                  )}
                  {playerStats.lineoutsconceded !== undefined && (
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-sm text-gray-600">Conceded</span>
                      <span className="font-semibold">{playerStats.lineoutsconceded}</span>
                    </div>
                  )}
                  {playerStats.successfullineoutthrows !== undefined && (
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-sm text-gray-600">Successful Throws</span>
                      <span className="font-semibold">{playerStats.successfullineoutthrows}</span>
                    </div>
                  )}
                  {playerStats.unsuccessfullineoutthrows !== undefined && (
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-sm text-gray-600">Unsuccessful Throws</span>
                      <span className="font-semibold">{playerStats.unsuccessfullineoutthrows}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Errors</h3>
                <div className="space-y-2">
                  {playerStats.handlingerrors !== undefined && (
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-sm text-gray-600">Handling Errors</span>
                      <span className="font-semibold">{playerStats.handlingerrors}</span>
                    </div>
                  )}
                  {playerStats.knockons !== undefined && (
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-sm text-gray-600">Knock-ons</span>
                      <span className="font-semibold">{playerStats.knockons}</span>
                    </div>
                  )}
                  {playerStats.forwardpasses !== undefined && (
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-sm text-gray-600">Forward Passes</span>
                      <span className="font-semibold">{playerStats.forwardpasses}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Discipline</h3>
                <div className="space-y-2">
                  {playerStats.penaltiesconceded !== undefined && (
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-sm text-gray-600">Penalties Conceded</span>
                      <span className="font-semibold">{playerStats.penaltiesconceded}</span>
                    </div>
                  )}
                  {playerStats.penaltytime !== undefined && (
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-sm text-gray-600">Penalty Time</span>
                      <span className="font-semibold">{playerStats.penaltytime}</span>
                    </div>
                  )}
                  {playerStats.redcards !== undefined && (
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-sm text-gray-600">Red Cards</span>
                      <span className="font-semibold">{playerStats.redcards}</span>
                    </div>
                  )}
                  {playerStats.fights !== undefined && (
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-sm text-gray-600">Fights</span>
                      <span className="font-semibold">{playerStats.fights}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Injuries</h3>
                <div className="space-y-2">
                  {playerStats.injuries !== undefined && (
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-sm text-gray-600">Total Injuries</span>
                      <span className="font-semibold">{playerStats.injuries}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        );

      case 'caps':
        return (
          <div className="space-y-6">
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Match Caps</h3>
              <div className="space-y-2">
                {playerStats.leaguecaps !== undefined && (
                  <div className="flex justify-between border-b pb-2">
                    <span className="text-sm text-gray-600">League</span>
                    <span className="font-semibold">{playerStats.leaguecaps}</span>
                  </div>
                )}
                {playerStats.friendlycaps !== undefined && (
                  <div className="flex justify-between border-b pb-2">
                    <span className="text-sm text-gray-600">Friendly</span>
                    <span className="font-semibold">{playerStats.friendlycaps}</span>
                  </div>
                )}
                {playerStats.cupcaps !== undefined && (
                  <div className="flex justify-between border-b pb-2">
                    <span className="text-sm text-gray-600">Cup</span>
                    <span className="font-semibold">{playerStats.cupcaps}</span>
                  </div>
                )}
                {playerStats.nationalcaps !== undefined && (
                  <div className="flex justify-between border-b pb-2">
                    <span className="text-sm text-gray-600">National</span>
                    <span className="font-semibold">{playerStats.nationalcaps}</span>
                  </div>
                )}
                {playerStats.worldcupcaps !== undefined && (
                  <div className="flex justify-between border-b pb-2">
                    <span className="text-sm text-gray-600">World Cup</span>
                    <span className="font-semibold">{playerStats.worldcupcaps}</span>
                  </div>
                )}
                {playerStats.undertwentycaps !== undefined && (
                  <div className="flex justify-between border-b pb-2">
                    <span className="text-sm text-gray-600">Under 20</span>
                    <span className="font-semibold">{playerStats.undertwentycaps}</span>
                  </div>
                )}
                {playerStats.undertwentyworldcupcaps !== undefined && (
                  <div className="flex justify-between border-b pb-2">
                    <span className="text-sm text-gray-600">U20 World Cup</span>
                    <span className="font-semibold">{playerStats.undertwentyworldcupcaps}</span>
                  </div>
                )}
                {playerStats.othercaps !== undefined && (
                  <div className="flex justify-between border-b pb-2">
                    <span className="text-sm text-gray-600">Other</span>
                    <span className="font-semibold">{playerStats.othercaps}</span>
                  </div>
                )}
              </div>
            </div>

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
                {playerHistory.map((entry) => (
                  <div key={entry.id} className="bg-white rounded-lg p-4 border border-gray-200">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-sm text-gray-500">
                        {new Date(entry.date).toLocaleDateString('en-NZ', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                    <div className="text-gray-900">
                      {parseHistoryEvent(entry.event)}
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
