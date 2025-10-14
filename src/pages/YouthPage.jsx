import React, { useEffect } from "react";
import { useTeam } from '../hooks/useTeam';
import YouthList from "../components/YouthList";
import PlayersDetailList from "../components/PlayersDetailList";
import YouthHeader from "../components/YouthHeader";
import { accessElf } from "../components/accessElf";

const YouthPage = () => {
  const { teamId, youth, loading, error, playersView } = useTeam();

    useEffect(() => {
      accessElf.track("Team/Youth", teamId);    
    }, [teamId]);

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

  if (youth.length === 0) {
    return (
      <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative mb-6">
        No youth players found.
      </div>
    );
  }

  return (
    <div>
      <YouthHeader />
      {playersView === "details" && <PlayersDetailList players={youth} />}
      {playersView === "summary" && <YouthList youth={youth} />}
    </div>
  );
};

export default YouthPage;
