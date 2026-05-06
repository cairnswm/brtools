import { createContext, useState, useEffect } from 'react';
import { useBRTools } from '../../hooks/useBRTools';
import PropTypes from 'prop-types';
import { API_BASE_URL } from '../../config/api';
import * as XLSX from 'xlsx';

export const InternationalsContext = createContext();

export function InternationalsProvider({ children }) {
  const [nationalTeams, setNationalTeams] = useState([]);
  const [u20Teams, setU20Teams] = useState([]);
  const [activeTab, setActiveTab] = useState('national');
  const [activeInternationalId, setActiveInternationalId] = useState(null);
  const [activeInternational, setActiveInternational] = useState(null);
  const [activeInternationalType, setActiveInternationalType] = useState(null);
  const [internationalPlayers, setInternationalPlayers] = useState([]);
  const [internationalFixtures, setInternationalFixtures] = useState([]);
  const [loadingFixtures, setLoadingFixtures] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sortField, setSortField] = useState('ranking_points');
  const [sortDirection, setSortDirection] = useState('desc');
  const { memberKey } = useBRTools();

  useEffect(() => {
    if (memberKey) {
      fetchInternationalsData();
    }
  }, [memberKey]);

  useEffect(() => {
    if (activeInternationalId && activeInternationalType) {
      const allTeams = activeInternationalType === 'nat' ? nationalTeams : u20Teams;
      const international = allTeams.find(t => String(t.id) === String(activeInternationalId));
      setActiveInternational(international || null);

      if (international) {
        fetchInternationalPlayers(activeInternationalType, activeInternationalId);
        fetchInternationalFixtures(activeInternationalType, activeInternationalId);
      }
    } else {
      setActiveInternational(null);
      setInternationalPlayers([]);
      setInternationalFixtures([]);
    }
  }, [activeInternationalId, activeInternationalType, nationalTeams, u20Teams]);

  const fetchInternationalsData = async () => {
    setLoading(true);
    setError(null);

    try {
      const [natResponse, u20Response] = await Promise.all([
        fetch(`${API_BASE_URL}/int/nat`, {
          headers: {
            'accesskey': memberKey
          }
        }),
        fetch(`${API_BASE_URL}/int/u20`, {
          headers: {
            'accesskey': memberKey
          }
        })
      ]);

      const natData = await natResponse.json();
      const u20Data = await u20Response.json();

      if (natData.data?.status === 'Ok') {
        setNationalTeams(natData.data.items || []);
      } else {
        setNationalTeams([]);
      }

      if (u20Data.data?.status === 'Ok') {
        setU20Teams(u20Data.data.items || []);
      } else {
        setU20Teams([]);
      }
    } catch (err) {
      setError('Failed to fetch internationals data');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchInternationalPlayers = async (type, teamId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/team/${type}/${teamId}/players`, {
        headers: {
          'Accept': 'application/json',
          'accesskey': memberKey
        }
      });

      const data = await response.json();

      if (data.data?.status === 'Ok' && data.data.players) {
        const playersArray = Object.values(data.data.players);
        setInternationalPlayers(playersArray);
      } else {
        setInternationalPlayers([]);
      }
    } catch (err) {
      console.error('Error fetching international players:', err);
      setInternationalPlayers([]);
    }
  };

  const fetchInternationalFixtures = async (type, teamId) => {
    setLoadingFixtures(true);
    try {
      const [lastResponse, futureResponse] = await Promise.all([
        fetch(`${API_BASE_URL}/team/${type}/${teamId}/fixtures?last=10`, {
          headers: {
            'Accept': 'application/json',
            'accesskey': memberKey
          }
        }),
        fetch(`${API_BASE_URL}/team/${type}/${teamId}/fixtures?future=10`, {
          headers: {
            'Accept': 'application/json',
            'accesskey': memberKey
          }
        })
      ]);

      const lastData = await lastResponse.json();
      const futureData = await futureResponse.json();

      const lastFixtures = lastData.data?.status === 'Ok' && lastData.data.fixtures ? Object.values(lastData.data.fixtures) : [];
      const futureFixtures = futureData.data?.status === 'Ok' && futureData.data.fixtures ? Object.values(futureData.data.fixtures) : [];

      const allFixtures = [...lastFixtures, ...futureFixtures];
      setInternationalFixtures(allFixtures);
    } catch (err) {
      console.error('Error fetching international fixtures:', err);
      setInternationalFixtures([]);
    } finally {
      setLoadingFixtures(false);
    }
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const sortTeams = (teams) => {
    return [...teams].sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];

      if (['average_top15_csr', 'ranking_points', 'world_rank'].includes(sortField)) {
        aValue = Number(aValue) || 0;
        bValue = Number(bValue) || 0;
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  };

  const sortedNationalTeams = sortTeams(nationalTeams);
  const sortedU20Teams = sortTeams(u20Teams);

  const getNationality = (player) => {
    let nat = player.nationality;
    if (player.capped_for && player.capped_for === player.nationality) { nat += '*'; }
    if (player.dualnationality) { nat += `/${player.dualnationality}`; }
    if (player.capped_for && player.capped_for === player.dualnationality) {
      nat += '*';
    }
    return nat;
  };

  const safeNum = (val) => {
    const n = Number(val);
    return isNaN(n) ? 0 : n;
  };

  const exportPlayersToExcel = () => {
    const exportData = internationalPlayers.map(player => ({
      Jersey: player.jersey !== "255" ? player.jersey || "" : "",
      'First Name': player.fname || "",
      'Last Name': player.lname || "",
      Age: safeNum(player.age),
      CSR: safeNum(player.csr),
      Energy: safeNum(player.energy),
      Form: safeNum(player.form),
      Leadership: safeNum(player.leadership),
      Experience: safeNum(player.experience),
      Discipline: safeNum(player.discipline),
      Aggression: safeNum(player.aggression),
      Height: safeNum(player.height),
      Weight: safeNum(player.weight),
      Nationality: getNationality(player) || "",
      Salary: safeNum(player.salary),
      Stamina: safeNum(player.stamina),
      Handling: safeNum(player.handling),
      Attack: safeNum(player.attack),
      Defense: safeNum(player.defense),
      Technique: safeNum(player.technique),
      Strength: safeNum(player.strength),
      Jumping: safeNum(player.jumping),
      Speed: safeNum(player.speed),
      Agility: safeNum(player.agility),
      Kicking: safeNum(player.kicking)
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Players");
    const teamName = activeInternational?.name?.replace(/[^a-z0-9]/gi, '_').toLowerCase() || 'players';
    XLSX.writeFile(wb, `${teamName}_players.xlsx`);
  };

  const exportToExcel = () => {
    const currentTeams = activeTab === 'national' ? sortedNationalTeams : sortedU20Teams;
    const exportData = currentTeams.map(team => ({
      'Team Name': team.name,
      'Average Top 15 CSR': team.average_top15_csr ? Number(team.average_top15_csr) : 0,
      'Ranking Points': team.ranking_points ? Number(team.ranking_points).toFixed(2) : 0,
      'World Rank': team.world_rank || 'N/A',
      'Owner': team.owner || 'N/A'
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    const sheetName = activeTab === 'national' ? 'National Teams' : 'U20 Teams';
    XLSX.utils.book_append_sheet(wb, ws, sheetName);
    const fileName = activeTab === 'national' ? 'national_teams.xlsx' : 'u20_teams.xlsx';
    XLSX.writeFile(wb, fileName);
  };

  return (
    <InternationalsContext.Provider value={{
      nationalTeams: sortedNationalTeams,
      u20Teams: sortedU20Teams,
      activeTab,
      setActiveTab,
      activeInternationalId,
      setActiveInternationalId,
      activeInternational,
      activeInternationalType,
      setActiveInternationalType,
      internationalPlayers,
      internationalFixtures,
      loadingFixtures,
      loading,
      error,
      sortField,
      sortDirection,
      handleSort,
      refreshInternationalsData: fetchInternationalsData,
      exportToExcel,
      exportPlayersToExcel
    }}>
      {children}
    </InternationalsContext.Provider>
  );
}

InternationalsProvider.propTypes = {
  children: PropTypes.node.isRequired
};
