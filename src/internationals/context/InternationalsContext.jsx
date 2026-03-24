import { createContext, useState, useEffect } from 'react';
import { useBRTools } from '../../hooks/useBRTools';
import PropTypes from 'prop-types';
import { API_BASE_URL } from '../../config/api';

export const InternationalsContext = createContext();

export function InternationalsProvider({ children }) {
  const [internationals, setInternationalsData] = useState([]);
  const [activeInternationalId, setActiveInternationalId] = useState(null);
  const [activeInternational, setActiveInternational] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const { memberKey, addTeamsToCache } = useBRTools();

  useEffect(() => {
    if (memberKey) {
      fetchInternationalsData();
    }
  }, [memberKey]);

  useEffect(() => {
    if (activeInternationalId && internationals.length > 0) {
      const international = internationals.find(t => t.id === activeInternationalId);
      setActiveInternational(international || null);
    } else {
      setActiveInternational(null);
    }
  }, [activeInternationalId, internationals]);

  const fetchInternationalsData = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/teams/internationals`, {
        headers: {
          'accesskey': memberKey
        }
      });

      const data = await response.json();

      if (data.data?.status === 'Ok') {
        const allInternationalsData = [
          ...(data.data.a ? Object.values(data.data.a) : []),
          ...(data.data.u20 ? Object.values(data.data.u20) : [])
        ];

        setInternationalsData(allInternationalsData);

        const teamIds = allInternationalsData.map(team => team.id);
        addTeamsToCache(teamIds);
      } else {
        throw new Error('Invalid response from server');
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

  const sortedInternationalsData = [...internationals].sort((a, b) => {
    let aValue = a[sortField];
    let bValue = b[sortField];

    if (['average_top15_csr', 'ranking_points', 'world_rank', 'national_rank'].includes(sortField)) {
      aValue = Number(aValue) || 0;
      bValue = Number(bValue) || 0;
    }

    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  return (
    <InternationalsContext.Provider value={{
      internationals: sortedInternationalsData,
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
