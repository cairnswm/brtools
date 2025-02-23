import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTeam } from '../context/TeamContext';
import Header from '../components/Header';
import TeamMenu from '../components/TeamMenu';
import PlayersList from '../components/PlayersList';
import PlayersDetailList from '../components/PlayersDetailList';
import PlayersAverages from '../components/PlayersAverages';
import TeamStandings from './TeamStandings';

function TeamDetails() {
  const { teamId: routeTeamId } = useParams();
  const { setTeamId, players, loading, error, playersView } = useTeam();

  useEffect(() => {
    setTeamId(routeTeamId);
  }, [routeTeamId, setTeamId]);

  const renderContent = () => {
    if (loading) {
      return (
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6">
          {error}
        </div>
      );
    }

    if (players.length > 0) {
      if (window.location.pathname.includes('/standings')) {
        return <TeamStandings />;
      }
      if (playersView === 'summary') {
        return <PlayersList players={players} />;
      }
      if (playersView === 'details') {
        return <PlayersDetailList players={players} />;
      }
      return <PlayersAverages />;
    }

    return null;
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <TeamMenu teamId={routeTeamId} />

      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Team Details</h1>
          <Link
            to="/home"
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back
          </Link>
        </div>

        {renderContent()}
      </div>
    </div>
  );
}

export default TeamDetails;
