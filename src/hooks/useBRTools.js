import { useContext } from 'react';
import { BRToolsContext } from '../context/BRToolsContext';

export function useBRTools() {
  const context = useContext(BRToolsContext);
  if (!context) {
    throw new Error('useBRTools must be used within a BRToolsProvider');
  }
  return context;
}
