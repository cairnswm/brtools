import { createContext, useState, useEffect } from 'react';
import { useBRTools } from '../../hooks/useBRTools';
import PropTypes from 'prop-types';
import { API_BASE_URL } from '../../config/api';

export const InternationalsContext = createContext();

export function InternationalsProvider({ children }) {
  const [nationalTeams, setNationalTeams] = useState([]);
  const [u20Teams, setU20Teams] = useState([]);
  const [activeTab, setActiveTab] = useState('national');
  const [activeInternationalId, setActiveInternationalId] = useState(null);
  const [activeInternational, setActiveInternational] = useState(null);
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
    if (activeInternationalId) {
      const allTeams = [...nationalTeams, ...u20Teams];
      const international = allTeams.find(t => t.id === activeInternationalId);
      setActiveInternational(international || null);
    } else {
      setActiveInternational(null);
    }
  }, [activeInternationalId, nationalTeams, u20Teams]);

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

  return (
    <InternationalsContext.Provider value={{
      nationalTeams: sortedNationalTeams,
      u20Teams: sortedU20Teams,
      activeTab,
      setActiveTab,
      activeInternationalId,
      setActiveInternationalId,
      activeInternational,
      loading,
      error,
      sortField,
      sortDirection,
      handleSort,
      refreshInternationalsData: fetchInternationalsData
    }}>
      {children}
    </InternationalsContext.Provider>
  );
}

InternationalsProvider.propTypes = {
  children: PropTypes.node.isRequired
};
