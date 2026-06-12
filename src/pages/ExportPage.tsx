import { useState, FormEvent } from 'react';
import Header from '../components/Header';
import FixtureCard from '../components/FixtureCard';
import { useBRTools } from '../hooks/useBRTools';
import { accessElf } from '../components/accessElf';
import { API_BASE_URL } from '../config/api';

// ── Types ─────────────────────────────────────────────────────────────────

type FixtureType = 'club' | 'u20' | 'national';

interface FixtureTypeOption {
  value: FixtureType;
  label: string;
}

interface MatchSummaryTeam {
  points: string;
  tries: unknown;
  conversions: unknown;
  dropgoals: unknown;
  penalties: unknown;
  injuries: unknown;
  subs: unknown;
  intensity: string;
}

interface MatchSummary {
  home: MatchSummaryTeam;
  guest: MatchSummaryTeam;
  attendance: {
    standing: string;
    uncovered: string;
    covered: string;
    members: string;
    corporate: string;
  };
  weather?: {
    id: string;
    night: string;
  };
}

interface ReporterTeam {
  world_rank?: string | number;
  national_rank?: string | number;
  regional_rank?: string | number;
  avg_csr?: string | number;
  energy_level?: string | number;
  weight?: string | number;
  all_form?: string;
  territory?: string | number;
  possession?: string | number;
  scrum?: string | number;
  lineout?: string | number;
  ruck?: string | number;
  maul?: string | number;
  attack?: string | number;
  defense?: string | number;
  kicking?: string | number;
  handling?: string | number;
  stamina?: string | number;
}

interface ReporterSummary {
  home: ReporterTeam;
  guest: ReporterTeam;
}

interface Fixture {
  id: string | number;
  season: string | number;
  round: string | number;
  competition: string;
  friendlycompetitionshort?: string;
  matchstart: string;
  hometeamid: string | number;
  guestteamid: string | number;
  venue?: string;
  matchSummary?: MatchSummary;
  reporterSummary?: ReporterSummary;
}

interface FixtureApiResponse {
  data?: {
    status?: string;
    message?: string;
    fixtures?: Record<string, Fixture> | Fixture[];
  };
}

interface MatchApiResponse {
  data?: MatchSummary & { home?: MatchSummaryTeam };
}

interface ReporterApiResponse {
  data?: ReporterSummary & { home?: ReporterTeam };
}

// ── Constants ─────────────────────────────────────────────────────────────

const FIXTURE_TYPES: FixtureTypeOption[] = [
  { value: 'club', label: 'Club' },
  { value: 'u20', label: 'Under 20' },
  { value: 'national', label: 'National Team' },
];

const fixtureEndpoint = (type: FixtureType, matchId: string): string => {
  if (type === 'national') return `${API_BASE_URL}/int/nat/fixture/${matchId}`;
  if (type === 'u20') return `${API_BASE_URL}/int/u20/fixture/${matchId}`;
  return `${API_BASE_URL}/fixture/${matchId}`;
};

// ── Component ─────────────────────────────────────────────────────────────

function ExportPage() {
  const [matchId, setMatchId] = useState('');
  const [fixtureType, setFixtureType] = useState<FixtureType>('club');
  const [fixture, setFixture] = useState<Fixture | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { memberKey } = useBRTools();

  accessElf.track('Export');

  const handleLookup = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const id = matchId.trim();
    if (!id) return;

    setLoading(true);
    setError(null);
    setFixture(null);

    try {
      const headers = { accesskey: memberKey };

      // Fetch fixture info, match summary and reporter summary in parallel
      const [fixtureRes, matchRes, reporterRes] = await Promise.all([
        fetch(fixtureEndpoint(fixtureType, id), { headers }),
        fetch(`${API_BASE_URL}/fixture/${id}/match`, { headers }),
        fetch(`${API_BASE_URL}/fixture/${id}/reporter`, { headers }),
      ]);

      const [fixtureData, matchData, reporterData]: [
        FixtureApiResponse,
        MatchApiResponse,
        ReporterApiResponse,
      ] = await Promise.all([
        fixtureRes.json(),
        matchRes.json(),
        reporterRes.json(),
      ]);

      if (fixtureData.data?.status === 'Ok' && fixtureData.data?.fixtures) {
        const fixtures = fixtureData.data.fixtures;
        const found: Fixture | undefined = Array.isArray(fixtures)
          ? fixtures[0]
          : (fixtures as Record<string, Fixture>)[id] ??
            Object.values(fixtures as Record<string, Fixture>)[0];

        if (found) {
          if (matchData.data?.home !== undefined) {
            found.matchSummary = matchData.data as MatchSummary;
          }
          if (reporterData.data?.home !== undefined) {
            found.reporterSummary = reporterData.data as ReporterSummary;
          }
          setFixture(found);
        } else {
          setError('Match not found. Please check the ID and type.');
        }
      } else {
        setError(fixtureData.data?.message ?? 'Match not found. Please check the ID and type.');
      }
    } catch {
      setError('Failed to fetch match data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Match Export</h1>

        {/* Lookup form */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <form onSubmit={handleLookup} className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
              {/* Match ID */}
              <div className="flex-1">
                <label htmlFor="matchId" className="block text-sm font-medium text-gray-700 mb-1">
                  Match ID
                </label>
                <input
                  id="matchId"
                  type="text"
                  value={matchId}
                  onChange={(e) => setMatchId(e.target.value)}
                  placeholder="Enter match ID…"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              {/* Fixture type */}
              <div>
                <span className="block text-sm font-medium text-gray-700 mb-1">Fixture Type</span>
                <div className="flex gap-4">
                  {FIXTURE_TYPES.map(({ value, label }) => (
                    <label key={value} className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        name="fixtureType"
                        value={value}
                        checked={fixtureType === value}
                        onChange={() => setFixtureType(value)}
                        className="text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading || !matchId.trim()}
                className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold text-sm whitespace-nowrap"
              >
                {loading ? 'Loading…' : 'Look up'}
              </button>
            </div>
          </form>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Loading spinner */}
        {loading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto" />
            <p className="text-gray-600 mt-4">Fetching match data…</p>
          </div>
        )}

        {/* Result */}
        {fixture && !loading && (
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Match #{matchId}</h2>
            <FixtureCard fixture={fixture} />
          </div>
        )}
      </div>
    </div>
  );
}

export default ExportPage;
