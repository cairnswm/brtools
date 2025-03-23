import { useEffect } from "react";
import { useParams, Route, Routes } from "react-router-dom";
import { useTeam } from "../context/TeamContext";
import Header from "../components/Header";
import TeamMenu from "../components/TeamMenu";
import PlayerPage from "./PlayerPage";
import PlayerDetails from "./playerDetails";
import TeamStandingsPage from "./TeamStandingsPage";
import TeamFixturesPage from "./teamfixturesPage";
import YouthPage from "./YouthPage";

const TeamDetails = () => {
  const { teamId: routeTeamId } = useParams();
  const {
    setTeamId,
  } = useTeam();

  useEffect(() => {
    if (routeTeamId) {
      setTeamId(routeTeamId);
    }
  }, [routeTeamId, setTeamId]);


  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <TeamMenu teamId={routeTeamId} />

      <div className="container mx-auto px-4 py-8">
        <Routes>
          <Route path="fixtures" element={<TeamFixturesPage />} />
          <Route path="standings" element={<TeamStandingsPage />} />
          <Route path="youth" element={<YouthPage />} />
          <Route path="player/:playerId" element={<PlayerDetails />} />
          <Route path="/" element={<PlayerPage />} />
        </Routes>
      </div>
    </div>
  );
};

export default TeamDetails;
