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
      const international = allTeams.find(t => t.id === activeInternationalId);
      setActiveInternational(international || null);

      if (international) {
        fetchInternationalPlayers(activeInternationalType, activeInternationalId);
      }
    } else {
      setActiveInternational(null);
      setInternationalPlayers([]);
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
          'Accept': 'application/json'
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
      loading,
      error,
      sortField,
      sortDirection,
      handleSort,
      refreshInternationalsData: fetchInternationalsData,
      exportToExcel
    }}>
      {children}
    </InternationalsContext.Provider>
  );
}

InternationalsProvider.propTypes = {
  children: PropTypes.node.isRequired
};
