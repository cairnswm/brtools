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
  const [teamsProcessed, setTeamsProcessed] = useState(0);
  const [totalTeamsToProcess, setTotalTeamsToProcess] = useState(0);
  const [isProcessingTeams, setIsProcessingTeams] = useState(false);
  const [lastDataLoad, setLastDataLoad] = useState(null);

  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  const fetchLastDataLoad = async () => {
    try {
      const response = await fetch('http://thegamedeveloper.co.za/brexport/api/api.php/bulk/lastdataload', {
        headers: {
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch last data load');
      }

      const result = await response.json();
      if (result?.data) {
        setLastDataLoad(result.data);
      }
    } catch (err) {
      console.error('Error fetching last data load:', err);
    }
  };

  const fetchRankings = async () => {
    setLoading(true);
    setError(null);
    setIsImporting(true);
    setRankings([]);
    setTotalLoaded(0);
    setTeamsProcessed(0);
    setTotalTeamsToProcess(0);

    const BATCH_SIZE = 100;
    const TOTAL_BATCHES = 20;
    const BASE_URL = 'https://thegamedeveloper.co.za/brexport/api/api.php/rankings';

    const allRankings = [];

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

        const result = await response.json();

        if (result?.data?.status === 'Ok' && result?.data?.rankings) {
          const rankingsArray = Object.values(result.data.rankings);

          allRankings.push(...rankingsArray);
          setRankings(prev => [...prev, ...rankingsArray]);
          setTotalLoaded(prev => prev + rankingsArray.length);
        } else {
          console.warn(`Batch ${batch + 1} returned unexpected data format`, result);
          break;
        }
      }

      setLoading(false);

      const teamsToProcess = allRankings.filter(ranking => ranking.points !== '25');
      setTotalTeamsToProcess(teamsToProcess.length);
      setIsProcessingTeams(true);

      await fetchBulkPlayers(teamsToProcess);

    } catch (err) {
      setError(err.message);
      console.error('Error fetching rankings:', err);
    } finally {
      setLoading(false);
      setIsImporting(false);
      setIsProcessingTeams(false);
    }
  };

  const fetchBulkPlayers = async (teams) => {
    const TEAMS_PER_BATCH = 10;
    const DELAY_MS = 3000;
    const BASE_URL = 'https://thegamedeveloper.co.za/brexport/api/api.php/bulk';

    try {
      for (let i = 0; i < teams.length; i += TEAMS_PER_BATCH) {
        const batch = teams.slice(i, i + TEAMS_PER_BATCH);
        const teamIds = batch.map(team => team.id).join(',');

        const response = await fetch(`${BASE_URL}/${teamIds}`, {
          headers: {
            'Accept': 'application/json'
          }
        });

        if (response.ok) {
          const data = await response.json();
          console.log(`Processed teams ${i + 1} to ${Math.min(i + TEAMS_PER_BATCH, teams.length)}`, data);
        } else {
          console.warn(`Failed to fetch bulk data for batch starting at ${i + 1}`);
        }

        setTeamsProcessed(prev => prev + batch.length);

        if (i + TEAMS_PER_BATCH < teams.length) {
          await sleep(DELAY_MS);
        }
      }
    } catch (err) {
      console.error('Error fetching bulk player data:', err);
    }
  };

  return (
    <ImportContext.Provider value={{
      rankings,
      loading,
      error,
      totalLoaded,
      isImporting,
      fetchRankings,
      teamsProcessed,
      totalTeamsToProcess,
      isProcessingTeams,
      lastDataLoad,
      fetchLastDataLoad
    }}>
      {children}
    </ImportContext.Provider>
  );
}
