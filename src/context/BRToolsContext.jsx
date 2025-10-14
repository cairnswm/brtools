import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import PropTypes from 'prop-types';
import { debounce } from '../utils/debounce';
import { API_BASE_URL } from '../config/api';

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

  const fetchTeams = useCallback(async (teamIds) => {
    try {
      const response = await fetch(`${API_BASE_URL}/teams/${teamIds.join(',')}`, {
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
  }, [memberKey]);

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
      
      fetch(`${API_BASE_URL}/mydata/teams`, {
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

  const getTeamById = (teamId) => {
    const team = cachedTeams[teamId];
    if (team) {
      return team;
    }
    getTeam(teamId);
  };

  // Use a ref to store pending team IDs to avoid dependency issues with debounce
  const pendingTeamIdsRef = useRef(new Set());

  // Debounced function to fetch all pending team IDs in a single call
  const debouncedFetchTeams = useCallback(
    debounce(() => {
      if (pendingTeamIdsRef.current.size > 0) {
        const idsToFetch = [...pendingTeamIdsRef.current];
        console.log('Fetching batch of teams:', idsToFetch);
        pendingTeamIdsRef.current = new Set(); // Clear the queue
        addTeamsToCache(idsToFetch);
      }
    }, 300),
    [addTeamsToCache]
  );

  const getTeam = (ids) => {
    const idArray = Array.isArray(ids) ? ids : [ids];
    const uncachedTeamIds = idArray.filter(id => !cachedTeams[id]);

    console.log("uncachedTeamIds", uncachedTeamIds);
    
    if (uncachedTeamIds.length > 0) {
      console.log('Adding uncached team IDs to queue:', uncachedTeamIds);
      // Add IDs to the pending queue
      uncachedTeamIds.forEach(id => pendingTeamIdsRef.current.add(id));
      // Trigger the debounced fetch
      console.log('Triggering debounced fetch', uncachedTeamIds);
      debouncedFetchTeams();
    }
    
    return Array.isArray(ids) 
      ? idArray.map(id => cachedTeams[id]).filter(Boolean)
      : cachedTeams[ids];
  }

  return (
    <BRToolsContext.Provider value={{ 
      memberKey, 
      setMemberKey, 
      teams, 
      loading, 
      error,
      cachedTeams,
      addTeamsToCache,
      getTeamById,
      getTeam
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
