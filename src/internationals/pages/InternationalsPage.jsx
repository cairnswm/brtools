import Header from '../../components/Header';
import { accessElf } from '../../components/accessElf';
import { useInternationalsHook } from '../hooks/useInternationalsHook';
import { useBRTools } from '../../hooks/useBRTools';
import { useNavigate } from 'react-router-dom';

function InternationalsPage() {
  accessElf.track("Internationals");

  const navigate = useNavigate();
  const { memberData } = useBRTools();
  const {
    nationalTeams,
    u20Teams,
    activeTab,
    setActiveTab,
    loading,
    error,
    sortField,
    sortDirection,
    handleSort
  } = useInternationalsHook();

  const handleTeamClick = (teamId) => {
    navigate(`/team/${teamId}`);
  };

  const getSortIcon = (field) => {
    if (sortField !== field) return '⇅';
    return sortDirection === 'asc' ? '↑' : '↓';
  };

  const isOwnedByUser = (team) => {
    return memberData && team.owner && team.owner === memberData.id;
  };

  const currentTeams = activeTab === 'national' ? nationalTeams : u20Teams;

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
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('national')}
                className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'national'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                National
              </button>
              <button
                onClick={() => setActiveTab('u20')}
                className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'u20'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Under 20
              </button>
            </nav>
          </div>

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
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentTeams.map((team) => (
                  <tr
                    key={team.id}
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleTeamClick(team.id)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`text-sm font-medium ${isOwnedByUser(team) ? 'text-green-600' : 'text-gray-900'}`}>
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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {currentTeams.length === 0 && (
          <div className="text-center mt-8">
            <p className="text-gray-600">No {activeTab === 'national' ? 'national' : 'under 20'} teams found.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default InternationalsPage;
