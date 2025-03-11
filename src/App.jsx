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

const App = () => {
  useEffect(() => {
    console.log('[Debug] App.jsx: Component mounted')
    return () => console.log('[Debug] App.jsx: Component unmounted')
  }, [])
  console.log('[Debug] App.jsx: Rendering component')
  return (
    <BRToolsProvider>
      <Router basename="/brtools">
        {console.log('[Debug] App.jsx: Router initialized')}
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
