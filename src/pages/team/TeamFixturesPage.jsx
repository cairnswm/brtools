import { useEffect } from "react";
import { useFixtures } from "../../hooks/useFixtures";
import { accessElf } from "../../components/accessElf";
import { useTeam } from "../../hooks/useTeam";
import { useBRTools } from "../../hooks/useBRTools";
import * as XLSX from 'xlsx';
import FixtureCard from "../../components/FixtureCard";

const TeamFixtures = () => {
  const { fixtures, loading, error } = useFixtures();
  const { teamId } = useTeam();
  const { getTeamById } = useBRTools();

  useEffect(() => {
    accessElf.track("Team/Fixtures", teamId);
  }, [teamId]);

  const formatCompetition = (competition) => {
    if (!competition) return '';
    return competition
      .replace(/([A-Z])/g, ' $1')
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      .trim();
  };

  const formatTime = (dateString) =>
    new Date(dateString).toLocaleString('default', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });

  const isMatchPlayed = (fixture) =>
    fixture.matchSummary &&
    (Number(fixture.matchSummary.home.points) > 0 ||
      Number(fixture.matchSummary.guest.points) > 0);

  const exportFixturesToExcel = () => {
    const exportData = fixtures.map((fixture) => {
      const homeTeam = getTeamById(fixture.hometeamid);
      const guestTeam = getTeamById(fixture.guestteamid);
      const played = isMatchPlayed(fixture);
      return {
        Season: fixture.season,
        Round: fixture.round,
        Competition:
          fixture.competition === 'Friendly' && fixture.friendlycompetitionshort
            ? fixture.friendlycompetitionshort
            : formatCompetition(fixture.competition),
        Date: new Date(fixture.matchstart).toLocaleDateString(),
        Time: formatTime(fixture.matchstart),
        'Home Team': homeTeam?.name || `Team ${fixture.hometeamid}`,
        'Away Team': guestTeam?.name || `Team ${fixture.guestteamid}`,
        'Home Score': played ? fixture.matchSummary.home.points : '',
        'Away Score': played ? fixture.matchSummary.guest.points : '',
        Venue: fixture.venue || homeTeam?.stadium || '',
        Status: played ? 'Played' : 'Upcoming',
      };
    });

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Fixtures');
    XLSX.writeFile(wb, 'fixtures.xlsx');
  };

  if (loading) {
    return (
      <div className="text-center py-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto" />
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

  const playedFixtures = fixtures.filter((f) => isMatchPlayed(f));
  const upcomingFixtures = fixtures.filter((f) => !isMatchPlayed(f));

  return (
    <div className="space-y-8">
      {fixtures.length > 0 && (
        <div className="flex justify-end mb-4">
          <button
            onClick={exportFixturesToExcel}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            Export Fixtures
          </button>
        </div>
      )}

      {playedFixtures.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Results</h2>
          <div className="grid gap-4">
            {playedFixtures.map((f) => (
              <FixtureCard key={f.id} fixture={f} teamId={teamId} />
            ))}
          </div>
        </div>
      )}

      {upcomingFixtures.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Upcoming Fixtures</h2>
          <div className="grid gap-4">
            {upcomingFixtures.map((f) => (
              <FixtureCard key={f.id} fixture={f} teamId={teamId} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamFixtures;
