import Header from '../../components/Header';
import { accessElf } from '../../components/accessElf';
import { useInternationalsHook } from '../hooks/useInternationalsHook';
import { useBRTools } from '../../hooks/useBRTools';
import { useNavigate } from 'react-router-dom';

function InternationalsPage() {
  accessElf.track("Internationals");

  const navigate = useNavigate();
  const {
    internationals,
    loading,
    error,
    sortField,
    sortDirection,
    handleSort
  } = useInternationalsHook();

  const { cachedTeams } = useBRTools();

  const handleTeamClick = (teamId) => {
    navigate(`/team/${teamId}`);
  };

  const getSortIcon = (field) => {
    if (sortField !== field) return '⇅';
    return sortDirection === 'asc' ? '↑' : '↓';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <p className="text-gray-600">Loading internationals...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">International Teams</h1>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('name')}
                  >
                    <div className="flex items-center gap-2">
                      Team {getSortIcon('name')}
                    </div>
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('average_top15_csr')}
                  >
                    <div className="flex items-center gap-2">
                      Average Top 15 CSR {getSortIcon('average_top15_csr')}
                    </div>
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('ranking_points')}
                  >
                    <div className="flex items-center gap-2">
                      Ranking Points {getSortIcon('ranking_points')}
                    </div>
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('world_rank')}
                  >
                    <div className="flex items-center gap-2">
                      World Rank {getSortIcon('world_rank')}
                    </div>
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('national_rank')}
                  >
                    <div className="flex items-center gap-2">
                      National Rank {getSortIcon('national_rank')}
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {internationals.map((team) => (
                  <tr
                    key={team.id}
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleTeamClick(team.id)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {team.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {team.average_top15_csr ? Number(team.average_top15_csr).toLocaleString() : '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {team.ranking_points ? Number(team.ranking_points).toFixed(2) : '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {team.world_rank || '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {team.national_rank || '-'}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {internationals.length === 0 && (
          <div className="text-center mt-8">
            <p className="text-gray-600">No international teams found.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default InternationalsPage;
