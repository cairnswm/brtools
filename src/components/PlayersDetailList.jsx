import { formatCSR, formatSalary, formatNationality, formatBirthday } from '../utils/formatters';
import SortBar from './SortBar';

function PlayersDetailList({ players }) {
  return (
    <div className="space-y-4">
      <SortBar />

      {players.map((player) => {
        const csrFormatted = formatCSR(player.csr);
        return (
          <div key={player.id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold">
                  {player.jersey !== "255" ? `${player.jersey}. ` : ""}{player.fname} {player.lname}
                </h3>
                <p className="text-gray-600">
                  {player.age} y/o ({formatBirthday(player.birthday)}) | <span className={csrFormatted.color}>{csrFormatted.value}</span> CSR | {formatSalary(player.salary)} p.w. | {player.height}cm | {player.weight}kg | {formatNationality(player)}
                </p>
              </div>
              <div className="text-right">
                <div className="text-gray-600">Energy: {player.energy}%</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8">
              <div>
                <div className="mb-2">Stamina: {player.stamina}</div>
                <div className="mb-2">Attack: {player.attack}</div>
                <div className="mb-2">Technique: {player.technique}</div>
                <div className="mb-2">Jumping: {player.jumping}</div>
                <div className="mb-2">Agility: {player.agility}</div>
              </div>
              <div>
                <div className="mb-2">Handling: {player.handling}</div>
                <div className="mb-2">Defense: {player.defense}</div>
                <div className="mb-2">Strength: {player.strength}</div>
                <div className="mb-2">Speed: {player.speed}</div>
                <div className="mb-2">Kicking: {player.kicking}</div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default PlayersDetailList;