import React, { useEffect } from "react";
import { useFixtures } from "../context/FixtureContext";
import Team from "../components/team";
import BRDate from "../components/brdate";
import { accessElf } from "../components/accessElf";
import { useTeam } from "../context/TeamContext";
import { useBRTools } from "../context/BRToolsContext";

const TeamFixtures = () => {
  const { fixtures } = useFixtures();
  const { teamId } = useTeam();
  const { getTeamById } = useBRTools();

  useEffect(() => {
    accessElf.track("Team/Fixtures", teamId);
  }, [teamId]);

  const isMatchPlayed = (fixture) => {
    return fixture.matchSummary && (fixture.matchSummary.home.points > 0 || fixture.matchSummary.guest.points > 0);
  };

  const getMatchResult = (fixture) => {
    const homePoints = Number(fixture.matchSummary.home.points);
    const guestPoints = Number(fixture.matchSummary.guest.points);
    const isHome = fixture.hometeamid === teamId;

    if (homePoints === guestPoints) return { status: 'draw', color: 'bg-gray-500' };
    if ((isHome && homePoints > guestPoints) || (!isHome && guestPoints > homePoints)) {
      return { status: 'win', color: 'bg-green-600' };
    }
    return { status: 'loss', color: 'bg-red-600' };
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'short' });
    return { day, month };
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('default', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  const upcomingFixtures = fixtures.filter(f => !isMatchPlayed(f));
  const playedFixtures = fixtures.filter(f => isMatchPlayed(f));

  return (
    <div className="space-y-8">
      {upcomingFixtures.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Upcoming Fixtures</h2>
          <div className="grid gap-4">
            {upcomingFixtures.map((fixture) => {
              const homeTeam = getTeamById(fixture.hometeamid);
              const guestTeam = getTeamById(fixture.guestteamid);
              const dateInfo = formatDate(fixture.matchstart);
              const isHome = fixture.hometeamid === teamId;

              return (
                <div
                  key={fixture.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">
                        Season {fixture.season} • Round {fixture.round}
                      </span>
                      <span className="text-sm">
                        {formatTime(fixture.matchstart)}
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 flex-1">
                        <div className="text-center w-16">
                          <div className="text-3xl font-bold text-gray-900">{dateInfo.day}</div>
                          <div className="text-sm text-gray-600 uppercase">{dateInfo.month}</div>
                        </div>

                        <div className="flex-1">
                          <div className={`text-lg font-semibold ${isHome ? 'text-blue-700' : 'text-gray-900'} flex items-center`}>
                            {homeTeam?.name || `Team ${fixture.hometeamid}`}
                            {isHome && <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">HOME</span>}
                          </div>
                          <div className="text-sm text-gray-500">{homeTeam?.country_iso || ''}</div>
                        </div>
                      </div>

                      <div className="px-6 text-center">
                        <span className="text-2xl font-bold text-gray-400">vs</span>
                      </div>

                      <div className="flex-1">
                        <div className={`text-lg font-semibold text-right ${!isHome ? 'text-blue-700' : 'text-gray-900'} flex items-center justify-end`}>
                          {!isHome && <span className="mr-2 text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">AWAY</span>}
                          {guestTeam?.name || `Team ${fixture.guestteamid}`}
                        </div>
                        <div className="text-sm text-gray-500 text-right">{guestTeam?.country_iso || ''}</div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {playedFixtures.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Results</h2>
          <div className="grid gap-4">
            {playedFixtures.map((fixture) => {
              const homeTeam = getTeamById(fixture.hometeamid);
              const guestTeam = getTeamById(fixture.guestteamid);
              const dateInfo = formatDate(fixture.matchstart);
              const result = getMatchResult(fixture);
              const isHome = fixture.hometeamid === teamId;
              const homePoints = Number(fixture.matchSummary.home.points);
              const guestPoints = Number(fixture.matchSummary.guest.points);

              return (
                <div
                  key={fixture.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className={`${result.color} text-white px-6 py-3`}>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">
                        Season {fixture.season} • Round {fixture.round}
                      </span>
                      <span className="text-sm font-bold uppercase">
                        {result.status === 'win' ? 'Victory' : result.status === 'draw' ? 'Draw' : 'Defeat'}
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 flex-1">
                        <div className="text-center w-16">
                          <div className="text-2xl font-bold text-gray-700">{dateInfo.day}</div>
                          <div className="text-xs text-gray-500 uppercase">{dateInfo.month}</div>
                        </div>

                        <div className="flex-1">
                          <div className={`text-lg font-semibold ${isHome ? 'text-blue-700' : 'text-gray-900'}`}>
                            {homeTeam?.name || `Team ${fixture.hometeamid}`}
                          </div>
                          <div className="text-sm text-gray-500">{homeTeam?.country_iso || ''}</div>
                        </div>

                        <div className="text-3xl font-bold text-gray-900">
                          {homePoints}
                        </div>
                      </div>

                      <div className="px-6 text-center">
                        <span className="text-2xl font-bold text-gray-400">-</span>
                      </div>

                      <div className="flex items-center space-x-4 flex-1 justify-end">
                        <div className="text-3xl font-bold text-gray-900">
                          {guestPoints}
                        </div>

                        <div className="flex-1 text-right">
                          <div className={`text-lg font-semibold ${!isHome ? 'text-blue-700' : 'text-gray-900'}`}>
                            {guestTeam?.name || `Team ${fixture.guestteamid}`}
                          </div>
                          <div className="text-sm text-gray-500">{guestTeam?.country_iso || ''}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {fixtures.length === 0 && (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <div className="text-gray-400 text-lg">No fixtures available</div>
        </div>
      )}
    </div>
  );
};

export default TeamFixtures;
