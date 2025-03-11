import { useTeam } from '../context/TeamContext';
import { useBRTools } from '../context/BRToolsContext';
import { formatCSR, formatRanking } from '../utils/formatters';

function TeamStandings() {
  const { 
    standings, 
    loading, 
    error, 
    exportStandingsToExcel,
    standingsView,
    setStandingsView,
    standingsSortField,
    standingsSortDirection,
    handleStandingsSort
  } = useTeam();
  const { cachedTeams } = useBRTools();

  const SortIcon = ({ field }) => {
    if (standingsSortField !== field) return null;
    return (
      <span className="ml-1">
        {standingsSortDirection === 'asc' ? '↑' : '↓'}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="text-center py-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
        {error}
      </div>
    );
  }

  return (
    <div>
      <div className="bg-white rounded-lg shadow-md p-4 mb-4 flex justify-between items-center">
        <div className="flex space-x-4">
          <button
            onClick={() => setStandingsView('standings')}
            className={`px-4 py-2 rounded-md ${
              standingsView === 'standings'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Standings
          </button>
          <button
            onClick={() => setStandingsView('rankings')}
            className={`px-4 py-2 rounded-md ${
              standingsView === 'rankings'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Rankings
          </button>
        </div>
        <button
          onClick={exportStandingsToExcel}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
        >
          Export to Excel
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleStandingsSort('team')}
              >
                Team
                <SortIcon field="team" />
              </th>
              {standingsView === 'standings' ? (
                <>
                  <th 
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleStandingsSort('played')}
                  >
                    P
                    <SortIcon field="played" />
                  </th>
                  <th 
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleStandingsSort('w')}
                  >
                    W
                    <SortIcon field="w" />
                  </th>
                  <th 
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleStandingsSort('d')}
                  >
                    D
                    <SortIcon field="d" />
                  </th>
                  <th 
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleStandingsSort('l')}
                  >
                    L
                    <SortIcon field="l" />
                  </th>
                  <th 
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleStandingsSort('for')}
                  >
                    PF
                    <SortIcon field="for" />
                  </th>
                  <th 
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleStandingsSort('against')}
                  >
                    PA
                    <SortIcon field="against" />
                  </th>
                  <th 
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleStandingsSort('b1')}
                  >
                    BL
                    <SortIcon field="b1" />
                  </th>
                  <th 
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleStandingsSort('b2')}
                  >
                    BT
                    <SortIcon field="b2" />
                  </th>
                  <th 
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleStandingsSort('points')}
                  >
                    Pts
                    <SortIcon field="points" />
                  </th>
                </>
              ) : (
                <>
                  <th 
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleStandingsSort('average_csr')}
                  >
                    Avg CSR
                    <SortIcon field="average_csr" />
                  </th>
                  <th 
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleStandingsSort('ranking_points')}
                  >
                    Ranking Points
                    <SortIcon field="ranking_points" />
                  </th>
                  <th 
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleStandingsSort('national_rank')}
                  >
                    National Rank
                    <SortIcon field="national_rank" />
                  </th>
                  <th 
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleStandingsSort('world_rank')}
                  >
                    World Rank
                    <SortIcon field="world_rank" />
                  </th>
                </>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {standings.map((standing) => {
              const team = cachedTeams[standing.teamid];
              const csrFormatted = team ? formatCSR(team.average_top15_csr) : { value: 'N/A', color: 'text-gray-900' };
              const rankingFormatted = team ? formatRanking(team.ranking_points) : { value: 'N/A', color: 'text-gray-900' };
              return (
                <tr key={standing.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {team ? team.name : `Team ${standing.teamid}`}
                  </td>
                  {standingsView === 'standings' ? (
                    <>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">{standing.played}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">{standing.w}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">{standing.d}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">{standing.l}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">{standing.for}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">{standing.against}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">{standing.b1}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">{standing.b2}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">{standing.points}</td>
                    </>
                  ) : (
                    <>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm text-right ${csrFormatted.color}`}>
                        {csrFormatted.value}
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm text-right ${rankingFormatted.color}`}>
                        {rankingFormatted.value}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                        {team?.national_rank || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                        {team?.world_rank || 'N/A'}
                      </td>
                    </>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TeamStandings;