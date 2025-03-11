import { useEffect } from "react";
import { useParams, Link, Route, Routes } from "react-router-dom";
import { useTeam } from "../context/TeamContext";
import Header from "../components/Header";
import TeamMenu from "../components/TeamMenu";
import PlayersList from "../components/PlayersList";
import PlayersDetailList from "../components/PlayersDetailList";
import PlayersAverages from "../components/PlayersAverages";
import PlayerDetails from "./playerDetails";
import TeamStandingsPage from "./TeamStandingsPage";
import TeamFixturesPage from "./teamfixturesPage";

const TeamDetails = () => {
  const { teamId: routeTeamId } = useParams();
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
      <Header />
      <TeamMenu teamId={routeTeamId} />

      <div className="container mx-auto px-4 py-8">
        <Routes>
          <Route path="fixtures" element={<TeamFixturesPage />} />
          <Route path="standings" element={<TeamStandingsPage />} />
          <Route path="player/:playerId" element={<PlayerDetails />} />
          <Route path="/" element={renderContent()} />
        </Routes>
      </div>
    </div>
  );
};

export default TeamDetails;
