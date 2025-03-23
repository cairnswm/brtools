import { formatCSR, formatSalary, formatNationality, formatBirthday } from '../utils/formatters';
import PlayerSortBar from './PlayerSortBar';
import PropTypes from 'prop-types';

function PlayersDetailList({ players }) {
  return (
    <div className="space-y-4">
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

            <div className="text-gray-600 mb-4">
              {player.hand} handed, {player.foot.toLowerCase()} footed, form: {player.form}.
              {" "}A {player.aggression} aggression player with {player.discipline} discipline, {player.leadership} leadership, and {player.experience} experience.
            </div>

            <div className="grid grid-cols-2 gap-8">
              <div>
                <div className="mb-2">Stamina: {player.stamina}{player.pops?.includes('stamina') ? '*' : ''}</div>
                <div className="mb-2">Attack: {player.attack}{player.pops?.includes('attack') ? '*' : ''}</div>
                <div className="mb-2">Technique: {player.technique}{player.pops?.includes('technique') ? '*' : ''}</div>
                <div className="mb-2">Jumping: {player.jumping}{player.pops?.includes('jumping') ? '*' : ''}</div>
                <div className="mb-2">Agility: {player.agility}{player.pops?.includes('agility') ? '*' : ''}</div>
              </div>
              <div>
                <div className="mb-2">Handling: {player.handling}{player.pops?.includes('handling') ? '*' : ''}</div>
                <div className="mb-2">Defense: {player.defense}{player.pops?.includes('defense') ? '*' : ''}</div>
                <div className="mb-2">Strength: {player.strength}{player.pops?.includes('strength') ? '*' : ''}</div>
                <div className="mb-2">Speed: {player.speed}{player.pops?.includes('speed') ? '*' : ''}</div>
                <div className="mb-2">Kicking: {player.kicking}{player.pops?.includes('kicking') ? '*' : ''}</div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

PlayersDetailList.propTypes = {
  players: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      jersey: PropTypes.string,
      fname: PropTypes.string,
      ops: PropTypes.arrayOf(PropTypes.string),
      lname: PropTypes.string,
      age: PropTypes.string,
      birthday: PropTypes.string,
      csr: PropTypes.string,
      salary: PropTypes.string,
      height: PropTypes.string,
      weight: PropTypes.string,
      nationality: PropTypes.string,
      energy: PropTypes.string,
      form: PropTypes.string,
      hand: PropTypes.oneOf(['Right', 'Left']),
      foot: PropTypes.oneOf(['Right', 'Left']),
      playstyle: PropTypes.string,
      discipline: PropTypes.string,
      leadership: PropTypes.string,
      experience: PropTypes.string,
      stamina: PropTypes.string,
      attack: PropTypes.string,
      technique: PropTypes.string,
      jumping: PropTypes.string,
      agility: PropTypes.string,
      handling: PropTypes.string,
      defense: PropTypes.string,
      strength: PropTypes.string,
      speed: PropTypes.string,
      kicking: PropTypes.string
    })
  ).isRequired
};

export default PlayersDetailList;
