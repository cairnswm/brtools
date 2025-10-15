import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { BRToolsProvider } from './context/BRToolsContext';
import { TeamProvider } from './context/TeamContext';
import { FixtureProvider } from './context/FixtureContext';
import LandingPage from './pages/LandingPage';
import HomePage from './pages/HomePage';
import StadiumCalculator from './pages/StadiumCalculator';
import TeamDetails from './pages/TeamDetails';
import SettingsPage from './pages/SettingsPage';
import { useEffect } from 'react';
import { accessElf } from './components/accessElf';

accessElf.setApiKey("b415c3e1-b415c3ee-4207-bad2-24ca2f5f4673");

const App = () => {
  useEffect(() => {
    console.log('[Debug] App.tsx: Component mounted')
    accessElf.track();
    return () => console.log('[Debug] App.tsx: Component unmounted')
  }, [])
  console.log('[Debug] App.tsx: Rendering component')
  return (
    <BRToolsProvider>
      <Router basename="/brtools">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/stadium-calculator" element={<StadiumCalculator />} />
          <Route path="/settings" element={<SettingsPage />} />
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
