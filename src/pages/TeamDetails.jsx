import { useEffect } from "react";
import { useParams, Route, Routes } from "react-router-dom";
import { useTeam } from '../hooks/useTeam';
import Header from "../components/Header";
import TeamMenu from "../components/TeamMenu";
import PlayerPage from "./PlayerPage";
import PlayerDetails from "./playerDetails";
import TeamStandingsPage from "./TeamStandingsPage";
import TeamFixturesPage from "./TeamFixturesPage";
import YouthPage from "./YouthPage";
import TrainingPage from "./TrainingPage";
import OfficePage from "./OfficePage";
import { accessElf } from "../components/accessElf";

const TeamDetails = () => {
  const { teamId: routeTeamId } = useParams();
  const {
    teamId,
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
          <Route path="office" element={<OfficePage />} />
          <Route path="fixtures" element={<TeamFixturesPage />} />
          <Route path="standings" element={<TeamStandingsPage />} />
          <Route path="youth" element={<YouthPage />} />
          <Route path="training" element={<TrainingPage />} />
          <Route path="player/:playerId" element={<PlayerDetails />} />
          <Route path="/" element={<PlayerPage />} />
        </Routes>
      </div>
    </div>
  );
};

export default TeamDetails;
