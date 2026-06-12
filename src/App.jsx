import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { BRToolsProvider } from './context/BRToolsContext';
import { TeamProvider } from './context/TeamContext';
import { FixtureProvider } from './context/FixtureContext';
import { ImportProvider } from './context/ImportContext';
import { ScoutingProvider } from './scouting/context/ScoutingContext';
import { InternationalsProvider } from './internationals/context/InternationalsContext';
import LandingPage from './pages/LandingPage';
import HomePage from './pages/HomePage';
import StadiumCalculator from './pages/team/StadiumCalculator';
import TeamDetails from './pages/team/TeamDetails';
import SettingsPage from './pages/SettingsPage';
import ImportPage from './pages/admin/ImportPage';
import ScoutingPage from './pages/scouting/ScoutingPage';
import InternationalsPage from './internationals/pages/InternationalsPage';
import IntTeamDetailPage from './internationals/pages/IntTeamDetailPage';
import IntPlayerDetailPage from './internationals/pages/IntPlayerDetailPage';
import ExportPage from './pages/ExportPage';
import { useEffect } from 'react';
import { accessElf } from './components/accessElf';

accessElf.setApiKey("b415c3e1-b415c3ee-4207-bad2-24ca2f5f4673");

const App = () => {
  useEffect(() => {
    console.log('[Debug] App.jsx: Component mounted')
    return () => console.log('[Debug] App.jsx: Component unmounted')
  }, [])
  accessElf.track();
  console.log('[Debug] App.jsx: Rendering component')
  return (
    <BRToolsProvider>
      <Router basename="/brtools">
        {console.log('[Debug] App.jsx: Router initialized')}
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/stadium-calculator" element={<StadiumCalculator />} />
          <Route
            path="/scouting"
            element={
              <ScoutingProvider>
                <ScoutingPage />
              </ScoutingProvider>
            }
          />
          <Route
            path="/internationals"
            element={
              <InternationalsProvider>
                <InternationalsPage />
              </InternationalsProvider>
            }
          />
          <Route
            path="/internationals/:type/:teamId"
            element={
              <InternationalsProvider>
                <IntTeamDetailPage />
              </InternationalsProvider>
            }
          />
          <Route
            path="/internationals/:type/:teamId/player/:playerId"
            element={
              <InternationalsProvider>
                <IntPlayerDetailPage />
              </InternationalsProvider>
            }
          />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/export" element={<ExportPage />} />
          <Route
            path="/import"
            element={
              <ImportProvider>
                <ImportPage />
              </ImportProvider>
            }
          />
          <Route
            path="/team/:teamId/*"
            element={
              <TeamProvider>
                <FixtureProvider>
                  <TeamDetails />
                </FixtureProvider>
              </TeamProvider>
            }
          />
        </Routes>
      </Router>
    </BRToolsProvider>
  );
}

export default App
