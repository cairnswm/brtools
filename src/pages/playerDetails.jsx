import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useTeam } from "../context/TeamContext";
import PlayersList from "../components/PlayersList";
import PlayersDetailList from "../components/PlayersDetailList";
import PlayersAverages from "../components/PlayersAverages";
import { accessElf } from "../components/accessElf";

const PlayerDetails = () => {
  const { teamId: routeTeamId } = useParams();

    const {teamId }= useTeam();
  
    useEffect(() => {
      accessElf.track("Team/Players", teamId);    
    }, [teamId]);

  const {
    setTeamId,
    players,
    loading: teamLoading,
    error: teamError,
    playersView,
  } = useTeam();

  useEffect(() => {
    if (routeTeamId) {
      setTeamId(routeTeamId);
    }
  }, [routeTeamId, setTeamId]);

  const renderContent = () => {
    if (teamLoading) {
      return (
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
        </div>
      );
    }

    if (teamError) {
      return (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6">
          {teamError}
        </div>
      );
    }

    if (players.length > 0) {
      if (playersView === "summary") {
        return <PlayersList players={players} />;
      }
      if (playersView === "details") {
        return <PlayersDetailList players={players} />;
      }
      return <PlayersAverages />;
    }

    return null;
  };

  return (
    <div className="min-h-screen bg-gray-100">

      <div>{renderContent()}</div>
    </div>
  );
};

export default PlayerDetails;
