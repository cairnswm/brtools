import { useContext } from 'react';
import { FixtureContext } from '../context/FixtureContext';

export const useFixtures = () => {
  const context = useContext(FixtureContext);
  if (!context) {
    throw new Error('useFixtures must be used within a FixtureProvider');
  }
  return context;
};
