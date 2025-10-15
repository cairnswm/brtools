import { useEffect } from "react";
import { useTeam } from "../hooks/useTeam";
import { useBRTools } from "../hooks/useBRTools";
import { accessElf } from "../components/accessElf";

const OfficePage = () => {
  const { teamId, players, trainingReport, standings, staff, facilities } = useTeam();
  const { getTeamById } = useBRTools();

  useEffect(() => {
    if (teamId) {
      accessElf.track("Team/Office", teamId);
    }
  }, [teamId]);

  const teamData = getTeamById(teamId);

  const getTopPlayers = () => {
    return [...players]
      .filter(p => Number(p.csr) > 0)
      .sort((a, b) => Number(b.csr) - Number(a.csr))
      .slice(0, 3);
  };

  const topPlayers = getTopPlayers();

  const activePlayers = players.filter(p => Number(p.csr) > 0);
  const top15Players = [...activePlayers].sort((a, b) => Number(b.csr) - Number(a.csr)).slice(0, 15);

  const top15Avg = top15Players.length > 0
    ? Math.round(top15Players.reduce((sum, p) => sum + Number(p.csr), 0) / top15Players.length)
    : 0;

  const allAvg = activePlayers.length > 0
    ? Math.round(activePlayers.reduce((sum, p) => sum + Number(p.csr), 0) / activePlayers.length)
    : 0;

  const avgAge = activePlayers.length > 0
    ? (activePlayers.reduce((sum, p) => sum + Number(p.age), 0) / activePlayers.length).toFixed(1)
    : 0;

  const getCoachingStaff = () => {
    if (!staff?.data?.staff?.trainers) return [];

    const trainers = staff.data.staff.trainers;
    const staffList = [];

    const trainerTypeMap = {
      fitness: { label: 'Fitness', skills: ['stamina'] },
      kicking: { label: 'Kicking', skills: ['kicking'] },
      defense: { label: 'Defense', skills: ['defense', 'technique', 'strength', 'jumping'] },
      attack: { label: 'Attack', skills: ['handling', 'attack', 'agility', 'speed'] }
    };

    trainers.forEach(trainer => {
      const typeConfig = trainerTypeMap[trainer.type];
      if (typeConfig) {
        staffList.push({
          type: typeConfig.label,
          name: trainer.name,
          level: trainer.level,
          skills: typeConfig.skills
        });
      }
    });

    return staffList;
  };

  const coachingStaff = getCoachingStaff();

  const getTrainingFacilities = () => {
    if (!facilities?.data?.facilities) return [];

    const facilitiesData = facilities.data.facilities;
    const facilitiesList = [];

    if (facilitiesData.training_facility && facilitiesData.training_facility.length > 0) {
      facilitiesList.push({
        name: 'Training Facility',
        level: Number(facilitiesData.training_facility[0].level) || 0
      });
    }

    if (facilitiesData.youth_training_facility && facilitiesData.youth_training_facility.length > 0) {
      facilitiesList.push({
        name: 'Youth Training Facility',
        level: Number(facilitiesData.youth_training_facility[0].level) || 0
      });
    }

    return facilitiesList;
  };

  const trainingFacilities = getTrainingFacilities();

  const getHeadCoach = () => {
    if (!staff?.data?.staff?.coach || staff.data.staff.coach.length === 0) return null;

    const coach = staff.data.staff.coach[0];
    return {
      name: coach.name,
      level: coach.level
    };
  };

  const headCoach = getHeadCoach();

  const getYouthStaff = () => {
    if (!staff?.data?.staff) return [];

    const staffData = staff.data.staff;
    const youthStaff = [];

    if (staffData.youth_coach && staffData.youth_coach.length > 0) {
      youthStaff.push({
        role: 'Youth Coach',
        name: staffData.youth_coach[0].name,
        level: staffData.youth_coach[0].level
      });
    }

    if (staffData.youth_manager && staffData.youth_manager.length > 0) {
      youthStaff.push({
        role: 'Youth Manager',
        name: staffData.youth_manager[0].name,
        level: staffData.youth_manager[0].level
      });
    }

    if (staffData.youth_scout && staffData.youth_scout.length > 0) {
      youthStaff.push({
        role: 'Youth Scout',
        name: staffData.youth_scout[0].name,
        level: staffData.youth_scout[0].level
      });
    }

    return youthStaff;
  };

  const youthStaff = getYouthStaff();

  const formatCurrency = (value) => {
    if (!value) return '$0';
    return `$${Number(value).toLocaleString()}`;
  };

  const formatStadiumCapacity = () => {
    if (!teamData?.stadium_capacity) return 'N/A';
    return Number(teamData.stadium_capacity).toLocaleString();
  };

  const getRankChange = (current, previous) => {
    const curr = Number(current);
    const prev = Number(previous);
    if (!prev || curr === prev) return null;
    const diff = prev - curr;
    return { diff, isPositive: diff > 0 };
  };

  const getLeaguePosition = () => {
    if (!standings || standings.length === 0) return [];

    const sortedStandings = [...standings].sort((a, b) => {
      const aPoints = Number(a.points);
      const bPoints = Number(b.points);
      if (aPoints !== bPoints) return bPoints - aPoints;

      const aFor = Number(a.for);
      const bFor = Number(b.for);
      if (aFor !== bFor) return bFor - aFor;

      const aAgainst = Number(a.against);
      const bAgainst = Number(b.against);
      return aAgainst - bAgainst;
    });

    const currentIndex = sortedStandings.findIndex(s => s.teamid === teamId);
    if (currentIndex === -1) return [];

    const result = [];
    if (currentIndex > 0) {
      result.push({ ...sortedStandings[currentIndex - 1], position: currentIndex });
    }
    result.push({ ...sortedStandings[currentIndex], position: currentIndex + 1, isCurrentTeam: true });
    if (currentIndex < sortedStandings.length - 1) {
      result.push({ ...sortedStandings[currentIndex + 1], position: currentIndex + 2 });
    }

    return result;
  };

  const leaguePosition = getLeaguePosition();

  const stats = [
    {
      label: "Top 15 Average CSR",
      value: top15Avg.toLocaleString(),
      subValue: `Squad Avg: ${allAvg.toLocaleString()}`
    },
    {
      label: "Average Age",
      value: avgAge,
      subValue: `${activePlayers.length} active players`
    },
    {
      label: "Bank Balance",
      value: formatCurrency(teamData?.bank_balance),
      subValue: `Total Salary: ${formatCurrency(teamData?.total_salary)}`
    },
    {
      label: "World Rank",
      value: teamData?.world_rank || 'N/A',
      subValue: (() => {
        const change = getRankChange(teamData?.world_rank, teamData?.prev_world_rank);
        if (!change) return null;
        return (
          <span className={change.isPositive ? 'text-green-600' : 'text-red-600'}>
            {change.isPositive ? '▲' : '▼'} {Math.abs(change.diff)}
          </span>
        );
      })()
    }
  ];

  return (
    <div className="space-y-8">
      <div className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 rounded-2xl shadow-2xl overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/2834917/pexels-photo-2834917.jpeg?auto=compress&cs=tinysrgb&w=1920')] bg-cover bg-center opacity-20"></div>

        <div className="relative z-10 px-8 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block mb-6 px-6 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
              <span className="text-white/90 text-sm font-medium uppercase tracking-wider">
                Official Club Headquarters
              </span>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 tracking-tight">
              {teamData?.name || "Team Office"}
            </h1>

            {teamData?.nickname_1 && (
              <p className="text-2xl text-white/90 mb-4 font-semibold">
                The {teamData.nickname_1}
              </p>
            )}

            <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
              Excellence in Rugby. Tradition. Victory.
            </p>

            <div className="flex flex-wrap justify-center gap-6 text-white/90 text-sm mb-8">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                <span>{teamData?.country_iso || 'N/A'}</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span>National Rank: {teamData?.national_rank || 'N/A'}</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
                <span>Regional Rank: {teamData?.regional_rank || 'N/A'}</span>
              </div>
            </div>

          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-100 to-transparent"></div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-shadow">
            <div className="text-3xl font-bold text-blue-900 mb-2">{stat.value}</div>
            <div className="text-sm text-gray-600 uppercase tracking-wide mb-1">{stat.label}</div>
            {stat.subValue && (
              <div className="text-xs text-gray-500 mt-1">{stat.subValue}</div>
            )}
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6">
          <h2 className="text-2xl font-bold text-white">Star Players</h2>
          <p className="text-blue-100 text-sm mt-1">Our top performers this season</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 p-8">
          {topPlayers.map((player, index) => (
            <div key={player.id} className="relative group">
              <div className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg z-10">
                {index + 1}
              </div>

              <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 border-2 border-gray-200 hover:border-blue-400 transition-all transform group-hover:scale-105 group-hover:shadow-xl">
                <div className="text-center mb-4">
                  <div className="w-20 h-20 mx-auto mb-3 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                    {player.jersey}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">
                    {player.fname} {player.lname}
                  </h3>
                  <p className="text-sm text-gray-600 capitalize">{player.position}</p>
                </div>

                <div className="space-y-2 pt-4 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">CSR</span>
                    <span className="font-bold text-blue-900">{Number(player.csr).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Age</span>
                    <span className="font-semibold text-gray-700">{player.age}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Form</span>
                    <span className="font-semibold text-gray-700">{player.form}/11</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {leaguePosition.length > 0 && (
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6">
            <h2 className="text-2xl font-bold text-white">League Position</h2>
            <p className="text-blue-100 text-sm mt-1">Current standings</p>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              {leaguePosition.map((standing, index) => {
                const team = getTeamById(standing.teamid);
                return (
                  <div
                    key={standing.teamid}
                    className={`flex items-center justify-between p-4 rounded-lg transition-all ${
                      standing.isCurrentTeam
                        ? 'bg-blue-50 border-2 border-blue-500'
                        : 'bg-gray-50 border-2 border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                          standing.isCurrentTeam
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-300 text-gray-700'
                        }`}
                      >
                        {standing.position}
                      </div>
                      <div className="flex-1">
                        <div className={`font-semibold ${
                          standing.isCurrentTeam ? 'text-blue-900' : 'text-gray-900'
                        }`}>
                          {team?.name || `Team ${standing.teamid}`}
                        </div>
                        <div className="text-xs text-gray-600 mt-1">
                          P: {standing.played} | W: {standing.w} | D: {standing.d} | L: {standing.l}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-2xl font-bold ${
                        standing.isCurrentTeam ? 'text-blue-900' : 'text-gray-900'
                      }`}>
                        {standing.points}
                      </div>
                      <div className="text-xs text-gray-600">points</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="relative h-48 bg-gradient-to-br from-green-500 to-emerald-600">
            <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/3621104/pexels-photo-3621104.jpeg?auto=compress&cs=tinysrgb&w=800')] bg-cover bg-center opacity-30"></div>
            <div className="relative z-10 p-6 h-full flex flex-col justify-end">
              <h3 className="text-2xl font-bold text-white mb-2">Training Facilities</h3>
              <p className="text-white/90 text-sm">World-class facilities for peak performance</p>
            </div>
          </div>
          <div className="p-6">
            {trainingFacilities.length > 0 ? (
              <div className="space-y-4">
                {trainingFacilities.map((facility, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <svg className="w-5 h-5 mr-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700">{facility.name}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      {[...Array(10)].map((_, i) => (
                        <div
                          key={i}
                          className={`w-2 h-6 rounded-sm ${
                            i < facility.level ? 'bg-green-600' : 'bg-gray-200'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">Training facility data unavailable</p>
            )}

            {(headCoach || coachingStaff.length > 0 || youthStaff.length > 0) && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="font-semibold text-gray-700 mb-4">Staff</h4>
                <div className="space-y-3">
                  {headCoach && (
                    <div className="bg-blue-50 rounded-lg p-3 border-2 border-blue-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-semibold text-blue-900">{headCoach.name}</div>
                          <div className="text-sm text-blue-700">Head Coach</div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-blue-900">Level {headCoach.level}</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {coachingStaff.map((coach, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <div className="font-semibold text-gray-900">{coach.name}</div>
                          <div className="text-sm text-gray-600">{coach.type} Trainer</div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-green-600">Level {coach.level}</div>
                        </div>
                      </div>
                      <div className="text-xs text-gray-500">
                        Trains: {coach.skills.join(', ')}
                      </div>
                    </div>
                  ))}

                  {youthStaff.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <h5 className="text-sm font-semibold text-gray-600 mb-3">Youth Development</h5>
                      {youthStaff.map((staff, index) => (
                        <div key={index} className="bg-gray-50 rounded-lg p-3 mb-2">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-semibold text-gray-900">{staff.name}</div>
                              <div className="text-sm text-gray-600">{staff.role}</div>
                            </div>
                            <div className="text-right">
                              <div className="text-lg font-bold text-green-600">Level {staff.level}</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="relative h-48 bg-gradient-to-br from-blue-500 to-blue-700">
            <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/1884574/pexels-photo-1884574.jpeg?auto=compress&cs=tinysrgb&w=800')] bg-cover bg-center opacity-30"></div>
            <div className="relative z-10 p-6 h-full flex flex-col justify-end">
              <h3 className="text-2xl font-bold text-white mb-2">{teamData?.stadium || 'Club Stadium'}</h3>
              <p className="text-white/90 text-sm">Home of champions and unforgettable moments</p>
            </div>
          </div>
          <div className="p-6">
            <div className="mb-6">
              <div className="text-sm text-gray-600 mb-2">Total Capacity</div>
              <div className="text-3xl font-bold text-blue-900">{formatStadiumCapacity()}</div>
            </div>

            <div className="space-y-3">
              {teamData?.stadium_standing && Number(teamData.stadium_standing) > 0 && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Standing</span>
                  <span className="font-semibold">{Number(teamData.stadium_standing).toLocaleString()}</span>
                </div>
              )}
              {teamData?.stadium_uncovered && Number(teamData.stadium_uncovered) > 0 && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Uncovered Seating</span>
                  <span className="font-semibold">{Number(teamData.stadium_uncovered).toLocaleString()}</span>
                </div>
              )}
              {teamData?.stadium_covered && Number(teamData.stadium_covered) > 0 && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Covered Seating</span>
                  <span className="font-semibold">{Number(teamData.stadium_covered).toLocaleString()}</span>
                </div>
              )}
              {teamData?.stadium_members && Number(teamData.stadium_members) > 0 && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Members Area</span>
                  <span className="font-semibold">{Number(teamData.stadium_members).toLocaleString()}</span>
                </div>
              )}
              {teamData?.stadium_corporate && Number(teamData.stadium_corporate) > 0 && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Corporate Suites</span>
                  <span className="font-semibold">{Number(teamData.stadium_corporate).toLocaleString()}</span>
                </div>
              )}
            </div>

            {teamData?.minor_sponsors && (
              <div className="mt-6 pt-6 border-t border-gray-200 text-center">
                <div className="text-2xl font-bold text-blue-900">{teamData.minor_sponsors}</div>
                <div className="text-sm text-gray-600 uppercase tracking-wide">Minor Sponsors</div>
              </div>
            )}
          </div>
        </div>
      </div>

    </div>
  );
};

export default OfficePage;
