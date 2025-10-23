import React, { useEffect, useState } from "react";
import { useFixtures } from "../hooks/useFixtures";
import Team from "../components/team";
import BRDate from "../components/brdate";
import { accessElf } from "../components/accessElf";
import { useTeam } from "../hooks/useTeam";
import { useBRTools } from "../hooks/useBRTools";
import * as XLSX from 'xlsx';
import { API_BASE_URL } from "../config/api";

const TeamFixtures = () => {
  const { fixtures, loading, error } = useFixtures();
  const { teamId } = useTeam();
  const { getTeamById, memberKey } = useBRTools();
  const [expandedFixture, setExpandedFixture] = useState(null);
  const [expandedTab, setExpandedTab] = useState({});
  const [fixtureStats, setFixtureStats] = useState({});
  const [loadingStats, setLoadingStats] = useState({});

  useEffect(() => {
    accessElf.track("Team/Fixtures", teamId);
  }, [teamId]);

  const toggleExpand = (fixtureId) => {
    setExpandedFixture(expandedFixture === fixtureId ? null : fixtureId);
    if (expandedFixture !== fixtureId) {
      setExpandedTab(prev => ({ ...prev, [fixtureId]: 'matchstats' }));
    }
  };

  const fetchFixtureStatistics = async (fixtureId) => {
    if (fixtureStats[fixtureId] || loadingStats[fixtureId]) return;

    setLoadingStats(prev => ({ ...prev, [fixtureId]: true }));

    try {
      const response = await fetch(`${API_BASE_URL}/fixturestatistics/${fixtureId}`, {
        headers: { 'accesskey': memberKey }
      });
      const data = await response.json();

      if (data.data?.status === 'Ok' && data.data?.fixtures?.[fixtureId]) {
        setFixtureStats(prev => ({
          ...prev,
          [fixtureId]: data.data.fixtures[fixtureId]
        }));
      }
    } catch (err) {
      console.error('Error fetching fixture statistics:', err);
    } finally {
      setLoadingStats(prev => ({ ...prev, [fixtureId]: false }));
    }
  };

  const handleTabChange = (fixtureId, tab) => {
    setExpandedTab(prev => ({ ...prev, [fixtureId]: tab }));
    if (tab === 'statistics' && !fixtureStats[fixtureId]) {
      fetchFixtureStatistics(fixtureId);
    }
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

  const formatCompetition = (competition) => {
    if (!competition) return '';
    return competition
      .replace(/([A-Z])/g, ' $1')
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      .trim();
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

  const renderForm = (formString) => {
    if (!formString) return null;
    const results = formString.split(',');
    return (
      <div className="flex justify-center gap-1">
        {results.map((result, i) => (
          <span
            key={i}
            className={`w-5 h-5 flex items-center justify-center text-xs font-bold rounded ${
              result === 'W' ? 'bg-green-600 text-white' :
              result === 'L' ? 'bg-red-600 text-white' :
              'bg-gray-400 text-white'
            }`}
          >
            {result}
          </span>
        ))}
      </div>
    );
  };

  const exportFixturesToExcel = () => {
    const exportData = fixtures.map(fixture => {
      const homeTeam = getTeamById(fixture.hometeamid);
      const guestTeam = getTeamById(fixture.guestteamid);
      const played = isMatchPlayed(fixture);

      return {
        'Season': fixture.season,
        'Round': fixture.round,
        'Competition': fixture.competition === 'Friendly' && fixture.friendlycompetitionshort
          ? fixture.friendlycompetitionshort
          : formatCompetition(fixture.competition),
        'Date': new Date(fixture.matchstart).toLocaleDateString(),
        'Time': formatTime(fixture.matchstart),
        'Home Team': homeTeam?.name || `Team ${fixture.hometeamid}`,
        'Away Team': guestTeam?.name || `Team ${fixture.guestteamid}`,
        'Home Score': played ? fixture.matchSummary.home.points : '',
        'Away Score': played ? fixture.matchSummary.guest.points : '',
        'Venue': fixture.venue || (homeTeam?.stadium || ''),
        'Status': played ? 'Played' : 'Upcoming'
      };
    });

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Fixtures");
    XLSX.writeFile(wb, "fixtures.xlsx");
  };

  const exportMatchStatsToExcel = (fixture) => {
    const homeTeam = getTeamById(fixture.hometeamid);
    const guestTeam = getTeamById(fixture.guestteamid);
    const homeStats = getTeamStats(fixture, true);
    const guestStats = getTeamStats(fixture, false);
    const homeReport = fixture.reporterSummary?.home;
    const guestReport = fixture.reporterSummary?.guest;

    const matchInfo = [
      { 'Category': 'Match Information', 'Home Team': '', 'Away Team': '' },
      { 'Category': 'Teams', 'Home Team': homeTeam?.name || '', 'Away Team': guestTeam?.name || '' },
      { 'Category': 'Date', 'Home Team': new Date(fixture.matchstart).toLocaleDateString(), 'Away Team': '' },
      { 'Category': 'Competition', 'Home Team': formatCompetition(fixture.competition), 'Away Team': '' },
      { 'Category': 'Venue', 'Home Team': fixture.venue || '', 'Away Team': '' },
      { 'Category': 'Attendance', 'Home Team': getAttendance(fixture), 'Away Team': '' },
      { 'Category': '', 'Home Team': '', 'Away Team': '' },
      { 'Category': 'Score', 'Home Team': fixture.matchSummary.home.points, 'Away Team': fixture.matchSummary.guest.points },
    ];

    const scoringStats = [
      { 'Category': '', 'Home Team': '', 'Away Team': '' },
      { 'Category': 'Scoring Breakdown', 'Home Team': '', 'Away Team': '' },
      { 'Category': 'Tries', 'Home Team': getStatCount(fixture.matchSummary.home.tries), 'Away Team': getStatCount(fixture.matchSummary.guest.tries) },
      { 'Category': 'Conversions', 'Home Team': getStatCount(fixture.matchSummary.home.conversions), 'Away Team': getStatCount(fixture.matchSummary.guest.conversions) },
      { 'Category': 'Penalties', 'Home Team': getStatCount(fixture.matchSummary.home.penalties), 'Away Team': getStatCount(fixture.matchSummary.guest.penalties) },
      { 'Category': 'Drop Goals', 'Home Team': getStatCount(fixture.matchSummary.home.dropgoals), 'Away Team': getStatCount(fixture.matchSummary.guest.dropgoals) },
    ];

    const matchStats = [
      { 'Category': '', 'Home Team': '', 'Away Team': '' },
      { 'Category': 'Match Statistics', 'Home Team': '', 'Away Team': '' },
      { 'Category': 'Territory %', 'Home Team': homeStats?.territory || '', 'Away Team': guestStats?.territory || '' },
      { 'Category': 'Possession %', 'Home Team': homeStats?.possession || '', 'Away Team': guestStats?.possession || '' },
    ];

    const teamStars = [
      { 'Category': '', 'Home Team': '', 'Away Team': '' },
      { 'Category': 'Team Stars', 'Home Team': '', 'Away Team': '' },
      { 'Category': 'Scrum', 'Home Team': homeStats?.scrum || '', 'Away Team': guestStats?.scrum || '' },
      { 'Category': 'Lineout', 'Home Team': homeStats?.lineout || '', 'Away Team': guestStats?.lineout || '' },
      { 'Category': 'Ruck', 'Home Team': homeStats?.ruck || '', 'Away Team': guestStats?.ruck || '' },
      { 'Category': 'Maul', 'Home Team': homeStats?.maul || '', 'Away Team': guestStats?.maul || '' },
      { 'Category': 'Attack', 'Home Team': homeStats?.attack || '', 'Away Team': guestStats?.attack || '' },
      { 'Category': 'Defense', 'Home Team': homeStats?.defense || '', 'Away Team': guestStats?.defense || '' },
      { 'Category': 'Kicking', 'Home Team': homeStats?.kicking || '', 'Away Team': guestStats?.kicking || '' },
      { 'Category': 'Handling', 'Home Team': homeStats?.handling || '', 'Away Team': guestStats?.handling || '' },
      { 'Category': 'Stamina', 'Home Team': homeStats?.stamina || '', 'Away Team': guestStats?.stamina || '' },
    ];

    const teamInfo = homeReport && guestReport ? [
      { 'Category': '', 'Home Team': '', 'Away Team': '' },
      { 'Category': 'Team Information', 'Home Team': '', 'Away Team': '' },
      { 'Category': 'World Rank', 'Home Team': homeReport.world_rank, 'Away Team': guestReport.world_rank },
      { 'Category': 'National Rank', 'Home Team': homeReport.national_rank, 'Away Team': guestReport.national_rank },
      { 'Category': 'Regional Rank', 'Home Team': homeReport.regional_rank, 'Away Team': guestReport.regional_rank },
      { 'Category': 'Avg CSR', 'Home Team': homeReport.avg_csr, 'Away Team': guestReport.avg_csr },
      { 'Category': 'Energy %', 'Home Team': homeReport.energy_level, 'Away Team': guestReport.energy_level },
      { 'Category': 'Weight (kg)', 'Home Team': homeReport.weight, 'Away Team': guestReport.weight },
      { 'Category': 'Form', 'Home Team': homeReport.all_form, 'Away Team': guestReport.all_form },
    ] : [];

    const exportData = [...matchInfo, ...scoringStats, ...matchStats, ...teamStars, ...teamInfo];

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Match Stats");
    const fileName = `match_${homeTeam?.name || 'Home'}_vs_${guestTeam?.name || 'Away'}`.replace(/[^a-z0-9_]/gi, '_') + '.xlsx';
    XLSX.writeFile(wb, fileName);
  };

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

  const upcomingFixtures = fixtures.filter(f => !isMatchPlayed(f));
  const playedFixtures = fixtures.filter(f => isMatchPlayed(f));

  return (
    <div className="space-y-8">
      {fixtures.length > 0 && (
        <div className="flex justify-end mb-4">
          <button
            onClick={exportFixturesToExcel}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Export Fixtures
          </button>
        </div>
      )}
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
                        Season {fixture.season} • Round {fixture.round} • {
                          fixture.competition === 'Friendly' && fixture.friendlycompetitionshort
                            ? fixture.friendlycompetitionshort
                            : formatCompetition(fixture.competition)
                        }
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
                          {expandedFixture === fixture.id ? 'less' : 'more'}
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
                        Season {fixture.season} • Round {fixture.round} • {
                          fixture.competition === 'Friendly' && fixture.friendlycompetitionshort
                            ? fixture.friendlycompetitionshort
                            : formatCompetition(fixture.competition)
                        }
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
                          {expandedFixture === fixture.id ? 'less' : 'more'}
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
                      const homeReport = fixture.reporterSummary?.home;
                      const guestReport = fixture.reporterSummary?.guest;
                      const homeTries = getStatCount(fixture.matchSummary.home.tries);
                      const guestTries = getStatCount(fixture.matchSummary.guest.tries);
                      const homeConversions = getStatCount(fixture.matchSummary.home.conversions);
                      const guestConversions = getStatCount(fixture.matchSummary.guest.conversions);
                      const homePenalties = getStatCount(fixture.matchSummary.home.penalties);
                      const guestPenalties = getStatCount(fixture.matchSummary.guest.penalties);
                      const homeDropgoals = getStatCount(fixture.matchSummary.home.dropgoals);
                      const guestDropgoals = getStatCount(fixture.matchSummary.guest.dropgoals);

                      const currentTab = expandedTab[fixture.id] || 'matchstats';
                      const stats = fixtureStats[fixture.id];

                      return (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <div className="border-b border-gray-200 mb-6">
                            <div className="flex justify-center space-x-8">
                              <button
                                onClick={() => handleTabChange(fixture.id, 'matchstats')}
                                className={`py-3 px-4 border-b-2 font-medium text-sm transition-colors ${
                                  currentTab === 'matchstats'
                                    ? 'border-blue-600 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                              >
                                Match Stats
                              </button>
                              <button
                                onClick={() => handleTabChange(fixture.id, 'statistics')}
                                className={`py-3 px-4 border-b-2 font-medium text-sm transition-colors ${
                                  currentTab === 'statistics'
                                    ? 'border-blue-600 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                              >
                                Statistics
                              </button>
                            </div>
                          </div>

                          {currentTab === 'matchstats' && (
                          <div className="max-w-4xl mx-auto space-y-6">

                            <div className="space-y-3">
                              <h3 className="text-sm font-bold text-gray-700 text-center uppercase tracking-wide">Scoring</h3>
                              <div className="flex justify-center gap-8">
                                <div className="text-center">
                                  <div className="text-xs text-gray-500 uppercase mb-1">Tries</div>
                                  <div className="text-lg font-bold">{homeTries} - {guestTries}</div>
                                </div>
                                <div className="text-center">
                                  <div className="text-xs text-gray-500 uppercase mb-1">Conversions</div>
                                  <div className="text-lg font-bold">{homeConversions} - {guestConversions}</div>
                                </div>
                                <div className="text-center">
                                  <div className="text-xs text-gray-500 uppercase mb-1">Penalties</div>
                                  <div className="text-lg font-bold">{homePenalties} - {guestPenalties}</div>
                                </div>
                                {(homeDropgoals > 0 || guestDropgoals > 0) && (
                                  <div className="text-center">
                                    <div className="text-xs text-gray-500 uppercase mb-1">Drop Goals</div>
                                    <div className="text-lg font-bold">{homeDropgoals} - {guestDropgoals}</div>
                                  </div>
                                )}
                              </div>
                            </div>

                            <div className="pt-4 border-t border-gray-200 space-y-3">
                              <h3 className="text-sm font-bold text-gray-700 text-center uppercase tracking-wide">Match Stats</h3>
                              {homeStats?.territory && guestStats?.territory && (
                                <div>
                                  <div className="text-xs text-gray-500 uppercase mb-2 text-center">Territory</div>
                                  <div className="flex items-center justify-center gap-3">
                                    <span className="text-sm font-semibold w-12 text-right">{homeStats.territory}%</span>
                                    <div className="w-48 bg-gray-200 rounded-full h-4 overflow-hidden flex">
                                      <div
                                        className={`h-full ${isHome ? 'bg-blue-600' : 'bg-gray-600'}`}
                                        style={{ width: `${homeStats.territory}%` }}
                                      />
                                      <div
                                        className={`h-full ${!isHome ? 'bg-blue-600' : 'bg-gray-600'}`}
                                        style={{ width: `${guestStats.territory}%` }}
                                      />
                                    </div>
                                    <span className="text-sm font-semibold w-12 text-left">{guestStats.territory}%</span>
                                  </div>
                                </div>
                              )}

                              {homeStats?.possession && guestStats?.possession && (
                                <div>
                                  <div className="text-xs text-gray-500 uppercase mb-2 text-center">Possession</div>
                                  <div className="flex items-center justify-center gap-3">
                                    <span className="text-sm font-semibold w-12 text-right">{homeStats.possession}%</span>
                                    <div className="w-48 bg-gray-200 rounded-full h-4 overflow-hidden flex">
                                      <div
                                        className={`h-full ${isHome ? 'bg-blue-600' : 'bg-gray-600'}`}
                                        style={{ width: `${homeStats.possession}%` }}
                                      />
                                      <div
                                        className={`h-full ${!isHome ? 'bg-blue-600' : 'bg-gray-600'}`}
                                        style={{ width: `${guestStats.possession}%` }}
                                      />
                                    </div>
                                    <span className="text-sm font-semibold w-12 text-left">{guestStats.possession}%</span>
                                  </div>
                                </div>
                              )}
                            </div>

                            {homeStats && guestStats && (
                              <div className="pt-4 border-t border-gray-200 space-y-3">
                                <h3 className="text-sm font-bold text-gray-700 text-center uppercase tracking-wide">Team Stars</h3>
                                <div className="space-y-2">
                                  {['scrum', 'lineout', 'ruck', 'maul', 'attack', 'defense', 'kicking', 'handling', 'stamina'].map(stat => (
                                    homeStats[stat] && guestStats[stat] && (
                                      <div key={stat} className="flex items-center justify-center gap-4">
                                        <div className={`w-32 text-right ${isHome ? 'opacity-100' : 'opacity-50'}`}>
                                          {renderStars(homeStats[stat])}
                                        </div>
                                        <div className="text-xs text-gray-500 uppercase w-20 text-center">{stat}</div>
                                        <div className={`w-32 text-left ${!isHome ? 'opacity-100' : 'opacity-50'}`}>
                                          {renderStars(guestStats[stat])}
                                        </div>
                                      </div>
                                    )
                                  ))}
                                </div>
                              </div>
                            )}

                            {homeReport && guestReport && (
                              <div className="pt-4 border-t border-gray-200 space-y-3">
                                <h3 className="text-sm font-bold text-gray-700 text-center uppercase tracking-wide">Team Information</h3>
                                <div className="space-y-3">
                                  <div className="flex items-center justify-center gap-4">
                                    <div className="w-32 text-right">
                                      {renderForm(homeReport.all_form)}
                                    </div>
                                    <div className="text-xs text-gray-500 uppercase w-20 text-center">Form</div>
                                    <div className="w-32 text-left">
                                      {renderForm(guestReport.all_form)}
                                    </div>
                                  </div>

                                  <div className="flex items-center justify-center gap-4">
                                    <div className="w-32 text-right">
                                      <div className="text-sm font-semibold">{homeReport.world_rank}</div>
                                    </div>
                                    <div className="text-xs text-gray-500 uppercase w-20 text-center">World Rank</div>
                                    <div className="w-32 text-left">
                                      <div className="text-sm font-semibold">{guestReport.world_rank}</div>
                                    </div>
                                  </div>

                                  <div className="flex items-center justify-center gap-4">
                                    <div className="w-32 text-right">
                                      <div className="text-sm font-semibold">{homeReport.national_rank}</div>
                                    </div>
                                    <div className="text-xs text-gray-500 uppercase w-20 text-center">National Rank</div>
                                    <div className="w-32 text-left">
                                      <div className="text-sm font-semibold">{guestReport.national_rank}</div>
                                    </div>
                                  </div>

                                  <div className="flex items-center justify-center gap-4">
                                    <div className="w-32 text-right">
                                      <div className="text-sm font-semibold">{homeReport.regional_rank}</div>
                                    </div>
                                    <div className="text-xs text-gray-500 uppercase w-20 text-center">Regional Rank</div>
                                    <div className="w-32 text-left">
                                      <div className="text-sm font-semibold">{guestReport.regional_rank}</div>
                                    </div>
                                  </div>

                                  <div className="flex items-center justify-center gap-4">
                                    <div className="w-32 text-right">
                                      <div className="text-sm font-semibold">{Number(homeReport.avg_csr).toLocaleString()}</div>
                                    </div>
                                    <div className="text-xs text-gray-500 uppercase w-20 text-center">Avg CSR</div>
                                    <div className="w-32 text-left">
                                      <div className="text-sm font-semibold">{Number(guestReport.avg_csr).toLocaleString()}</div>
                                    </div>
                                  </div>

                                  <div className="flex items-center justify-center gap-4">
                                    <div className="w-32 text-right">
                                      <div className="text-sm font-semibold">{homeReport.energy_level}%</div>
                                    </div>
                                    <div className="text-xs text-gray-500 uppercase w-20 text-center">Energy</div>
                                    <div className="w-32 text-left">
                                      <div className="text-sm font-semibold">{guestReport.energy_level}%</div>
                                    </div>
                                  </div>

                                  <div className="flex items-center justify-center gap-4">
                                    <div className="w-32 text-right">
                                      <div className="text-sm font-semibold">{homeReport.weight}kg</div>
                                    </div>
                                    <div className="text-xs text-gray-500 uppercase w-20 text-center">Weight</div>
                                    <div className="w-32 text-left">
                                      <div className="text-sm font-semibold">{guestReport.weight}kg</div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}

                            <div className="pt-4 border-t border-gray-200 space-y-4">
                              <div className="flex justify-center gap-8 text-center">
                                <div>
                                  <div className="text-xs text-gray-500 uppercase mb-1">Venue</div>
                                  <div className="text-sm font-medium">{fixture.venue || homeTeam?.name + ' Stadium' || 'N/A'}</div>
                                </div>
                                <div>
                                  <div className="text-xs text-gray-500 uppercase mb-1">Attendance</div>
                                  <div className="text-sm font-medium">{getAttendance(fixture)}</div>
                                </div>
                              </div>
                              <div className="flex justify-center">
                                <button
                                  onClick={() => exportMatchStatsToExcel(fixture)}
                                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold flex items-center gap-2"
                                >
                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                  </svg>
                                  Export Match Stats
                                </button>
                              </div>
                            </div>
                          </div>
                          )}

                          {currentTab === 'statistics' && (
                            <div className="max-w-4xl mx-auto">
                              {loadingStats[fixture.id] ? (
                                <div className="text-center py-8">
                                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                                  <p className="text-gray-600 mt-4">Loading statistics...</p>
                                </div>
                              ) : stats ? (
                                <div className="space-y-6">
                                  <div className="grid md:grid-cols-2 gap-6">
                                    <div className="bg-gray-50 rounded-lg p-6">
                                      <h3 className="text-lg font-bold text-gray-900 mb-4 text-center">{homeTeam?.name || 'Home Team'}</h3>
                                      <div className="space-y-3">
                                        <div className="flex justify-between border-b pb-2">
                                          <span className="text-sm text-gray-600">Tackles</span>
                                          <span className="font-semibold">{stats['home team stats']?.tackles || 0}</span>
                                        </div>
                                        <div className="flex justify-between border-b pb-2">
                                          <span className="text-sm text-gray-600">Metres Gained</span>
                                          <span className="font-semibold">{stats['home team stats']?.['metres gained'] || 0}</span>
                                        </div>
                                        <div className="flex justify-between border-b pb-2">
                                          <span className="text-sm text-gray-600">Linebreaks</span>
                                          <span className="font-semibold">{stats['home team stats']?.linebreaks || 0}</span>
                                        </div>
                                        <div className="flex justify-between border-b pb-2">
                                          <span className="text-sm text-gray-600">Missed Tackles</span>
                                          <span className="font-semibold">{stats['home team stats']?.['missed tackles'] || 0}</span>
                                        </div>
                                        <div className="flex justify-between border-b pb-2">
                                          <span className="text-sm text-gray-600">Turnovers</span>
                                          <span className="font-semibold">{stats['home team stats']?.turnovers || 0}</span>
                                        </div>
                                        <div className="flex justify-between border-b pb-2">
                                          <span className="text-sm text-gray-600">Knock-ons</span>
                                          <span className="font-semibold">{stats['home team stats']?.knockons || 0}</span>
                                        </div>
                                        <div className="flex justify-between border-b pb-2">
                                          <span className="text-sm text-gray-600">Penalties Conceded</span>
                                          <span className="font-semibold">{stats['home team stats']?.['penalties conceded'] || 0}</span>
                                        </div>
                                        <div className="flex justify-between border-b pb-2">
                                          <span className="text-sm text-gray-600">Lineouts Won/Lost</span>
                                          <span className="font-semibold">{stats['home team stats']?.['lineouts won'] || 0}/{stats['home team stats']?.['lineouts lost'] || 0}</span>
                                        </div>
                                        <div className="flex justify-between border-b pb-2">
                                          <span className="text-sm text-gray-600">Scrums Won/Lost</span>
                                          <span className="font-semibold">{stats['home team stats']?.['scrums won'] || 0}/{stats['home team stats']?.['scrums lost'] || 0}</span>
                                        </div>
                                        <div className="flex justify-between border-b pb-2">
                                          <span className="text-sm text-gray-600">Rucks Won</span>
                                          <span className="font-semibold">{stats['home team stats']?.['rucks won'] || 0}</span>
                                        </div>
                                        <div className="flex justify-between border-b pb-2">
                                          <span className="text-sm text-gray-600">Mauls Won</span>
                                          <span className="font-semibold">{stats['home team stats']?.['mauls won'] || 0}</span>
                                        </div>
                                        <div className="flex justify-between border-b pb-2">
                                          <span className="text-sm text-gray-600">Kicking Metres</span>
                                          <span className="font-semibold">{stats['home team stats']?.['kicking metres'] || 0}</span>
                                        </div>
                                      </div>
                                    </div>

                                    <div className="bg-gray-50 rounded-lg p-6">
                                      <h3 className="text-lg font-bold text-gray-900 mb-4 text-center">{guestTeam?.name || 'Away Team'}</h3>
                                      <div className="space-y-3">
                                        <div className="flex justify-between border-b pb-2">
                                          <span className="text-sm text-gray-600">Tackles</span>
                                          <span className="font-semibold">{stats['guest team stats']?.tackles || 0}</span>
                                        </div>
                                        <div className="flex justify-between border-b pb-2">
                                          <span className="text-sm text-gray-600">Metres Gained</span>
                                          <span className="font-semibold">{stats['guest team stats']?.['metres gained'] || 0}</span>
                                        </div>
                                        <div className="flex justify-between border-b pb-2">
                                          <span className="text-sm text-gray-600">Linebreaks</span>
                                          <span className="font-semibold">{stats['guest team stats']?.linebreaks || 0}</span>
                                        </div>
                                        <div className="flex justify-between border-b pb-2">
                                          <span className="text-sm text-gray-600">Missed Tackles</span>
                                          <span className="font-semibold">{stats['guest team stats']?.['missed tackles'] || 0}</span>
                                        </div>
                                        <div className="flex justify-between border-b pb-2">
                                          <span className="text-sm text-gray-600">Turnovers</span>
                                          <span className="font-semibold">{stats['guest team stats']?.turnovers || 0}</span>
                                        </div>
                                        <div className="flex justify-between border-b pb-2">
                                          <span className="text-sm text-gray-600">Knock-ons</span>
                                          <span className="font-semibold">{stats['guest team stats']?.knockons || 0}</span>
                                        </div>
                                        <div className="flex justify-between border-b pb-2">
                                          <span className="text-sm text-gray-600">Penalties Conceded</span>
                                          <span className="font-semibold">{stats['guest team stats']?.['penalties conceded'] || 0}</span>
                                        </div>
                                        <div className="flex justify-between border-b pb-2">
                                          <span className="text-sm text-gray-600">Lineouts Won/Lost</span>
                                          <span className="font-semibold">{stats['guest team stats']?.['lineouts won'] || 0}/{stats['guest team stats']?.['lineouts lost'] || 0}</span>
                                        </div>
                                        <div className="flex justify-between border-b pb-2">
                                          <span className="text-sm text-gray-600">Scrums Won/Lost</span>
                                          <span className="font-semibold">{stats['guest team stats']?.['scrums won'] || 0}/{stats['guest team stats']?.['scrums lost'] || 0}</span>
                                        </div>
                                        <div className="flex justify-between border-b pb-2">
                                          <span className="text-sm text-gray-600">Rucks Won</span>
                                          <span className="font-semibold">{stats['guest team stats']?.['rucks won'] || 0}</span>
                                        </div>
                                        <div className="flex justify-between border-b pb-2">
                                          <span className="text-sm text-gray-600">Mauls Won</span>
                                          <span className="font-semibold">{stats['guest team stats']?.['mauls won'] || 0}</span>
                                        </div>
                                        <div className="flex justify-between border-b pb-2">
                                          <span className="text-sm text-gray-600">Kicking Metres</span>
                                          <span className="font-semibold">{stats['guest team stats']?.['kicking metres'] || 0}</span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                <div className="text-center py-8 text-gray-600">
                                  No statistics available for this match.
                                </div>
                              )}
                            </div>
                          )}
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