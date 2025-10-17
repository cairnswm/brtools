import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useTeam } from '../hooks/useTeam';
import { accessElf } from "../components/accessElf";
import { formatCSR } from "../utils/formatters";

const PlayerDetailPage = () => {
  const { playerId, teamId } = useParams();
  const { players } = useTeam();
  const [activeTab, setActiveTab] = useState('information');

  const player = players.find(p => p.id === playerId);

  useEffect(() => {
    if (playerId && teamId) {
      accessElf.track("Team/Player/Detail", teamId);
    }
  }, [playerId, teamId]);

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
        return (
          <div className="bg-gray-50 rounded-lg p-8 text-center">
            <p className="text-gray-600">Statistics coming soon...</p>
          </div>
        );

      case 'caps':
        return (
          <div className="bg-gray-50 rounded-lg p-8 text-center">
            <p className="text-gray-600">Caps information coming soon...</p>
          </div>
        );

      case 'history':
        return (
          <div className="bg-gray-50 rounded-lg p-8 text-center">
            <p className="text-gray-600">Player history coming soon...</p>
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
