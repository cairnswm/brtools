import { Link, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useTeam } from '../context/TeamContext';

const TeamMenu = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const isStandings = currentPath.includes('/standings');
  const isFixtures = currentPath.includes('/fixtures');
  const isYouth = currentPath.includes('/youth');

  const { teamId } = useTeam();

  return (
    <div className="bg-white shadow-md mb-6">
      <div className="container mx-auto px-4">
        <div className="flex space-x-6">
          <Link
            to={`/team/${teamId}`}
            className={`py-3 border-b-2 ${!isStandings && !isFixtures && !isYouth ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          >
            Players
          </Link>
          <Link
            to={`/team/${teamId}/youth`}
            className={`py-3 border-b-2 ${isYouth ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          >
            Youth
          </Link>
          <Link
            to={`/team/${teamId}/standings`}
            className={`py-3 border-b-2 ${isStandings ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          >
            Standings
          </Link>
          <Link
            to={`/team/${teamId}/fixtures`}
            className={`py-3 border-b-2 ${isFixtures ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          >
            Fixtures
          </Link>
        </div>
      </div>
    </div>
  );
};

TeamMenu.propTypes = {
  teamId: PropTypes.string.isRequired
};

export default TeamMenu;
