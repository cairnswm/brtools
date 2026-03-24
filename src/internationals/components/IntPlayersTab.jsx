import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInternationalsHook } from '../hooks/useInternationalsHook';

function IntPlayersTab() {
  const navigate = useNavigate();
  const { internationalPlayers } = useInternationalsHook();
  const [sortField, setSortField] = useState('csr');
  const [sortDirection, setSortDirection] = useState('desc');

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const getSortIcon = (field) => {
    if (sortField !== field) return '⇅';
    return sortDirection === 'asc' ? '↑' : '↓';
  };

  const sortedPlayers = [...internationalPlayers].sort((a, b) => {
    let aValue = a[sortField];
    let bValue = b[sortField];

    if (['csr', 'age', 'form', 'experience', 'energy'].includes(sortField)) {
      aValue = Number(aValue) || 0;
      bValue = Number(bValue) || 0;
    }

    if (sortField === 'name') {
      aValue = (aValue || '').toLowerCase();
      bValue = (bValue || '').toLowerCase();
    }

    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const { activeInternational, activeInternationalType } = useInternationalsHook();

  const handlePlayerClick = (playerId) => {
    navigate(`/internationals/${activeInternationalType}/${activeInternational.id}/player/${playerId}`);
  };

  if (!internationalPlayers || internationalPlayers.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Players</h2>
        <p className="text-gray-600">No players found for this team.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                onClick={() => handleSort('name')}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              >
                <div className="flex items-center justify-between">
                  Name
                  <span className="ml-2">{getSortIcon('name')}</span>
                </div>
              </th>
              <th
                onClick={() => handleSort('csr')}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              >
                <div className="flex items-center justify-between">
                  CSR
                  <span className="ml-2">{getSortIcon('csr')}</span>
                </div>
              </th>
              <th
                onClick={() => handleSort('age')}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              >
                <div className="flex items-center justify-between">
                  Age
                  <span className="ml-2">{getSortIcon('age')}</span>
                </div>
              </th>
              <th
                onClick={() => handleSort('form')}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              >
                <div className="flex items-center justify-between">
                  Form
                  <span className="ml-2">{getSortIcon('form')}</span>
                </div>
              </th>
              <th
                onClick={() => handleSort('energy')}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              >
                <div className="flex items-center justify-between">
                  Energy
                  <span className="ml-2">{getSortIcon('energy')}</span>
                </div>
              </th>
              <th
                onClick={() => handleSort('experience')}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              >
                <div className="flex items-center justify-between">
                  Experience
                  <span className="ml-2">{getSortIcon('experience')}</span>
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nationality
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedPlayers.map((player) => (
              <tr
                key={player.id}
                onClick={() => handlePlayerClick(player.id)}
                className="hover:bg-gray-50 cursor-pointer"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {player.name}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {player.csr ? Number(player.csr).toLocaleString() : '-'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{player.age}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{player.form}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{player.energy}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{player.experience}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{player.nationality}</div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default IntPlayersTab;
