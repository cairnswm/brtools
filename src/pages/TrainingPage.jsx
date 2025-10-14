import { useTeam } from '../context/TeamContext';

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

  const teamTrainingPlayers = report.team?.players ? Object.values(report.team.players) : [];
  const individualTrainingPlayers = report.individual?.players ? Object.values(report.individual.players) : [];
  const teamSkills = report.team?.skills || [];

  const totalPops = teamTrainingPlayers.reduce((sum, player) => sum + (player.pops?.length || 0), 0);
  const totalDrops = teamTrainingPlayers.reduce((sum, player) => sum + (player.drops?.length || 0), 0);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Training Report</h2>
          <div className="text-sm text-gray-600">
            Season {data.report.season} - Round {data.report.round}
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
