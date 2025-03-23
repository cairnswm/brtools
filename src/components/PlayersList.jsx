import { useTeam } from "../context/TeamContext";
import { formatCSR } from "../utils/formatters";
import PlayerSortBar from "./PlayerSortBar";
import { Link } from "react-router-dom";

function PlayersList({ players }) {
  const { sortField, sortDirection, handleSort } = useTeam();

  const SortIcon = ({ field }) => {
    if (sortField !== field) return null;
    return <span className="ml-1">{sortDirection === "asc" ? "↑" : "↓"}</span>;
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <table className="min-w-full">
        <thead className="bg-gray-50">
          <tr>
            <th
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => handleSort("jersey")}
            >
              Jersey
              <SortIcon field="jersey" />
            </th>
            <th
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => handleSort("lname")}
            >
              Name
              <SortIcon field="lname" />
            </th>
            <th
              className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => handleSort("age")}
            >
              Age
              <SortIcon field="age" />
            </th>
            <th
              className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => handleSort("csr")}
            >
              CSR
              <SortIcon field="csr" />
            </th>
            <th
              className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => handleSort("energy")}
            >
              Energy
              <SortIcon field="energy" />
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {players.map((player) => {
            const csrFormatted = formatCSR(player.csr);
            return (
              <tr key={player.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {player.jersey !== "255" ? player.jersey : ""}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {player.fname} {player.lname}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                  {player.age}
                </td>
                <td
                  className={`px-6 py-4 whitespace-nowrap text-sm text-right ${csrFormatted.color}`}
                >
                  {csrFormatted.value}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                  {player.energy}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default PlayersList;
