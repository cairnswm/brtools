import { createContext, useState, useEffect } from 'react';
import { useBRTools } from '../hooks/useBRTools';
import * as XLSX from 'xlsx';
import PropTypes from 'prop-types';
import { API_BASE_URL } from '../config/api';

export const TeamContext = createContext();

const calculateTeamAverages = (players) => {
  const stats = ['age', 'csr', 'energy', 'form', 'stamina', 'handling', 'attack', 'defense', 'technique', 'strength', 'jumping', 'speed', 'agility', 'kicking', 'salary'];
  
  const sortedByCsr = [...players].sort((a, b) => Number(b.csr) - Number(a.csr));
  const top15 = sortedByCsr.slice(0, 15);
  const top22 = sortedByCsr.slice(0, 22);

  const calculateAverages = (playerGroup) => {
    const averages = {};
    stats.forEach(stat => {
      const sum = playerGroup.reduce((acc, player) => acc + Number(player[stat]), 0);
      averages[stat] = playerGroup.length ? (sum / playerGroup.length).toFixed(2) : 0;
    });
    return averages;
  };

  return {
    allPlayers: calculateAverages(players),
    top15Players: calculateAverages(top15),
    top22Players: calculateAverages(top22)
  };
};

const SORT_OPTIONS = [
  { value: 'jersey', label: 'Jersey' },
  { value: 'lname', label: 'Name' },
  { value: 'age', label: 'Age' },
  { value: 'csr', label: 'CSR' },
  { value: 'energy', label: 'Energy' },
  { value: 'form', label: 'Form' },
  { value: 'leadership', label: 'Leadership' },
  { value: 'discipline', label: 'Discipline' },
  { value: 'aggression', label: 'Aggression' },
  { value: 'height', label: 'Height' },
  { value: 'weight', label: 'Weight' },
  { value: 'stamina', label: 'Stamina' },
  { value: 'handling', label: 'Handling' },
  { value: 'attack', label: 'Attack' },
  { value: 'defense', label: 'Defense' },
  { value: 'technique', label: 'Technique' },
  { value: 'strength', label: 'Strength' },
  { value: 'jumping', label: 'Jumping' },
  { value: 'speed', label: 'Speed' },
  { value: 'agility', label: 'Agility' },
  { value: 'kicking', label: 'Kicking' },
  { value: 'salary', label: 'Salary' }
];

