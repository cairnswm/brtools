import { useTeam } from '../context/TeamContext';
import * as XLSX from 'xlsx';

const TrainingPage = () => {
  const { trainingReport, loading, players } = useTeam();

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-gray-600">Loading training report...</div>
      </div>
    );
  }

  if (!trainingReport) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-gray-600">No training report available</div>
      </div>
    );
  }

  const { data } = trainingReport;
  const report = data?.report?.report;

  if (!report) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-gray-600">No training report data available</div>
      </div>
    );
  }

  const getPlayerName = (playerId) => {
    const player = players.find(p => p.id === playerId);
    return player ? `${player.fname} ${player.lname}` : `Player ${playerId}`;
  };

  const getPlayer = (playerId) => {
    return players.find(p => p.id === playerId);
  };

  const teamTrainingPlayers = report.team?.players ? Object.values(report.team.players) : [];
  const individualTrainingPlayers = report.individual?.players ? Object.values(report.individual.players) : [];
  const teamSkills = report.team?.skills || [];

  const totalPops = teamTrainingPlayers.reduce((sum, player) => sum + (player.pops?.length || 0), 0);
  const totalDrops = teamTrainingPlayers.reduce((sum, player) => sum + (player.drops?.length || 0), 0);

  const exportToExcel = () => {
    const teamTrainingData = teamTrainingPlayers.map((player) => {
      const csrChange = Number(player.csr.is) - Number(player.csr.was);
      const energyChange = Number(player.energy.is) - Number(player.energy.was);
      const popsText = player.pops?.map(p => `${p.skill}: ${p.was}→${p.is}`).join(', ') || '';
      const dropsText = player.drops?.map(d => `${d.skill}: ${d.was}→${d.is}`).join(', ') || '';

      return {
        'Player': getPlayerName(player.id),
        'CSR Before': Number(player.csr.was),
        'CSR After': Number(player.csr.is),
        'CSR Change': csrChange,
        'Energy Before': player.energy.was,
        'Energy After': player.energy.is,
        'Energy Change': energyChange,
        'Skill Pops': popsText,
        'Skill Drops': dropsText
      };
    });

    const individualTrainingData = individualTrainingPlayers.map((player) => {
      const csrChange = Number(player.csr.is) - Number(player.csr.was);
      const energyChange = Number(player.energy.is) - Number(player.energy.was);
      const skillsText = player.skills?.map(s =>
        `${s.skill} (${s.sessions} sessions, ${s.trainer})`
      ).join('; ') || '';
      const popsText = player.skills?.flatMap(s =>
        s.pops?.map(p => `${p.skill}: ${p.was}→${p.is}`) || []
      ).join(', ') || '';

      return {
        'Player': getPlayerName(player.id),
        'CSR Before': Number(player.csr.was),
        'CSR After': Number(player.csr.is),
        'CSR Change': csrChange,
        'Energy Before': player.energy.was,
        'Energy After': player.energy.is,
        'Energy Change': energyChange,
        'Training Sessions': skillsText,
        'Skill Pops': popsText
      };
    });

    const wb = XLSX.utils.book_new();

    const wsTeam = XLSX.utils.json_to_sheet(teamTrainingData);
    XLSX.utils.book_append_sheet(wb, wsTeam, "Team Training");

    if (individualTrainingData.length > 0) {
      const wsIndividual = XLSX.utils.json_to_sheet(individualTrainingData);
      XLSX.utils.book_append_sheet(wb, wsIndividual, "Individual Training");
    }

    const summaryData = [
      { 'Metric': 'Season', 'Value': data.report.season },
      { 'Metric': 'Round', 'Value': data.report.round },
      { 'Metric': 'Coach Level', 'Value': report.coach_level },
      { 'Metric': 'Facility Level', 'Value': report.facility_level },
      { 'Metric': 'Total Pops', 'Value': totalPops },
      { 'Metric': 'Total Drops', 'Value': totalDrops },
      { 'Metric': 'Team Training Focus', 'Value': teamSkills.join(', ') }
    ];
    const wsSummary = XLSX.utils.json_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(wb, wsSummary, "Summary");

    XLSX.writeFile(wb, `training_report_s${data.report.season}_r${data.report.round}.xlsx`);
  };

  const exportSessionsToExcel = () => {
    const skillNames = ['stamina', 'handling', 'attack', 'defense', 'technique', 'strength', 'jumping', 'speed', 'agility', 'kicking'];

    const sessionsData = [];

    individualTrainingPlayers.forEach((trainingPlayer) => {
      const player = getPlayer(trainingPlayer.id);
      if (!player) return;

      const sessionsBySkill = {};

      trainingPlayer.skills?.forEach(skillTraining => {
        const skill = skillTraining.skill;
        const sessions = Number(skillTraining.sessions);
        const level = Number(skillTraining.trainerlevel);

        if (!sessionsBySkill[skill]) {
          sessionsBySkill[skill] = {};
        }
        if (!sessionsBySkill[skill][level]) {
          sessionsBySkill[skill][level] = 0;
        }
        sessionsBySkill[skill][level] += sessions;
      });

      sessionsData.push([`${player.fname} ${player.lname}`]);

      skillNames.forEach(skill => {
        const skillLevel = Number(player[skill]) || 0;
        const skillCapitalized = skill.charAt(0).toUpperCase() + skill.slice(1);

        const row = [skillCapitalized, skillLevel];

        if (sessionsBySkill[skill]) {
          const levels = Object.keys(sessionsBySkill[skill]).sort((a, b) => Number(b) - Number(a));
          levels.forEach(level => {
            row.push(sessionsBySkill[skill][level]);
            row.push(Number(level));
          });
        } else {
          row.push(0);
        }

        sessionsData.push(row);
      });
    });

    if (sessionsData.length === 0) {
      alert('No individual training sessions to export');
      return;
    }

    const ws = XLSX.utils.aoa_to_sheet(sessionsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Training Sessions");
    XLSX.writeFile(wb, `training_sessions_s${data.report.season}_r${data.report.round}.xlsx`);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Training Report</h2>
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-600">
              Season {data.report.season} - Round {data.report.round}
            </div>
            <button
              onClick={exportSessionsToExcel}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              Sessions Export
            </button>
            <button
              onClick={exportToExcel}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
            >
              Export to Excel
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div className="text-sm text-blue-600 font-medium">Coach Level</div>
            <div className="text-2xl font-bold text-blue-900">{report.coach_level}</div>
          </div>

          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <div className="text-sm text-green-600 font-medium">Facility Level</div>
            <div className="text-2xl font-bold text-green-900">{report.facility_level}</div>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
            <div className="text-sm text-purple-600 font-medium">Total Pops</div>
            <div className="text-2xl font-bold text-purple-900">{totalPops}</div>
          </div>

          <div className="bg-red-50 p-4 rounded-lg border border-red-200">
            <div className="text-sm text-red-600 font-medium">Total Drops</div>
            <div className="text-2xl font-bold text-red-900">{totalDrops}</div>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-700 border-b pb-2 mb-4">Team Training Focus</h3>
          <div className="flex flex-wrap gap-2">
            {teamSkills.map((skill, index) => (
              <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium capitalize">
                {skill}
              </span>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-700 border-b pb-2 mb-4">Team Training Results</h3>
          <div className="space-y-3">
            {teamTrainingPlayers.map((player) => {
              const hasPops = player.pops && player.pops.length > 0;
              const hasDrops = player.drops && player.drops.length > 0;
              const csrChange = Number(player.csr.is) - Number(player.csr.was);
              const energyChange = Number(player.energy.is) - Number(player.energy.was);

              if (!hasPops && !hasDrops && csrChange === 0) return null;

              return (
                <div key={player.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-semibold text-gray-800">{getPlayerName(player.id)}</span>
                    <div className="text-right text-sm">
                      <div className={`font-medium ${csrChange > 0 ? 'text-green-600' : csrChange < 0 ? 'text-red-600' : 'text-gray-600'}`}>
                        CSR: {Number(player.csr.was).toLocaleString()} → {Number(player.csr.is).toLocaleString()}
                        ({csrChange > 0 ? '+' : ''}{csrChange.toLocaleString()})
                      </div>
                      <div className="text-gray-600">
                        Energy: {player.energy.was} → {player.energy.is} ({energyChange > 0 ? '+' : ''}{energyChange})
                      </div>
                    </div>
                  </div>

                  {hasPops && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {player.pops.map((pop, idx) => (
                        <span key={idx} className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-medium">
                          ↑ {pop.skill}: {pop.was} → {pop.is}
                        </span>
                      ))}
                    </div>
                  )}

                  {hasDrops && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {player.drops.map((drop, idx) => (
                        <span key={idx} className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs font-medium">
                          ↓ {drop.skill}: {drop.was} → {drop.is}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {individualTrainingPlayers.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-700 border-b pb-2 mb-4">Individual Training Sessions</h3>
            <div className="space-y-3">
              {individualTrainingPlayers.map((player) => {
                const csrChange = Number(player.csr.is) - Number(player.csr.was);
                const energyChange = Number(player.energy.is) - Number(player.energy.was);

                return (
                  <div key={player.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex justify-between items-start mb-3">
                      <span className="font-semibold text-gray-800">{getPlayerName(player.id)}</span>
                      <div className="text-right text-sm">
                        <div className={`font-medium ${csrChange > 0 ? 'text-green-600' : csrChange < 0 ? 'text-red-600' : 'text-gray-600'}`}>
                          CSR: {Number(player.csr.was).toLocaleString()} → {Number(player.csr.is).toLocaleString()}
                          ({csrChange > 0 ? '+' : ''}{csrChange.toLocaleString()})
                        </div>
                        <div className="text-gray-600">
                          Energy: {player.energy.was} → {player.energy.is} ({energyChange > 0 ? '+' : ''}{energyChange})
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {player.skills.map((skillTraining, idx) => (
                        <div key={idx} className="p-3 bg-white rounded border border-gray-200">
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-medium text-gray-700 capitalize">{skillTraining.skill}</span>
                            <span className="text-sm text-gray-600">{skillTraining.sessions} sessions</span>
                          </div>
                          <div className="text-xs text-gray-500">
                            Trainer: {skillTraining.trainer} (Level {skillTraining.trainerlevel} - {skillTraining.trainertype})
                          </div>
                          {skillTraining.pops && skillTraining.pops.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                              {skillTraining.pops.map((pop, popIdx) => (
                                <span key={popIdx} className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-medium">
                                  ↑ {pop.skill}: {pop.was} → {pop.is}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrainingPage;
