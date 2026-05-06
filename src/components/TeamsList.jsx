import { useBRTools } from '../hooks/useBRTools';
import { Link } from 'react-router-dom';
import StadiumIcon from './StadiumIcon';
import { formatCSR } from '../utils/formatters';
import { useState, useMemo } from 'react';

function TeamsList() {
  const { teams } = useBRTools();
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  const sortedTeams = useMemo(() => {
    if (!sortConfig.key) return teams;

    const sorted = [...teams].sort((a, b) => {
      let aValue, bValue;

      if (sortConfig.key === 'name') {
        aValue = a.name.toLowerCase();
        bValue = b.name.toLowerCase();
      } else if (sortConfig.key === 'country') {
        aValue = a.country_iso.toLowerCase();
        bValue = b.country_iso.toLowerCase();
      } else if (sortConfig.key === 'csr') {
        aValue = a.average_top15_csr || 0;
        bValue = b.average_top15_csr || 0;
      } else if (sortConfig.key === 'ranking') {
        aValue = Number(a.world_rank) || 0;
        bValue = Number(b.world_rank) || 0;
      }

      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });

    return sorted;
  }, [teams, sortConfig]);

  const handleSort = (key) => {
    setSortConfig((current) => {
      if (current.key === key) {
        return {
          key,
          direction: current.direction === 'asc' ? 'desc' : 'asc',
        };
      }
      return { key, direction: 'asc' };
    });
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) {
      return <span className="ml-1 text-gray-400">⇅</span>;
    }
    return sortConfig.direction === 'asc' ?
      <span className="ml-1">▲</span> :
      <span className="ml-1">▼</span>;
  };

  if (!teams.length) return null;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <table className="min-w-full">
        <thead className="bg-gray-50">
          <tr>
            <th
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              onClick={() => handleSort('name')}
            >
              Team Name {getSortIcon('name')}
            </th>
            <th
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              onClick={() => handleSort('country')}
            >
              Country {getSortIcon('country')}
            </th>
            <th
              className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              onClick={() => handleSort('ranking')}
            >
              Ranking {getSortIcon('ranking')}
            </th>
            <th
              className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              onClick={() => handleSort('csr')}
            >
              Average CSR {getSortIcon('csr')}
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {sortedTeams.map((team) => {
            const csrFormatted = formatCSR(team.average_top15_csr);
            return (
              <tr key={team.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  <Link to={`/team/${team.id}`} className="text-gray-900 hover:text-blue-600">
                    {team.name}
                  </Link>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{team.country_iso}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">{team.world_rank || '-'}</td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm text-right ${csrFormatted.color}`}>
                  {csrFormatted.value}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Link
                      to={`/team/${team.id}/players`}
                      className="inline-flex items-center p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                      title="Players"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
                      </svg>
                    </Link>
                    <Link
                      to={`/stadium-calculator?team=${team.id}`}
                      className="inline-flex items-center p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                      title="Stadium Calculator"
                    >
                      <StadiumIcon width={20} height={20} />
                    </Link>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default TeamsList;