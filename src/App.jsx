import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { BRToolsProvider } from './context/BRToolsContext';
import { TeamProvider } from './context/TeamContext';
import LandingPage from './pages/LandingPage';
import HomePage from './pages/HomePage';
import StadiumCalculator from './pages/StadiumCalculator';
import TeamDetails from './pages/TeamDetails';
import SettingsPage from './pages/SettingsPage';

function App() {
  return (
    <BRToolsProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/stadium-calculator" element={<StadiumCalculator />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route
            path="/team/:teamId/*"
            element={
              <TeamProvider>
                <TeamDetails />
              </TeamProvider>
            }
          />
        </Routes>
      </Router>
    </BRToolsProvider>
  );
}

export default App