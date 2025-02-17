import { Link, useLocation } from 'react-router-dom';

function TeamMenu({ teamId }) {
  const location = useLocation();
  const isStandings = location.pathname.includes('/standings');

  return (
    <div className="bg-white shadow-md mb-6">
      <div className="container mx-auto px-4">
        <div className="flex space-x-6">
          <Link
            to={`/team/${teamId}`}
            className={`py-3 border-b-2 ${!isStandings ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          >
            Players
          </Link>
          <Link
            to={`/team/${teamId}/standings`}
            className={`py-3 border-b-2 ${isStandings ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          >
            Standings
          </Link>
        </div>
      </div>
    </div>
  );
}

export default TeamMenu;