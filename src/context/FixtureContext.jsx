import { createContext, useContext, useState, useEffect } from 'react';
import { useBRTools } from './BRToolsContext';
import { useTeam } from './TeamContext';

const FixtureContext = createContext();

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
          `http://localhost/blackoutrugby.brexport/api/api.php/fixtures/${teamId}`,
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

export const useFixtures = () => {
  const context = useContext(FixtureContext);
  if (!context) {
    throw new Error('useFixtures must be used within a FixtureProvider');
  }
  return context;
};
