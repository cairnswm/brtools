import { createContext, useState, useEffect } from 'react';
import { useBRTools } from '../hooks/useBRTools';
import { useTeam } from '../hooks/useTeam';
import { API_BASE_URL } from '../config/api';

export const FixtureContext = createContext();

export const FixtureProvider = ({ children }) => {
  const [fixtures, setFixtures] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { memberKey } = useBRTools();
  const { teamId } = useTeam();

  useEffect(() => {
    const fetchFixtures = async () => {
      if (!teamId || !memberKey) return;

      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `${API_BASE_URL}/fixtures/${teamId}`,
          {
            headers: {
              'accesskey': memberKey
            }
          }
        );
        const data = await response.json();
        console.log("Fixtures Data", data);
        if (data.data?.status === 'Ok' && data.data?.fixtures) {
          setFixtures(data.data.fixtures);
        } else {
          throw new Error('Invalid response from server');
        }
      } catch (err) {
        setError('Failed to fetch fixtures');
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFixtures();
  }, [teamId, memberKey]);

  return (
    <FixtureContext.Provider
      value={{
        fixtures,
        loading,
        error,
      }}
    >
      {children}
    </FixtureContext.Provider>
  );
};
