import { useBRTools } from '../context/BRToolsContext';
import { Link } from 'react-router-dom';
import StadiumIcon from './StadiumIcon';
import { formatCSR } from '../utils/formatters';

function TeamsList() {
  const { teams } = useBRTools();

  if (!teams.length) return null;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <table className="min-w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Team Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Country</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Average CSR</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {teams.map((team) => {
            const csrFormatted = formatCSR(team.average_top15_csr);
            return (
              <tr key={team.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  <Link to={`/team/${team.id}`} className="text-gray-900 hover:text-blue-600">
                    {team.name}
                  </Link>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{team.country_iso}</td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm text-right ${csrFormatted.color}`}>
                  {csrFormatted.value}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                  <Link
                    to={`/stadium-calculator?team=${team.id}`}
                    className="inline-flex items-center p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Stadium Calculator"
                  >
                    <StadiumIcon width={20} height={20} />
                  </Link>
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