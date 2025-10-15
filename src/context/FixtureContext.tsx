import { createContext, useState, useEffect, ReactNode } from 'react';
import { useBRTools } from '../hooks/useBRTools';
import { useTeam } from '../hooks/useTeam';
import { API_BASE_URL } from '../config/api';
import { Fixture } from '../types';

interface FixtureContextType {
  fixtures: Fixture[];
  loading: boolean;
  error: string | null;
}

export const FixtureContext = createContext<FixtureContextType | undefined>(undefined);

interface FixtureProviderProps {
  children: ReactNode;
}

export const FixtureProvider = ({ children }: FixtureProviderProps) => {
  const [fixtures, setFixtures] = useState<Fixture[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
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
