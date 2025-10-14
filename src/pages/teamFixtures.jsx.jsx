import React, { useEffect, useState } from "react";
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
  const [expandedFixture, setExpandedFixture] = useState(null);

  useEffect(() => {
    accessElf.track("Team/Fixtures", teamId);
  }, [teamId]);

  const toggleExpand = (fixtureId) => {
    setExpandedFixture(expandedFixture === fixtureId ? null : fixtureId);
  };

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

                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <button
                        onClick={() => toggleExpand(fixture.id)}
                        className="w-full flex items-center justify-center text-sm text-gray-600 hover:text-blue-700 transition-colors"
                      >
                        <span className="font-medium">
                          {expandedFixture === fixture.id ? 'Hide Details' : 'Show Details'}
                        </span>
                        <svg
                          className={`ml-2 w-4 h-4 transition-transform ${expandedFixture === fixture.id ? 'rotate-180' : ''}`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                    </div>

                    {expandedFixture === fixture.id && (
                      <div className="mt-4 pt-4 border-t border-gray-200 space-y-3">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="text-center">
                            <div className="text-xs text-gray-500 uppercase mb-1">Venue</div>
                            <div className="text-sm font-medium">{fixture.venue || 'TBD'}</div>
                          </div>
                          <div className="text-center">
                            <div className="text-xs text-gray-500 uppercase mb-1">Attendance</div>
                            <div className="text-sm font-medium">{fixture.attendance || 'N/A'}</div>
                          </div>
                        </div>
                      </div>
                    )}
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

                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <button
                        onClick={() => toggleExpand(fixture.id)}
                        className="w-full flex items-center justify-center text-sm text-gray-600 hover:text-blue-700 transition-colors"
                      >
                        <span className="font-medium">
                          {expandedFixture === fixture.id ? 'Hide Match Stats' : 'Show Match Stats'}
                        </span>
                        <svg
                          className={`ml-2 w-4 h-4 transition-transform ${expandedFixture === fixture.id ? 'rotate-180' : ''}`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                    </div>

                    {expandedFixture === fixture.id && fixture.matchSummary && (
                      <div className="mt-4 pt-4 border-t border-gray-200 space-y-4">
                        {fixture.matchSummary.home?.territory && fixture.matchSummary.guest?.territory && (
                          <div>
                            <div className="text-xs text-gray-500 uppercase mb-2 text-center">Territory</div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-semibold">{fixture.matchSummary.home.territory}%</span>
                              <div className="flex-1 mx-4 bg-gray-200 rounded-full h-4 overflow-hidden">
                                <div
                                  className={`h-full ${isHome ? 'bg-blue-600' : 'bg-gray-600'}`}
                                  style={{ width: `${fixture.matchSummary.home.territory}%` }}
                                />
                              </div>
                              <div className="flex-1 mx-4 bg-gray-200 rounded-full h-4 overflow-hidden">
                                <div
                                  className={`h-full ${!isHome ? 'bg-blue-600' : 'bg-gray-600'} ml-auto`}
                                  style={{ width: `${fixture.matchSummary.guest.territory}%` }}
                                />
                              </div>
                              <span className="text-sm font-semibold">{fixture.matchSummary.guest.territory}%</span>
                            </div>
                          </div>
                        )}

                        {fixture.matchSummary.home?.possession && fixture.matchSummary.guest?.possession && (
                          <div>
                            <div className="text-xs text-gray-500 uppercase mb-2 text-center">Possession</div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-semibold">{fixture.matchSummary.home.possession}%</span>
                              <div className="flex-1 mx-4 bg-gray-200 rounded-full h-4 overflow-hidden">
                                <div
                                  className={`h-full ${isHome ? 'bg-blue-600' : 'bg-gray-600'}`}
                                  style={{ width: `${fixture.matchSummary.home.possession}%` }}
                                />
                              </div>
                              <div className="flex-1 mx-4 bg-gray-200 rounded-full h-4 overflow-hidden">
                                <div
                                  className={`h-full ${!isHome ? 'bg-blue-600' : 'bg-gray-600'} ml-auto`}
                                  style={{ width: `${fixture.matchSummary.guest.possession}%` }}
                                />
                              </div>
                              <span className="text-sm font-semibold">{fixture.matchSummary.guest.possession}%</span>
                            </div>
                          </div>
                        )}

                        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-100">
                          {(typeof fixture.matchSummary.home?.tries === 'number' || typeof fixture.matchSummary.home?.tries === 'string') && (
                            <div className="text-center">
                              <div className="text-xs text-gray-500 uppercase mb-1">Tries</div>
                              <div className="flex justify-between text-sm font-semibold">
                                <span className={isHome ? 'text-blue-700' : ''}>{String(fixture.matchSummary.home.tries)}</span>
                                <span className="text-gray-400">-</span>
                                <span className={!isHome ? 'text-blue-700' : ''}>{String(fixture.matchSummary.guest.tries)}</span>
                              </div>
                            </div>
                          )}
                          {(typeof fixture.matchSummary.home?.conversions === 'number' || typeof fixture.matchSummary.home?.conversions === 'string') && (
                            <div className="text-center">
                              <div className="text-xs text-gray-500 uppercase mb-1">Conversions</div>
                              <div className="flex justify-between text-sm font-semibold">
                                <span className={isHome ? 'text-blue-700' : ''}>{String(fixture.matchSummary.home.conversions)}</span>
                                <span className="text-gray-400">-</span>
                                <span className={!isHome ? 'text-blue-700' : ''}>{String(fixture.matchSummary.guest.conversions)}</span>
                              </div>
                            </div>
                          )}
                          {(typeof fixture.matchSummary.home?.penalties === 'number' || typeof fixture.matchSummary.home?.penalties === 'string') && (
                            <div className="text-center">
                              <div className="text-xs text-gray-500 uppercase mb-1">Penalties</div>
                              <div className="flex justify-between text-sm font-semibold">
                                <span className={isHome ? 'text-blue-700' : ''}>{String(fixture.matchSummary.home.penalties)}</span>
                                <span className="text-gray-400">-</span>
                                <span className={!isHome ? 'text-blue-700' : ''}>{String(fixture.matchSummary.guest.penalties)}</span>
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="grid grid-cols-3 gap-4 pt-2">
                          {(typeof fixture.matchSummary.home?.dropgoals === 'number' || typeof fixture.matchSummary.home?.dropgoals === 'string') && (
                            <div className="text-center">
                              <div className="text-xs text-gray-500 uppercase mb-1">Drop Goals</div>
                              <div className="flex justify-between text-sm font-semibold">
                                <span className={isHome ? 'text-blue-700' : ''}>{String(fixture.matchSummary.home.dropgoals)}</span>
                                <span className="text-gray-400">-</span>
                                <span className={!isHome ? 'text-blue-700' : ''}>{String(fixture.matchSummary.guest.dropgoals)}</span>
                              </div>
                            </div>
                          )}
                          {(typeof fixture.matchSummary.home?.yellowcards === 'number' || typeof fixture.matchSummary.home?.yellowcards === 'string') && (
                            <div className="text-center">
                              <div className="text-xs text-gray-500 uppercase mb-1">Yellow Cards</div>
                              <div className="flex justify-between text-sm font-semibold">
                                <span className={isHome ? 'text-blue-700' : ''}>{String(fixture.matchSummary.home.yellowcards)}</span>
                                <span className="text-gray-400">-</span>
                                <span className={!isHome ? 'text-blue-700' : ''}>{String(fixture.matchSummary.guest.yellowcards)}</span>
                              </div>
                            </div>
                          )}
                          {(typeof fixture.matchSummary.home?.redcards === 'number' || typeof fixture.matchSummary.home?.redcards === 'string') && (
                            <div className="text-center">
                              <div className="text-xs text-gray-500 uppercase mb-1">Red Cards</div>
                              <div className="flex justify-between text-sm font-semibold">
                                <span className={isHome ? 'text-blue-700' : ''}>{String(fixture.matchSummary.home.redcards)}</span>
                                <span className="text-gray-400">-</span>
                                <span className={!isHome ? 'text-blue-700' : ''}>{String(fixture.matchSummary.guest.redcards)}</span>
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                          <div className="text-center">
                            <div className="text-xs text-gray-500 uppercase mb-1">Venue</div>
                            <div className="text-sm font-medium">{fixture.venue || 'N/A'}</div>
                          </div>
                          <div className="text-center">
                            <div className="text-xs text-gray-500 uppercase mb-1">Attendance</div>
                            <div className="text-sm font-medium">{fixture.attendance || 'N/A'}</div>
                          </div>
                        </div>
                      </div>
                    )}
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
