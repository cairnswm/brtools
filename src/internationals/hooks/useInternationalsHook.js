import { useContext } from 'react';
import { InternationalsContext } from '../context/InternationalsContext';

export const useInternationalsHook = () => {
  const context = useContext(InternationalsContext);

  if (context === undefined) {
    throw new Error('useInternationalsHook must be used within an InternationalsProvider');
  }

  return context;
};
