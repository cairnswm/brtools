import { useState } from 'react';
import { useBRTools } from '../hooks/useBRTools';
import * as XLSX from 'xlsx';
import { API_BASE_URL } from '../config/api';

/**
 * Self-contained fixture card.
 * teamId  – when provided, colours the header green/red based on win/loss
 *           and highlights the "home" team name in blue.
 *           When null (export / neutral view) the header is always blue.
 */
function FixtureCard({ fixture, teamId = null }) {
  const [expanded, setExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState('matchstats');
  const [fixtureStats, setFixtureStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(false);

  const { memberKey, getTeamById } = useBRTools();

  const homeTeam = getTeamById(fixture.hometeamid);
  const guestTeam = getTeamById(fixture.guestteamid);

  const played = !!(
    fixture.matchSummary &&
    (Number(fixture.matchSummary.home.points) > 0 ||
      Number(fixture.matchSummary.guest.points) > 0)
  );

  const isHome = teamId !== null && fixture.hometeamid === teamId;

  const headerBg = (() => {
    if (!played) return 'bg-gradient-to-r from-blue-600 to-blue-700';
    if (teamId === null) return 'bg-blue-600';
    const hp = Number(fixture.matchSummary.home.points);
    const gp = Number(fixture.matchSummary.guest.points);
    if (hp === gp) return 'bg-gray-500';
    if ((isHome && hp > gp) || (!isHome && gp > hp)) return 'bg-green-600';
    return 'bg-red-600';
  })();

  const resultLabel = (() => {
    if (!played || teamId === null) return null;
    const hp = Number(fixture.matchSummary.home.points);
    const gp = Number(fixture.matchSummary.guest.points);
    if (hp === gp) return 'Draw';
    if ((isHome && hp > gp) || (!isHome && gp > hp)) return 'Victory';
    return 'Defeat';
  })();

  // ── helpers ──────────────────────────────────────────────────────────────

  const formatCompetition = (competition) => {
    if (!competition) return '';
    return competition
      .replace(/([A-Z])/g, ' $1')
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      .trim();
  };

  const formatDate = (dateString) => {
    const d = new Date(dateString);
    return { day: d.getDate(), month: d.toLocaleString('default', { month: 'short' }) };
  };

  const formatTime = (dateString) =>
    new Date(dateString).toLocaleString('default', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });

  const getStatCount = (stat) => {
    if (!stat || (Array.isArray(stat) && stat.length === 0)) return 0;
    if (stat.player) {
      if (Array.isArray(stat.player))
        return stat.player.reduce((sum, p) => sum + Number(p.number || 0), 0);
      return Number(stat.player.number || 0);
    }
    return 0;
  };

  const getAttendance = () => {
    if (!fixture.matchSummary?.attendance) return 'N/A';
    const a = fixture.matchSummary.attendance;
    const total =
      Number(a.standing || 0) +
      Number(a.uncovered || 0) +
      Number(a.covered || 0) +
      Number(a.members || 0) +
      Number(a.corporate || 0);
    return total.toLocaleString();
  };

  const getTeamStats = (isHomeTeam) => {
    const s = isHomeTeam ? fixture.reporterSummary?.home : fixture.reporterSummary?.guest;
    if (!s) return null;
    const half = (v) => (v ? Math.round(Number(v) / 2) : null);
    return {
      territory: half(s.territory),
      possession: half(s.possession),
      scrum: half(s.scrum),
      lineout: half(s.lineout),
      ruck: half(s.ruck),
      maul: half(s.maul),
      attack: half(s.attack),
      defense: half(s.defense),
      kicking: half(s.kicking),
      handling: half(s.handling),
      stamina: half(s.stamina),
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
    return (
      <div className="flex justify-center gap-1">
        {formString.split(',').map((r, i) => (
          <span
            key={i}
            className={`w-5 h-5 flex items-center justify-center text-xs font-bold rounded ${
              r === 'W'
                ? 'bg-green-600 text-white'
                : r === 'L'
                ? 'bg-red-600 text-white'
                : 'bg-gray-400 text-white'
            }`}
          >
            {r}
          </span>
        ))}
      </div>
    );
  };

  const competitionLabel =
    fixture.competition === 'Friendly' && fixture.friendlycompetitionshort
      ? fixture.friendlycompetitionshort
      : formatCompetition(fixture.competition);

  // ── actions ───────────────────────────────────────────────────────────────

  const toggleExpand = () => {
    const next = !expanded;
    setExpanded(next);
    if (next && played && !fixtureStats && !loadingStats) {
      fetchFixtureStatistics();
    }
  };

  const fetchFixtureStatistics = async () => {
    setLoadingStats(true);
    try {
      const response = await fetch(`${API_BASE_URL}/fixturestatistics/${fixture.id}`, {
        headers: { accesskey: memberKey },
      });
      const data = await response.json();
      if (data.data?.status === 'Ok' && data.data?.fixtures?.[fixture.id]) {
        setFixtureStats(data.data.fixtures[fixture.id]);
      }
    } catch (err) {
      console.error('Error fetching fixture statistics:', err);
    } finally {
      setLoadingStats(false);
    }
  };

  const exportMatchStatsToExcel = () => {
    const hs = getTeamStats(true);
    const gs = getTeamStats(false);
    const hr = fixture.reporterSummary?.home;
    const gr = fixture.reporterSummary?.guest;
    const ms = fixture.matchSummary;

    const rows = [
      { Category: 'Teams', 'Home Team': homeTeam?.name || `Team ${fixture.hometeamid}`, 'Away Team': guestTeam?.name || `Team ${fixture.guestteamid}` },
      { Category: 'Date', 'Home Team': new Date(fixture.matchstart).toLocaleDateString(), 'Away Team': '' },
      { Category: 'Competition', 'Home Team': competitionLabel, 'Away Team': '' },
      { Category: 'Venue', 'Home Team': fixture.venue || '', 'Away Team': '' },
      { Category: 'Attendance', 'Home Team': getAttendance(), 'Away Team': '' },
      { Category: '', 'Home Team': '', 'Away Team': '' },
      { Category: 'Score', 'Home Team': ms?.home.points ?? '', 'Away Team': ms?.guest.points ?? '' },
      { Category: '', 'Home Team': '', 'Away Team': '' },
      { Category: 'Tries', 'Home Team': getStatCount(ms?.home.tries), 'Away Team': getStatCount(ms?.guest.tries) },
      { Category: 'Conversions', 'Home Team': getStatCount(ms?.home.conversions), 'Away Team': getStatCount(ms?.guest.conversions) },
      { Category: 'Penalties', 'Home Team': getStatCount(ms?.home.penalties), 'Away Team': getStatCount(ms?.guest.penalties) },
      { Category: 'Drop Goals', 'Home Team': getStatCount(ms?.home.dropgoals), 'Away Team': getStatCount(ms?.guest.dropgoals) },
      { Category: '', 'Home Team': '', 'Away Team': '' },
      { Category: 'Territory %', 'Home Team': hs?.territory ?? '', 'Away Team': gs?.territory ?? '' },
      { Category: 'Possession %', 'Home Team': hs?.possession ?? '', 'Away Team': gs?.possession ?? '' },
      { Category: '', 'Home Team': '', 'Away Team': '' },
      ...['scrum', 'lineout', 'ruck', 'maul', 'attack', 'defense', 'kicking', 'handling', 'stamina'].map(
        (k) => ({ Category: k.charAt(0).toUpperCase() + k.slice(1), 'Home Team': hs?.[k] ?? '', 'Away Team': gs?.[k] ?? '' })
      ),
      ...(hr && gr
        ? [
            { Category: '', 'Home Team': '', 'Away Team': '' },
            { Category: 'World Rank', 'Home Team': hr.world_rank, 'Away Team': gr.world_rank },
            { Category: 'National Rank', 'Home Team': hr.national_rank, 'Away Team': gr.national_rank },
            { Category: 'Avg CSR', 'Home Team': hr.avg_csr, 'Away Team': gr.avg_csr },
            { Category: 'Energy %', 'Home Team': hr.energy_level, 'Away Team': gr.energy_level },
            { Category: 'Form', 'Home Team': hr.all_form, 'Away Team': gr.all_form },
          ]
        : []),
    ];

    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Match Stats');
    const fileName =
      `match_${homeTeam?.name || 'Home'}_vs_${guestTeam?.name || 'Away'}`.replace(/[^a-z0-9_]/gi, '_') + '.xlsx';
    XLSX.writeFile(wb, fileName);
  };

  const exportStatisticsToExcel = () => {
    if (!fixtureStats) {
      alert('Statistics not available for this match');
      return;
    }
    const hs = fixtureStats['home team stats'];
    const gs = fixtureStats['guest team stats'];
    const keys = [
      'tackles', 'metres gained', 'tries', 'conversions', 'missed conversions',
      'penalties', 'missed penalties', 'dropgoals', 'total points', 'linebreaks',
      'intercepts', 'missed tackles', 'turnovers', 'turnovers conceded', 'knockons',
      'forward passes', 'handling errors', 'phases', '7+ phases', 'penalties conceded',
      'penalties won', 'lineouts won', 'lineouts lost', 'lineouts thrown', 'lineouts secured',
      'scrums won', 'scrums lost', 'scrums put in', 'scrums secured', 'rucks won',
      'mauls won', 'kicks', 'good kicks', 'bad kicks', 'kicks out on the full',
      'kicking metres', 'possession', 'territory', 'minutes in 22', 'ball time',
      'yellow cards', 'red cards', 'injuries', 'injury breaks',
    ];
    const exportData = keys.map((k) => ({
      Statistic: k.charAt(0).toUpperCase() + k.slice(1),
      'Home Team': hs?.[k] ?? 0,
      'Away Team': gs?.[k] ?? 0,
    }));
    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Statistics');
    const fileName =
      `statistics_${homeTeam?.name || 'Home'}_vs_${guestTeam?.name || 'Away'}`.replace(/[^a-z0-9_]/gi, '_') + '.xlsx';
    XLSX.writeFile(wb, fileName);
  };

  // ── render helpers ────────────────────────────────────────────────────────

  const dateInfo = formatDate(fixture.matchstart);

  const renderExpandedPlayed = () => {
    const hs = getTeamStats(true);
    const gs = getTeamStats(false);
    const hr = fixture.reporterSummary?.home;
    const gr = fixture.reporterSummary?.guest;
    const ms = fixture.matchSummary;
    const homeTries = getStatCount(ms?.home.tries);
    const guestTries = getStatCount(ms?.guest.tries);
    const homeConv = getStatCount(ms?.home.conversions);
    const guestConv = getStatCount(ms?.guest.conversions);
    const homePen = getStatCount(ms?.home.penalties);
    const guestPen = getStatCount(ms?.guest.penalties);
    const homeDG = getStatCount(ms?.home.dropgoals);
    const guestDG = getStatCount(ms?.guest.dropgoals);

    return (
      <div className="mt-4 pt-4 border-t border-gray-200">
        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <div className="flex justify-center space-x-8">
            {['matchstats', 'statistics'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-3 px-4 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab === 'matchstats' ? 'Match Stats' : 'Statistics'}
              </button>
            ))}
          </div>
        </div>

        {activeTab === 'matchstats' && (
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Scoring */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-gray-700 text-center uppercase tracking-wide">Scoring</h3>
              <div className="flex justify-center gap-8">
                {[
                  ['Tries', homeTries, guestTries],
                  ['Conversions', homeConv, guestConv],
                  ['Penalties', homePen, guestPen],
                  ...(homeDG > 0 || guestDG > 0 ? [['Drop Goals', homeDG, guestDG]] : []),
                ].map(([label, h, g]) => (
                  <div key={label} className="text-center">
                    <div className="text-xs text-gray-500 uppercase mb-1">{label}</div>
                    <div className="text-lg font-bold">{h} - {g}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Territory & Possession */}
            {hs?.territory && gs?.territory && (
              <div className="pt-4 border-t border-gray-200 space-y-3">
                <h3 className="text-sm font-bold text-gray-700 text-center uppercase tracking-wide">Match Stats</h3>
                {[
                  ['Territory', hs.territory, gs.territory],
                  ['Possession', hs.possession, gs.possession],
                ].map(([label, hv, gv]) =>
                  hv && gv ? (
                    <div key={label}>
                      <div className="text-xs text-gray-500 uppercase mb-2 text-center">{label}</div>
                      <div className="flex items-center justify-center gap-3">
                        <span className="text-sm font-semibold w-12 text-right">{hv}%</span>
                        <div className="w-48 bg-gray-200 rounded-full h-4 overflow-hidden flex">
                          <div
                            className={`h-full ${teamId === null || isHome ? 'bg-blue-600' : 'bg-gray-600'}`}
                            style={{ width: `${hv}%` }}
                          />
                          <div
                            className={`h-full ${teamId === null || !isHome ? 'bg-blue-600' : 'bg-gray-600'}`}
                            style={{ width: `${gv}%` }}
                          />
                        </div>
                        <span className="text-sm font-semibold w-12 text-left">{gv}%</span>
                      </div>
                    </div>
                  ) : null
                )}
              </div>
            )}

            {/* Team Stars */}
            {hs && gs && (
              <div className="pt-4 border-t border-gray-200 space-y-3">
                <h3 className="text-sm font-bold text-gray-700 text-center uppercase tracking-wide">Team Stars</h3>
                <div className="space-y-2">
                  {['scrum', 'lineout', 'ruck', 'maul', 'attack', 'defense', 'kicking', 'handling', 'stamina'].map(
                    (stat) =>
                      hs[stat] && gs[stat] ? (
                        <div key={stat} className="flex items-center justify-center gap-4">
                          <div className={`w-32 text-right ${teamId !== null && !isHome ? 'opacity-50' : 'opacity-100'}`}>
                            {renderStars(hs[stat])}
                          </div>
                          <div className="text-xs text-gray-500 uppercase w-20 text-center">{stat}</div>
                          <div className={`w-32 text-left ${teamId !== null && isHome ? 'opacity-50' : 'opacity-100'}`}>
                            {renderStars(gs[stat])}
                          </div>
                        </div>
                      ) : null
                  )}
                </div>
              </div>
            )}

            {/* Team Information */}
            {hr && gr && (
              <div className="pt-4 border-t border-gray-200 space-y-3">
                <h3 className="text-sm font-bold text-gray-700 text-center uppercase tracking-wide">Team Information</h3>
                <div className="space-y-3">
                  {[
                    ['Form', renderForm(hr.all_form), renderForm(gr.all_form), true],
                    ['World Rank', hr.world_rank, gr.world_rank, false],
                    ['National Rank', hr.national_rank, gr.national_rank, false],
                    ['Regional Rank', hr.regional_rank, gr.regional_rank, false],
                    ['Avg CSR', Number(hr.avg_csr).toLocaleString(), Number(gr.avg_csr).toLocaleString(), false],
                    ['Energy', `${hr.energy_level}%`, `${gr.energy_level}%`, false],
                    ['Weight', `${hr.weight}kg`, `${gr.weight}kg`, false],
                  ].map(([label, hv, gv, isJsx]) => (
                    <div key={label} className="flex items-center justify-center gap-4">
                      <div className="w-32 text-right">
                        {isJsx ? hv : <div className="text-sm font-semibold">{hv}</div>}
                      </div>
                      <div className="text-xs text-gray-500 uppercase w-20 text-center">{label}</div>
                      <div className="w-32 text-left">
                        {isJsx ? gv : <div className="text-sm font-semibold">{gv}</div>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Venue / Attendance */}
            <div className="pt-4 border-t border-gray-200">
              <div className="flex justify-center gap-8 text-center">
                <div>
                  <div className="text-xs text-gray-500 uppercase mb-1">Venue</div>
                  <div className="text-sm font-medium">{fixture.venue || homeTeam?.name + ' Stadium' || 'N/A'}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 uppercase mb-1">Attendance</div>
                  <div className="text-sm font-medium">{getAttendance()}</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'statistics' && (
          <div className="max-w-4xl mx-auto">
            {loadingStats ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto" />
                <p className="text-gray-600 mt-4">Loading statistics…</p>
              </div>
            ) : fixtureStats ? (
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {[
                    { label: homeTeam?.name || 'Home Team', stats: fixtureStats['home team stats'] },
                    { label: guestTeam?.name || 'Away Team', stats: fixtureStats['guest team stats'] },
                  ].map(({ label, stats: s }) => (
                    <div key={label} className="bg-gray-50 rounded-lg p-6">
                      <h3 className="text-lg font-bold text-gray-900 mb-4 text-center">{label}</h3>
                      <div className="space-y-3">
                        {[
                          ['Tackles', s?.tackles],
                          ['Metres Gained', s?.['metres gained']],
                          ['Linebreaks', s?.linebreaks],
                          ['Missed Tackles', s?.['missed tackles']],
                          ['Turnovers', s?.turnovers],
                          ['Knock-ons', s?.knockons],
                          ['Penalties Conceded', s?.['penalties conceded']],
                          ['Lineouts Won/Lost', `${s?.['lineouts won'] ?? 0}/${s?.['lineouts lost'] ?? 0}`],
                          ['Scrums Won/Lost', `${s?.['scrums won'] ?? 0}/${s?.['scrums lost'] ?? 0}`],
                          ['Rucks Won', s?.['rucks won']],
                          ['Mauls Won', s?.['mauls won']],
                          ['Kicking Metres', s?.['kicking metres']],
                        ].map(([key, val]) => (
                          <div key={key} className="flex justify-between border-b pb-2">
                            <span className="text-sm text-gray-600">{key}</span>
                            <span className="font-semibold">{val ?? 0}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-600">No statistics available for this match.</div>
            )}
          </div>
        )}

        {/* Export button */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="flex justify-center">
            <button
              onClick={activeTab === 'matchstats' ? exportMatchStatsToExcel : exportStatisticsToExcel}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Export {activeTab === 'matchstats' ? 'Match Stats' : 'Statistics'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderExpandedUpcoming = () => {
    const venue = fixture.venue || (homeTeam?.stadium) || `${homeTeam?.name || 'TBD'} Stadium`;
    return (
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex justify-center">
            <div className="text-center">
              <div className="text-xs text-gray-500 uppercase mb-1">Venue</div>
              <div className="text-sm font-medium">{venue}</div>
            </div>
          </div>
          {homeTeam && guestTeam && (
            <div className="pt-4 border-t border-gray-200 space-y-3">
              <h3 className="text-sm font-bold text-gray-700 text-center uppercase tracking-wide">Team Information</h3>
              <div className="space-y-3">
                {[
                  ['World Rank', homeTeam.world_rank, guestTeam.world_rank],
                  ['National Rank', homeTeam.national_rank, guestTeam.national_rank],
                ].map(([label, hv, gv]) =>
                  hv || gv ? (
                    <div key={label} className="flex items-center justify-center gap-4">
                      <div className="w-32 text-right">
                        <div className="text-sm font-semibold">{hv || 'N/A'}</div>
                      </div>
                      <div className="text-xs text-gray-500 uppercase w-20 text-center">{label}</div>
                      <div className="w-32 text-left">
                        <div className="text-sm font-semibold">{gv || 'N/A'}</div>
                      </div>
                    </div>
                  ) : null
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  // ── render ────────────────────────────────────────────────────────────────

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      {/* Header */}
      <div className={`${headerBg} text-white px-6 py-3 opacity-90`}>
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">
            Season {fixture.season} • Round {fixture.round} • {competitionLabel}
          </span>
          {resultLabel ? (
            <span className="text-sm font-bold uppercase">{resultLabel}</span>
          ) : (
            <span className="text-sm">{formatTime(fixture.matchstart)}</span>
          )}
        </div>
      </div>

      <div className="p-6">
        {played ? (
          /* Played: show score */
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 flex-1">
              <div className="text-center w-16">
                <div className="text-2xl font-bold text-gray-700">{dateInfo.day}</div>
                <div className="text-xs text-gray-500 uppercase">{dateInfo.month}</div>
              </div>
              <div className="flex-1">
                <div className={`text-lg font-semibold ${teamId !== null && isHome ? 'text-blue-700' : 'text-gray-900'}`}>
                  {homeTeam?.name || `Team ${fixture.hometeamid}`}
                </div>
                <div className="text-sm text-gray-500">{homeTeam?.country_iso || ''}</div>
              </div>
              <div className="text-3xl font-bold text-gray-900">
                {Number(fixture.matchSummary.home.points)}
              </div>
            </div>
            <div className="px-6 text-center">
              <span className="text-2xl font-bold text-gray-400">-</span>
            </div>
            <div className="flex items-center space-x-4 flex-1 justify-end">
              <div className="text-3xl font-bold text-gray-900">
                {Number(fixture.matchSummary.guest.points)}
              </div>
              <div className="flex-1 text-right">
                <div className={`text-lg font-semibold ${teamId !== null && !isHome ? 'text-blue-700' : 'text-gray-900'}`}>
                  {guestTeam?.name || `Team ${fixture.guestteamid}`}
                </div>
                <div className="text-sm text-gray-500">{guestTeam?.country_iso || ''}</div>
              </div>
            </div>
          </div>
        ) : (
          /* Upcoming: show vs layout */
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 flex-1">
              <div className="text-center w-16">
                <div className="text-3xl font-bold text-gray-900">{dateInfo.day}</div>
                <div className="text-sm text-gray-600 uppercase">{dateInfo.month}</div>
              </div>
              <div className="flex-1">
                <div className={`text-lg font-semibold flex items-center ${teamId !== null && isHome ? 'text-blue-700' : 'text-gray-900'}`}>
                  {homeTeam?.name || `Team ${fixture.hometeamid}`}
                  {teamId !== null && isHome && (
                    <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">HOME</span>
                  )}
                </div>
                <div className="text-sm text-gray-500">{homeTeam?.country_iso || ''}</div>
              </div>
            </div>
            <div className="px-6 text-center">
              <span className="text-2xl font-bold text-gray-400">vs</span>
            </div>
            <div className="flex-1">
              <div className={`text-lg font-semibold text-right flex items-center justify-end ${teamId !== null && !isHome ? 'text-blue-700' : 'text-gray-900'}`}>
                {teamId !== null && !isHome && (
                  <span className="mr-2 text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">AWAY</span>
                )}
                {guestTeam?.name || `Team ${fixture.guestteamid}`}
              </div>
              <div className="text-sm text-gray-500 text-right">{guestTeam?.country_iso || ''}</div>
            </div>
          </div>
        )}

        {/* Expand toggle */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <button
            onClick={toggleExpand}
            className="w-full flex items-center justify-center text-sm text-gray-600 hover:text-blue-700 transition-colors"
          >
            <span className="font-medium">{expanded ? 'less' : 'more'}</span>
            <svg
              className={`ml-2 w-4 h-4 transition-transform ${expanded ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>

        {expanded && (played ? renderExpandedPlayed() : renderExpandedUpcoming())}
      </div>
    </div>
  );
}

export default FixtureCard;
