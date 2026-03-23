import { useContext } from 'react';
import { ImportContext } from '../context/ImportContext';

export function useImport() {
  const context = useContext(ImportContext);

  if (!context) {
    throw new Error('useImport must be used within an ImportProvider');
  }

  return context;
}
