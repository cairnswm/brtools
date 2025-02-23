import { useTeam } from '../context/TeamContext';
import { formatCSR, formatSalary } from '../utils/formatters';
import SortBar from './SortBar';

const PlayersAverages = () => {
  const { teamAverages } = useTeam();

  const renderAveragesSection = (title, averages) => {
    const csrFormatted = formatCSR(averages.csr);
    
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-semibold">{title}</h3>
            <p className="text-gray-600">
              Age: {averages.age} | <span className={csrFormatted.color}>{csrFormatted.value}</span> CSR | {formatSalary(averages.salary)} p.w.
            </p>
          </div>
          <div className="text-right">
            <div className="text-gray-600">Energy: {averages.energy}%</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8">
          <div>
            <div className="mb-2">Stamina: {averages.stamina}</div>
            <div className="mb-2">Attack: {averages.attack}</div>
            <div className="mb-2">Technique: {averages.technique}</div>
            <div className="mb-2">Jumping: {averages.jumping}</div>
            <div className="mb-2">Agility: {averages.agility}</div>
          </div>
          <div>
            <div className="mb-2">Handling: {averages.handling}</div>
            <div className="mb-2">Defense: {averages.defense}</div>
            <div className="mb-2">Strength: {averages.strength}</div>
            <div className="mb-2">Speed: {averages.speed}</div>
            <div className="mb-2">Kicking: {averages.kicking}</div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <SortBar />
      {renderAveragesSection('All Players Averages', teamAverages.allPlayers)}
      {renderAveragesSection('Top 15 Players Averages', teamAverages.top15Players)}
      {renderAveragesSection('Top 22 Players Averages', teamAverages.top22Players)}
    </div>
  );
};

export default PlayersAverages;
