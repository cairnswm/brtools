import { createContext, useState } from 'react';
import PropTypes from 'prop-types';

export const ImportContext = createContext();

ImportProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export function ImportProvider({ children }) {
  const [rankings, setRankings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalLoaded, setTotalLoaded] = useState(0);
  const [isImporting, setIsImporting] = useState(false);

  const fetchRankings = async () => {
    setLoading(true);
    setError(null);
    setIsImporting(true);
    setRankings([]);
    setTotalLoaded(0);

    const BATCH_SIZE = 100;
    const TOTAL_BATCHES = 20;
    const BASE_URL = 'https://thegamedeveloper.co.za/brexport/api/api.php/rankings';

    try {
      for (let batch = 0; batch < TOTAL_BATCHES; batch++) {
        const start = batch * BATCH_SIZE;
        const url = batch === 0 ? BASE_URL : `${BASE_URL}?start=${start}`;

        const response = await fetch(url, {
          headers: {
            'Accept': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch batch ${batch + 1}: ${response.statusText}`);
        }

        const data = await response.json();

        if (data && Array.isArray(data)) {
          setRankings(prev => [...prev, ...data]);
          setTotalLoaded(prev => prev + data.length);
        } else {
          console.warn(`Batch ${batch + 1} returned unexpected data format`);
        }
      }
    } catch (err) {
      setError(err.message);
      console.error('Error fetching rankings:', err);
    } finally {
      setLoading(false);
      setIsImporting(false);
    }
  };

  return (
    <ImportContext.Provider value={{
      rankings,
      loading,
      error,
      totalLoaded,
      isImporting,
      fetchRankings
    }}>
      {children}
    </ImportContext.Provider>
  );
}
