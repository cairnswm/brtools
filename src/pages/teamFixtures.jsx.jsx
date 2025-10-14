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

  const getStatCount = (stat) => {
    if (!stat || Array.isArray(stat) && stat.length === 0) return 0;
    if (stat.player) {
      if (Array.isArray(stat.player)) {
        return stat.player.reduce((sum, p) => sum + Number(p.number || 0), 0);
      }
      return Number(stat.player.number || 0);
    }
    return 0;
  };

  const getAttendance = (fixture) => {
    if (!fixture.matchSummary?.attendance) return 'N/A';
    const att = fixture.matchSummary.attendance;
    const total = Number(att.standing || 0) + Number(att.uncovered || 0) +
                  Number(att.covered || 0) + Number(att.members || 0) +
                  Number(att.corporate || 0);
    return total.toLocaleString();
  };

  const getTeamStats = (fixture, isHome) => {
    const summary = isHome ? fixture.reporterSummary?.home : fixture.reporterSummary?.guest;
    if (!summary) return null;

    return {
      territory: summary.territory ? Math.round(Number(summary.territory) / 2) : null,
      possession: summary.possession ? Math.round(Number(summary.possession) / 2) : null,
      scrum: summary.scrum ? Math.round(Number(summary.scrum) / 2) : null,
      lineout: summary.lineout ? Math.round(Number(summary.lineout) / 2) : null,
      ruck: summary.ruck ? Math.round(Number(summary.ruck) / 2) : null,
      maul: summary.maul ? Math.round(Number(summary.maul) / 2) : null,
      attack: summary.attack ? Math.round(Number(summary.attack) / 2) : null,
      defense: summary.defense ? Math.round(Number(summary.defense) / 2) : null,
      kicking: summary.kicking ? Math.round(Number(summary.kicking) / 2) : null,
      handling: summary.handling ? Math.round(Number(summary.handling) / 2) : null,
      stamina: summary.stamina ? Math.round(Number(summary.stamina) / 2) : null,
      pickandgo: summary.pickandgo ? Math.round(Number(summary.pickandgo) / 2) : null,
      driving: summary.driving ? Math.round(Number(summary.driving) / 2) : null,
      expansive: summary.expansive ? Math.round(Number(summary.expansive) / 2) : null,
      creative: summary.creative ? Math.round(Number(summary.creative) / 2) : null
    };
  };

  const renderStars = (count) => {
    if (!count) return null;
    return (
      <div className="flex justify-center gap-0.5">
        {[...Array(Math.min(count, 10))].map((_, i) => (
          <svg key={i} className="w-3 h-3 fill-yellow-400" viewBox="0 0 20 20">
            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
          </svg>
        ))}
      </div>
    );
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

                    {expandedFixture === fixture.id && fixture.matchSummary && (() => {
                      const homeStats = getTeamStats(fixture, true);
                      const guestStats = getTeamStats(fixture, false);
                      const homeTries = getStatCount(fixture.matchSummary.home.tries);
                      const guestTries = getStatCount(fixture.matchSummary.guest.tries);
                      const homeConversions = getStatCount(fixture.matchSummary.home.conversions);
                      const guestConversions = getStatCount(fixture.matchSummary.guest.conversions);
                      const homePenalties = getStatCount(fixture.matchSummary.home.penalties);
                      const guestPenalties = getStatCount(fixture.matchSummary.guest.penalties);
                      const homeDropgoals = getStatCount(fixture.matchSummary.home.dropgoals);
                      const guestDropgoals = getStatCount(fixture.matchSummary.guest.dropgoals);

                      return (
                        <div className="mt-4 pt-4 border-t border-gray-200 space-y-4">
                          {homeStats?.territory && guestStats?.territory && (
                            <div>
                              <div className="text-xs text-gray-500 uppercase mb-2 text-center">Territory</div>
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-semibold">{homeStats.territory}%</span>
                                <div className="flex-1 mx-4 bg-gray-200 rounded-full h-4 overflow-hidden">
                                  <div
                                    className={`h-full ${isHome ? 'bg-blue-600' : 'bg-gray-600'}`}
                                    style={{ width: `${homeStats.territory}%` }}
                                  />
                                </div>
                                <div className="flex-1 mx-4 bg-gray-200 rounded-full h-4 overflow-hidden">
                                  <div
                                    className={`h-full ${!isHome ? 'bg-blue-600' : 'bg-gray-600'} ml-auto`}
                                    style={{ width: `${guestStats.territory}%` }}
                                  />
                                </div>
                                <span className="text-sm font-semibold">{guestStats.territory}%</span>
                              </div>
                            </div>
                          )}

                          {homeStats?.possession && guestStats?.possession && (
                            <div>
                              <div className="text-xs text-gray-500 uppercase mb-2 text-center">Possession</div>
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-semibold">{homeStats.possession}%</span>
                                <div className="flex-1 mx-4 bg-gray-200 rounded-full h-4 overflow-hidden">
                                  <div
                                    className={`h-full ${isHome ? 'bg-blue-600' : 'bg-gray-600'}`}
                                    style={{ width: `${homeStats.possession}%` }}
                                  />
                                </div>
                                <div className="flex-1 mx-4 bg-gray-200 rounded-full h-4 overflow-hidden">
                                  <div
                                    className={`h-full ${!isHome ? 'bg-blue-600' : 'bg-gray-600'} ml-auto`}
                                    style={{ width: `${guestStats.possession}%` }}
                                  />
                                </div>
                                <span className="text-sm font-semibold">{guestStats.possession}%</span>
                              </div>
                            </div>
                          )}

                          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-100">
                            <div className="text-center">
                              <div className="text-xs text-gray-500 uppercase mb-1">Tries</div>
                              <div className="flex justify-between text-sm font-semibold">
                                <span className={isHome ? 'text-blue-700' : ''}>{homeTries}</span>
                                <span className="text-gray-400">-</span>
                                <span className={!isHome ? 'text-blue-700' : ''}>{guestTries}</span>
                              </div>
                            </div>
                            <div className="text-center">
                              <div className="text-xs text-gray-500 uppercase mb-1">Conversions</div>
                              <div className="flex justify-between text-sm font-semibold">
                                <span className={isHome ? 'text-blue-700' : ''}>{homeConversions}</span>
                                <span className="text-gray-400">-</span>
                                <span className={!isHome ? 'text-blue-700' : ''}>{guestConversions}</span>
                              </div>
                            </div>
                            <div className="text-center">
                              <div className="text-xs text-gray-500 uppercase mb-1">Penalties</div>
                              <div className="flex justify-between text-sm font-semibold">
                                <span className={isHome ? 'text-blue-700' : ''}>{homePenalties}</span>
                                <span className="text-gray-400">-</span>
                                <span className={!isHome ? 'text-blue-700' : ''}>{guestPenalties}</span>
                              </div>
                            </div>
                          </div>

                          {(homeDropgoals > 0 || guestDropgoals > 0) && (
                            <div className="grid grid-cols-3 gap-4">
                              <div className="text-center">
                                <div className="text-xs text-gray-500 uppercase mb-1">Drop Goals</div>
                                <div className="flex justify-between text-sm font-semibold">
                                  <span className={isHome ? 'text-blue-700' : ''}>{homeDropgoals}</span>
                                  <span className="text-gray-400">-</span>
                                  <span className={!isHome ? 'text-blue-700' : ''}>{guestDropgoals}</span>
                                </div>
                              </div>
                            </div>
                          )}

                          {homeStats && guestStats && (
                            <div className="pt-4 border-t border-gray-100">
                              <div className="text-xs text-gray-500 uppercase mb-3 text-center font-semibold">Team Stars</div>
                              <div className="grid grid-cols-3 gap-3">
                                {['scrum', 'lineout', 'ruck', 'maul', 'attack', 'defense', 'kicking', 'handling', 'stamina'].map(stat => (
                                  homeStats[stat] && guestStats[stat] && (
                                    <div key={stat} className="text-center">
                                      <div className="text-xs text-gray-500 uppercase mb-1">{stat}</div>
                                      <div className="flex justify-between items-center gap-2">
                                        <div className={isHome ? 'opacity-100' : 'opacity-50'}>
                                          {renderStars(homeStats[stat])}
                                        </div>
                                        <span className="text-gray-400 text-xs">vs</span>
                                        <div className={!isHome ? 'opacity-100' : 'opacity-50'}>
                                          {renderStars(guestStats[stat])}
                                        </div>
                                      </div>
                                    </div>
                                  )
                                ))}
                              </div>
                            </div>
                          )}

                          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                            <div className="text-center">
                              <div className="text-xs text-gray-500 uppercase mb-1">Venue</div>
                              <div className="text-sm font-medium">{fixture.venue || homeTeam?.name + ' Stadium' || 'N/A'}</div>
                            </div>
                            <div className="text-center">
                              <div className="text-xs text-gray-500 uppercase mb-1">Attendance</div>
                              <div className="text-sm font-medium">{getAttendance(fixture)}</div>
                            </div>
                          </div>
                        </div>
                      );
                    })()}
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
