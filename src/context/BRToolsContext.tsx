import { createContext, useState, useEffect, useCallback, useRef, ReactNode } from 'react';
import { debounce } from '../utils/debounce';
import { API_BASE_URL } from '../config/api';
import { Team } from '../types';

interface BRToolsContextType {
  memberKey: string;
  setMemberKey: (key: string) => void;
  teams: Team[];
  loading: boolean;
  error: string | null;
  cachedTeams: Record<string | number, Team>;
  addTeamsToCache: (teamIds: (string | number)[]) => void;
  getTeamById: (teamId: string | number) => Team | undefined;
  getTeam: (ids: string | number | (string | number)[]) => Team | Team[] | undefined;
}

export const BRToolsContext = createContext<BRToolsContextType | undefined>(undefined);

interface BRToolsProviderProps {
  children: ReactNode;
}

export function BRToolsProvider({ children }: BRToolsProviderProps) {
  
  const [memberKey, setMemberKey] = useState<string>(() => {
    const saved = localStorage.getItem('brtools-member-key');
    return saved || '';
  });

  const [teams, setTeams] = useState<Team[]>([]);
  const [cachedTeams, setCachedTeams] = useState<Record<string | number, Team>>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTeams = useCallback(async (teamIds: (string | number)[]) => {
    try {
      const response = await fetch(`${API_BASE_URL}/teams/${teamIds.join(',')}`, {
        headers: { 'accesskey': memberKey }
      });
      const data = await response.json();
      
      if (data.data?.status === 'Ok' && data.data?.teams) {
        const newTeams = Object.values(data.data.teams) as Team[];
        setCachedTeams(prev => ({
          ...prev,
          ...newTeams.reduce((acc, team) => ({ ...acc, [team.id]: team }), {} as Record<string | number, Team>)
        }));
      }
    } catch (err) {
      console.error('Error fetching teams:', err);
    }
  }, [memberKey]);

  const addTeamsToCache = useCallback((teamIds: (string | number)[]) => {
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
            const teamsList = Object.values(data.data.teams) as Team[];
            setTeams(teamsList);
            // Add my teams to cache
            setCachedTeams(prev => ({
              ...prev,
              ...teamsList.reduce((acc, team) => ({ ...acc, [team.id]: team }), {} as Record<string | number, Team>)
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

  const getTeamById = (teamId: string | number): Team | undefined => {
    const team = cachedTeams[teamId];
    if (team) {
      return team;
    }
    getTeam(teamId);
    return undefined;
  };

  // Use a ref to store pending team IDs to avoid dependency issues with debounce
  const pendingTeamIdsRef = useRef<Set<string | number>>(new Set());

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

  const getTeam = (ids: string | number | (string | number)[]): Team | Team[] | undefined => {
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
