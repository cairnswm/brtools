import { useContext } from 'react';
import { ScoutingContext } from '../context/ScoutingContext';

export const useScouting = () => {
  const context = useContext(ScoutingContext);

  if (!context) {
    throw new Error('useScouting must be used within a ScoutingProvider');
  }

  return context;
};
