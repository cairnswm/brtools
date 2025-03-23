import React from "react";
import { useTeam } from "../context/TeamContext";
import PlayersList from "../components/PlayersList";
import PlayersDetailList from "../components/PlayersDetailList";
import PlayersAverages from "../components/PlayersAverages";
import Header from "../components/Header";
import TeamMenu from "../components/TeamMenu";
import PlayerHeader from "../components/PlayerHeader";

const PlayerPage = () => {
  const {
    players,
    loading: teamLoading,
    error: teamError,
    playersView,
  } = useTeam();

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

  if (players.length === 0) {
    return (
      <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative mb-6">
        No players found.
      </div>
    );
  }

  return (
    <>
      <PlayerHeader />
      {playersView === "summary" && <PlayersList players={players} />}
      {playersView === "details" && <PlayersDetailList players={players} />}
      {playersView === "averages" && <PlayersAverages />}
    </>
  );
};

export default PlayerPage;
