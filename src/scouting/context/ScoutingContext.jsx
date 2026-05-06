import { createContext, useState } from 'react';
import { API_BASE_URL } from '../../config/api';

export const ScoutingContext = createContext();

export const ScoutingProvider = ({ children }) => {
  const [filters, setFilters] = useState({
    nationality: '',
    cappedFor: false,
    orUncapped: true,
    ageMin: '',
    ageMax: '',
    heightMin: '',
    heightMax: '',
    weightMin: '',
    weightMax: '',
    playerType: 'senior',
    sortBy: '',
    sortDir: 'desc'
  });

  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [isFormCollapsed, setIsFormCollapsed] = useState(false);
  const [totalLoaded, setTotalLoaded] = useState(0);

  const buildSearchUrl = (start = 0) => {
    const endpoint = filters.playerType === 'senior' ? 'players' : 'yaplayers';
    const params = new URLSearchParams();

    if (filters.nationality) params.append('nationality', filters.nationality);
    if (filters.ageMin) params.append('min_age', filters.ageMin);
    if (filters.ageMax) params.append('max_age', filters.ageMax);
    if (filters.heightMin) params.append('min_height', filters.heightMin);
    if (filters.heightMax) params.append('max_height', filters.heightMax);
    if (filters.weightMin) params.append('min_weight', filters.weightMin);
    if (filters.weightMax) params.append('max_weight', filters.weightMax);
    params.append('start', start);

    // Add sortby only if it's not the default (csr for senior, stars for junior)
    const defaultSort = filters.playerType === 'senior' ? 'csr' : 'stars';
    if (filters.sortBy && filters.sortBy !== defaultSort) {
      params.append('sortby', filters.sortBy);
    }

    if (filters.sortDir) {
      params.append('sortdir', filters.sortDir);
    }

    return `${API_BASE_URL}/scouting/${endpoint}?${params.toString()}`;
  };

  const fetchSearchResults = async (start = 0) => {
    setIsLoading(true);
    setError(null);

    try {
      const url = buildSearchUrl(start);
      const response = await fetch(url, {
        headers: {
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch scouting data');
      }

      const result = await response.json();

      if (start === 0) {
        setSearchResults(result.data || []);
        setTotalLoaded(result.data?.length || 0);
      } else {
        setSearchResults(prev => [...prev, ...(result.data || [])]);
        setTotalLoaded(prev => prev + (result.data?.length || 0));
      }

      setHasSearched(true);
      setIsFormCollapsed(true);
    } catch (err) {
      setError(err.message);
      console.error('Search error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchNextPage = async () => {
    await fetchSearchResults(totalLoaded);
  };

  const updateFilters = (newFilters) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters
    }));
  };

  const resetSearch = () => {
    setFilters({
      nationality: '',
      cappedFor: false,
      orUncapped: true,
      ageMin: '',
      ageMax: '',
      heightMin: '',
      heightMax: '',
      weightMin: '',
      weightMax: '',
      playerType: 'senior',
      sortBy: '',
      sortDir: 'desc'
    });
    setSearchResults([]);
    setHasSearched(false);
    setIsFormCollapsed(false);
    setError(null);
    setTotalLoaded(0);
  };

  const toggleFormCollapse = () => {
    setIsFormCollapsed(prev => !prev);
  };

  const filteredResults = (() => {
    if (!filters.cappedFor || !filters.nationality) return searchResults;

    return searchResults.filter(player => {
      const cappedMatch = player.capped_for === filters.nationality;
      const uncappedMatch = filters.orUncapped && !player.capped_for;
      return cappedMatch || uncappedMatch;
    });
  })();

  const value = {
    filters,
    updateFilters,
    searchResults: filteredResults,
    isLoading,
    error,
    hasSearched,
    isFormCollapsed,
    totalLoaded,
    fetchSearchResults,
    fetchNextPage,
    resetSearch,
    toggleFormCollapse
  };

  return (
    <ScoutingContext.Provider value={value}>
      {children}
    </ScoutingContext.Provider>
  );
};
