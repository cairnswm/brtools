import { useTeam } from '../context/TeamContext';
import { useMemo } from 'react';

const TrainingPage = () => {
  const { training, currentGameDate, players, loading } = useTeam();

  const playersMap = useMemo(() => {
    return players.reduce((acc, player) => {
      acc[player.id] = player;
      return acc;
    }, {});
  }, [players]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-gray-600">Loading training data...</div>
      </div>
    );
  }

  if (!training) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-gray-600">No training data available</div>
      </div>
    );
  }

  const renderSkillChange = (skill, was, is) => {
    const change = is - was;
    if (change > 0) {
      return (
        <div className="flex items-center justify-between text-green-600">
          <span className="font-medium">{skill}</span>
          <span>{was} → {is} (+{change})</span>
        </div>
      );
    } else if (change < 0) {
      return (
        <div className="flex items-center justify-between text-red-600">
          <span className="font-medium">{skill}</span>
          <span>{was} → {is} ({change})</span>
        </div>
      );
    }
    return null;
  };

  const renderEnergyChange = (was, is) => {
    const change = is - was;
    if (change !== 0) {
      return (
        <div className={`flex items-center justify-between ${change < 0 ? 'text-orange-600' : 'text-blue-600'}`}>
          <span className="font-medium">Energy</span>
          <span>{was} → {is} ({change > 0 ? '+' : ''}{change})</span>
        </div>
      );
    }
    return null;
  };

  const renderCSRChange = (was, is) => {
    const change = is - was;
    if (change !== 0) {
      return (
        <div className={`flex items-center justify-between ${change > 0 ? 'text-green-600' : 'text-red-600'}`}>
          <span className="font-medium">CSR</span>
          <span>{was.toLocaleString()} → {is.toLocaleString()} ({change > 0 ? '+' : ''}{change.toLocaleString()})</span>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Training Report</h2>
          {currentGameDate && (
            <div className="text-sm text-gray-600">
              Season {currentGameDate.season}, Round {currentGameDate.round}, Day {currentGameDate.day}
            </div>
          )}
        </div>
        {training.report && (
          <div className="text-sm text-gray-600 mb-4">
            Report for Season {training.season}, Round {training.round}
          </div>
        )}
      </div>

      {training.report?.team && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Team Training</h3>
          {training.report.team.skills && training.report.team.skills.length > 0 && (
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">
                Skills trained: <span className="font-medium">{training.report.team.skills.join(', ')}</span>
              </p>
            </div>
          )}

          {training.report.team.players && Object.keys(training.report.team.players).length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.values(training.report.team.players).map((playerData) => {
                const player = playersMap[playerData.id];
                const hasChanges = playerData.pops?.length > 0 || playerData.drops?.length > 0 ||
                                  (playerData.csr?.was !== playerData.csr?.is) ||
                                  (playerData.energy?.was !== playerData.energy?.is);

                if (!hasChanges) return null;

                return (
                  <div key={playerData.id} className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-3">
                      {player ? `${player.fname} ${player.lname}` : `Player ${playerData.id}`}
                    </h4>
                    <div className="space-y-2">
                      {playerData.pops?.map((pop, idx) => (
                        <div key={`pop-${idx}`}>
                          {renderSkillChange(pop.skill, pop.was, pop.is)}
                        </div>
                      ))}
                      {playerData.drops?.map((drop, idx) => (
                        <div key={`drop-${idx}`}>
                          {renderSkillChange(drop.skill, drop.was, drop.is)}
                        </div>
                      ))}
                      {playerData.csr && renderCSRChange(Number(playerData.csr.was), playerData.csr.is)}
                      {playerData.energy && renderEnergyChange(playerData.energy.was, playerData.energy.is)}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {training.report?.individual && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Individual Training</h3>

          {training.report.individual.players && Object.keys(training.report.individual.players).length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.values(training.report.individual.players).map((playerData) => {
                const player = playersMap[playerData.id];
                const hasSkillChanges = playerData.skills && playerData.skills.length > 0;
                const hasCSRChange = playerData.csr?.was !== playerData.csr?.is;
                const hasEnergyChange = playerData.energy?.was !== playerData.energy?.is;

                if (!hasSkillChanges && !hasCSRChange && !hasEnergyChange) return null;

                return (
                  <div key={playerData.id} className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-3">
                      {player ? `${player.fname} ${player.lname}` : `Player ${playerData.id}`}
                    </h4>
                    <div className="space-y-3">
                      {playerData.skills?.map((skillData, idx) => (
                        <div key={idx} className="border-l-4 border-blue-500 pl-3">
                          <div className="text-sm text-gray-600 mb-1">
                            {skillData.sessions} sessions with {skillData.trainer} (Lvl {skillData.trainerlevel})
                          </div>
                          {skillData.pops?.map((pop, popIdx) => (
                            <div key={`skill-pop-${popIdx}`}>
                              {renderSkillChange(pop.skill, pop.was, pop.is)}
                            </div>
                          ))}
                        </div>
                      ))}
                      {playerData.csr && renderCSRChange(Number(playerData.csr.was), playerData.csr.is)}
                      {playerData.energy && renderEnergyChange(playerData.energy.was, playerData.energy.is)}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TrainingPage;