export function TeamProvider({ children }) {
  const [teamId, setTeamId] = useState(null);
  const [players, setPlayers] = useState([]);
  const [youth, setYouth] = useState([]);
  const [standings, setStandings] = useState([]);
  const [trainingReport, setTrainingReport] = useState(null);
  const [staff, setStaff] = useState(null);
  const [facilities, setFacilities] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sortField, setSortField] = useState('jersey');
  const [sortDirection, setSortDirection] = useState('asc');
  const [playersView, setPlayersView] = useState('summary'); // Options: 'summary', 'details', 'averages'
  const [standingsView, setStandingsView] = useState('standings');
  const [standingsSortField, setStandingsSortField] = useState('points');
  const [standingsSortDirection, setStandingsSortDirection] = useState('desc');
  const { memberKey, addTeamsToCache, cachedTeams } = useBRTools();

  useEffect(() => {
    if (teamId && memberKey) {
      setLoading(true);
      setError(null);
      
      fetch(`${API_BASE_URL}/team/${teamId}/players`, {
        headers: {
          'accesskey': memberKey
        }
      })
        .then(response => response.json())
        .then(data => {
          if (data.data?.status === 'Ok' && data.data?.players) {
            const playersList = Object.values(data.data.players);
            setPlayers(playersList);

            // Fetch youth data
            fetch(`${API_BASE_URL}/team/${teamId}/youth`, {
              headers: {
                'accesskey': memberKey
              }
            })
              .then(response => response.json())
              .then(youthData => {
                console.log("OK?", youthData)
                console.log("OK?", youthData.data?.status)
                if (youthData.data?.status === 'Ok' && youthData.data?.players) {
                  const youthList = Object.values(youthData.data.players);
                  
                console.log("YouthData", youthList)
                  setYouth(youthList);
                }
              })
              .catch(err => {
                console.error('Error fetching youth data:', err);
              });

            const team = cachedTeams[teamId];

            fetch(`${API_BASE_URL}/trainingreport/${teamId}`, {
              headers: {
                'accesskey': memberKey
              }
            })
              .then(response => response.json())
              .then(trainingData => {
                if (trainingData.data?.status === 'Ok') {
                  setTrainingReport(trainingData);
                }
              })
              .catch(err => {
                console.error('Error fetching training report:', err);
              });

            fetch(`${API_BASE_URL}/team/${teamId}/staff`, {
              headers: {
                'accesskey': memberKey
              }
            })
              .then(response => response.json())
              .then(staffData => {
                if (staffData.data?.status === 'Ok') {
                  setStaff(staffData);
                }
              })
              .catch(err => {
                console.error('Error fetching staff data:', err);
              });

            fetch(`${API_BASE_URL}/team/${teamId}/facilities`, {
              headers: {
                'accesskey': memberKey
              }
            })
              .then(response => response.json())
              .then(facilitiesData => {
                if (facilitiesData.data?.status === 'Ok') {
                  setFacilities(facilitiesData);
                }
              })
              .catch(err => {
                console.error('Error fetching facilities data:', err);
              });

            if (team?.leagueid) {
              return fetch(`${API_BASE_URL}/league/${team.leagueid}/standings`, {
                headers: {
                  'accesskey': memberKey
                }
              });
            }
          } else {
            throw new Error('Invalid response from server');
          }
        })
        .then(response => response?.json())
        .then(data => {
          if (data?.data?.status === 'Ok' && data?.data?.standings) {
            const standingsList = Object.values(data.data.standings);
            setStandings(standingsList);

            const teamIds = standingsList.map(standing => standing.teamid);
            addTeamsToCache(teamIds);
          }
        })
        .catch(err => {
          setError('Failed to fetch data');
          console.error('Error:', err);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setPlayers([]);
      setYouth([]);
      setStandings([]);
      setTrainingReport(null);
      setStaff(null);
      setFacilities(null);
    }
  }, [teamId, memberKey, addTeamsToCache, cachedTeams]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc'); // Always start with descending order for new fields
    }
  };

  const handleStandingsSort = (field) => {
    if (standingsSortField === field) {
      setStandingsSortDirection(standingsSortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setStandingsSortField(field);
      setStandingsSortDirection('desc');
    }
  };

  const sortedPlayers = [...players].sort((a, b) => {
    let aValue = a[sortField];
    let bValue = b[sortField];
    
    if (['age', 'csr', 'energy', 'jersey', 'salary', 'height', 'weight', 'form', 'leadership', 'stamina', 'handling', 'attack', 'defense', 'technique', 'strength', 'jumping', 'speed', 'agility', 'kicking'].includes(sortField)) {
      aValue = Number(aValue);
      bValue = Number(bValue);
    }
    
    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const sortedYouth = [...youth].sort((a, b) => {
    let aValue = a[sortField];
    let bValue = b[sortField];
    
    // For CSR, we need to calculate it since it's not stored directly
    if (sortField === 'csr') {
      const calculateCSR = (player) => {
        const pow = (value) => Math.pow(value - 1, 3.79);
        return (
          pow(player.stamina) +
          pow(player.handling) +
          pow(player.attack) +
          pow(player.defense) +
          pow(player.technique) +
          pow(player.strength) +
          pow(player.speed) +
          pow(player.jumping) +
          pow(player.agility) +
          pow(player.kicking)
        );
      };
      
      aValue = calculateCSR(a);
      bValue = calculateCSR(b);
    }
    else if (['age', 'energy', 'jersey', 'stamina', 'handling', 'attack', 'defense', 'technique', 'strength', 'jumping', 'speed', 'agility', 'kicking'].includes(sortField)) {
      aValue = Number(aValue);
      bValue = Number(bValue);
    }
    
    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const sortedStandings = [...standings].sort((a, b) => {
    const teamA = cachedTeams[a.teamid];
    const teamB = cachedTeams[b.teamid];
    
    let aValue, bValue;
    
    switch (standingsSortField) {
      case 'team':
        aValue = teamA?.name || a.teamid;
        bValue = teamB?.name || b.teamid;
        break;
      case 'average_csr':
        aValue = Number(teamA?.average_top15_csr || 0);
        bValue = Number(teamB?.average_top15_csr || 0);
        break;
      case 'ranking_points':
        aValue = Number(teamA?.ranking_points || 0);
        bValue = Number(teamB?.ranking_points || 0);
        break;
      case 'national_rank':
        aValue = Number(teamA?.national_rank || 999999);
        bValue = Number(teamB?.national_rank || 999999);
        break;
      case 'world_rank':
        aValue = Number(teamA?.world_rank || 999999);
        bValue = Number(teamB?.world_rank || 999999);
        break;
      default:
        aValue = Number(a[standingsSortField] || 0);
        bValue = Number(b[standingsSortField] || 0);
    }
    
    if (aValue < bValue) return standingsSortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return standingsSortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const getNationality = (player) => {
    let nat = player.nationality;
    if (player.capped_for && player.capped_for === player.nationality) { nat += '*'; }
    if (player.dualnationality) { nat += `/${player.dualnationality}`; }
    if (player.capped_for && player.capped_for === player.dualnationality) {
      nat += '*';
    }
    return nat;
  }

  const exportToExcel = () => {
    const exportData = sortedPlayers.map(player => ({
      Jersey: player.jersey !== "255" ? player.jersey : "",
      'First Name': player.fname,
      'Last Name': player.lname,
      Age: Number(player.age),
      CSR: Number(player.csr),
      Energy: Number(player.energy),
      Form: Number(player.form),
      Leadership: Number(player.leadership),
      Experience: Number(player.experience),
      Height: Number(player.height),
      Weight: Number(player.weight),
      Nationality: getNationality(player),
      Salary: Number(player.salary),
      Stamina: Number(player.stamina),
      Handling: Number(player.handling),
      Attack: Number(player.attack),
      Defense: Number(player.defense),
      Technique: Number(player.technique),
      Strength: Number(player.strength),
      Jumping: Number(player.jumping),
      Speed: Number(player.speed),
      Agility: Number(player.agility),
      Kicking: Number(player.kicking)
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Players");
    XLSX.writeFile(wb, "players.xlsx");
  };

  const exportStandingsToExcel = () => {
    const exportData = sortedStandings.map(standing => {
      const team = cachedTeams[standing.teamid];
      return standingsView === 'standings' ? {
        Team: team ? team.name : `Team ${standing.teamid}`,
        Played: standing.played,
        Won: standing.w,
        Drawn: standing.d,
        Lost: standing.l,
        'Points For': standing.for,
        'Points Against': standing.against,
        'Bonus (Loss)': standing.b1,
        'Bonus (Tries)': standing.b2,
        Points: standing.points
      } : {
        Team: team ? team.name : `Team ${standing.teamid}`,
        'Average CSR': team?.average_top15_csr || 'N/A',
        'Ranking Points': team?.ranking_points || 'N/A',
        'National Rank': team?.national_rank || 'N/A',
        'World Rank': team?.world_rank || 'N/A'
      };
    });

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, standingsView === 'standings' ? "Standings" : "Rankings");
    XLSX.writeFile(wb, `${standingsView}.xlsx`);
  };

  const teamAverages = calculateTeamAverages(sortedPlayers);

  return (
    <TeamContext.Provider value={{
      teamId,
      setTeamId,
      players: sortedPlayers,
      youth: sortedYouth,
      standings: sortedStandings,
      trainingReport,
      staff,
      facilities,
      loading,
      error,
      sortField,
      sortDirection,
      handleSort,
      sortOptions: SORT_OPTIONS,
      exportToExcel,
      exportStandingsToExcel,
      standingsView,
      setStandingsView,
      playersView,
      setPlayersView,
      standingsSortField,
      standingsSortDirection,
      handleStandingsSort,
      teamAverages
    }}>
      {children}
    </TeamContext.Provider>
  );
}

TeamProvider.propTypes = {
  children: PropTypes.node.isRequired
};
