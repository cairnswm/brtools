import { createContext, useContext, useState } from 'react';
import PropTypes from 'prop-types';

export const ImportContext = createContext();

ImportProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export function ImportProvider({ children }) {
  const [importData, setImportData] = useState(null);
  const [importing, setImporting] = useState(false);
  const [importError, setImportError] = useState(null);

  const importRankings = async (data) => {
    setImporting(true);
    setImportError(null);

    try {
      setImportData(data);
      return { success: true };
    } catch (err) {
      setImportError(err.message);
      return { success: false, error: err.message };
    } finally {
      setImporting(false);
    }
  };

  return (
    <ImportContext.Provider value={{
      importData,
      importing,
      importError,
      importRankings
    }}>
      {children}
    </ImportContext.Provider>
  );
}
