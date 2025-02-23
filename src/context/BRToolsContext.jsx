import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { debounce } from '../utils/debounce';

const BRToolsContext = createContext();

BRToolsProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export function BRToolsProvider({ children }) {
  
  const [memberKey, setMemberKey] = useState(() => {
    const saved = localStorage.getItem('brtools-member-key');
    return saved || '';
  });

  const [teams, setTeams] = useState([]);
  const [cachedTeams, setCachedTeams] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTeams = useCallback(debounce(async (teamIds) => {
    try {
      const response = await fetch(`https://thegamedeveloper.co.za/brexport/api/api.php/teams/${teamIds.join(',')}`, {
        headers: { 'accesskey': memberKey }
      });
      const data = await response.json();
      
      if (data.data?.status === 'Ok' && data.data?.teams) {
        const newTeams = Object.values(data.data.teams);
        setCachedTeams(prev => ({
          ...prev,
          ...newTeams.reduce((acc, team) => ({ ...acc, [team.id]: team }), {})
        }));
      }
    } catch (err) {
      console.error('Error fetching teams:', err);
    }
  }, 100), [memberKey]);

  const addTeamsToCache = useCallback((teamIds) => {
    const uncachedTeamIds = teamIds.filter(id => !cachedTeams[id]);
    if (uncachedTeamIds.length > 0) {
      fetchTeams(uncachedTeamIds);
    }
  }, [cachedTeams, fetchTeams]);

  useEffect(() => {
    localStorage.setItem('brtools-member-key', memberKey);
    
    if (memberKey) {
      setLoading(true);
      setError(null);
      
      fetch('https://thegamedeveloper.co.za/brexport/api/api.php/mydata/teams', {
        headers: {
          'accesskey': memberKey
        }
      })
        .then(response => response.json())
        .then(data => {
          if (data.data?.status === 'Ok' && data.data?.teams) {
            const teamsList = Object.values(data.data.teams);
            setTeams(teamsList);
            // Add my teams to cache
            setCachedTeams(prev => ({
              ...prev,
              ...teamsList.reduce((acc, team) => ({ ...acc, [team.id]: team }), {})
            }));
          } else {
            setError('Invalid response from server');
          }
        })
        .catch(err => {
          const errorMessage = 'Failed to fetch team data';
          setError(errorMessage);
          console.error('Error fetching teams:', err);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setTeams([]);
    }
  }, [memberKey]);

  return (
    <BRToolsContext.Provider value={{ 
      memberKey, 
      setMemberKey, 
      teams, 
      loading, 
      error,
      cachedTeams,
      addTeamsToCache
    }}>
      {children}
    </BRToolsContext.Provider>
  );
}

export function useBRTools() {
  const context = useContext(BRToolsContext);
  if (!context) {
    throw new Error('useBRTools must be used within a BRToolsProvider');
  }
  return context;
}
