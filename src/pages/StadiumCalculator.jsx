import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useBRTools } from '../context/BRToolsContext';
import Header from '../components/Header';

function StadiumCalculator() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { teams } = useBRTools();
  const [selectedTeam, setSelectedTeam] = useState('');
  const [members, setMembers] = useState(() => {
    const saved = localStorage.getItem('brtools-members');
    return saved ? saved : '';
  });

  const [currentStadium, setCurrentStadium] = useState(() => {
    const saved = localStorage.getItem('brtools-current-stadium');
    return saved ? JSON.parse(saved) : {
      standing: 0,
      uncovered: 0,
      covered: 0,
      members: 0,
      corporate: 0
    };
  });

  useEffect(() => {
    const teamId = searchParams.get('team');
    if (teamId) {
      setSelectedTeam(teamId);
    }
  }, [searchParams]);

  useEffect(() => {
    localStorage.setItem('brtools-members', members);
  }, [members]);

  useEffect(() => {
    localStorage.setItem('brtools-current-stadium', JSON.stringify(currentStadium));
  }, [currentStadium]);

  useEffect(() => {
    if (selectedTeam) {
      const team = teams.find(t => t.id === selectedTeam);
      if (team) {
        setMembers(team.members || '');
        setCurrentStadium({
          standing: parseInt(team.stadium_standing) || 0,
          uncovered: parseInt(team.stadium_uncovered) || 0,
          covered: parseInt(team.stadium_covered) || 0,
          members: parseInt(team.stadium_members) || 0,
          corporate: parseInt(team.stadium_corporate) || 0
        });
      }
    }
  }, [selectedTeam, teams]);

  const calculateStadium = (baseNumber) => {
    const total = members * baseNumber;
    return {
      standing: Math.round(total * 0.22),
      uncovered: Math.round(total * 0.39),
      covered: Math.round(total * 0.30),
      members: Math.round(total * 0.08),
      corporate: Math.round(total * 0.01)
    };
  };

  const handleCurrentStadiumChange = (type, value) => {
    setCurrentStadium(prev => ({
      ...prev,
      [type]: parseInt(value) || 0
    }));
  };

  const calculateDifference = (target, current) => {
    const diff = target - current;
    return diff > 0 ? (
      <span className="text-red-600 ms-2">({diff})</span>
    ) : null;
  };

  const calculateTotal = (stadium) => {
    return Object.values(stadium).reduce((sum, value) => sum + value, 0);
  };

  const smallStadium = members ? calculateStadium(8.5) : null;
  const largeStadium = members ? calculateStadium(9.5) : null;
  
  const currentTotal = calculateTotal(currentStadium);
  const smallStadiumTotal = smallStadium ? calculateTotal(smallStadium) : null;
  const largeStadiumTotal = largeStadium ? calculateTotal(largeStadium) : null;

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Stadium Calculator</h1>
          <button
            onClick={() => navigate('/home')}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back
          </button>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="mb-4">
            <label htmlFor="team" className="block text-sm font-medium text-gray-700 mb-2">
              Select Team
            </label>
            <select
              id="team"
              value={selectedTeam}
              onChange={(e) => setSelectedTeam(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a team</option>
              {teams.map((team) => (
                <option key={team.id} value={team.id}>
                  {team.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label htmlFor="members" className="block text-sm font-medium text-gray-700 mb-2">
              Members
            </label>
            <input
              type="number"
              id="members"
              value={members}
              onChange={(e) => setMembers(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter number of members"
            />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left">Section</th>
                  <th className="px-4 py-2 text-right">Current Stadium</th>
                  <th className="px-4 py-2 text-right">Small Stadium (x8.5)</th>
                  <th className="px-4 py-2 text-right">Large Stadium (x9.5)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="px-4 py-2 border-t">Standing (22%)</td>
                  <td className="px-4 py-2 border-t text-right">
                    <input
                      type="number"
                      value={currentStadium.standing}
                      onChange={(e) => handleCurrentStadiumChange('standing', e.target.value)}
                      className="w-24 px-2 py-1 border border-gray-300 rounded-md text-right"
                    />
                  </td>
                  <td className="px-4 py-2 border-t text-right">
                    {smallStadium?.standing}
                    {smallStadium && calculateDifference(smallStadium.standing, currentStadium.standing)}
                  </td>
                  <td className="px-4 py-2 border-t text-right">
                    {largeStadium?.standing}
                    {largeStadium && calculateDifference(largeStadium.standing, currentStadium.standing)}
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-2 border-t">Uncovered (39%)</td>
                  <td className="px-4 py-2 border-t text-right">
                    <input
                      type="number"
                      value={currentStadium.uncovered}
                      onChange={(e) => handleCurrentStadiumChange('uncovered', e.target.value)}
                      className="w-24 px-2 py-1 border border-gray-300 rounded-md text-right"
                    />
                  </td>
                  <td className="px-4 py-2 border-t text-right">
                    {smallStadium?.uncovered}
                    {smallStadium && calculateDifference(smallStadium.uncovered, currentStadium.uncovered)}
                  </td>
                  <td className="px-4 py-2 border-t text-right">
                    {largeStadium?.uncovered}
                    {largeStadium && calculateDifference(largeStadium.uncovered, currentStadium.uncovered)}
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-2 border-t">Covered (30%)</td>
                  <td className="px-4 py-2 border-t text-right">
                    <input
                      type="number"
                      value={currentStadium.covered}
                      onChange={(e) => handleCurrentStadiumChange('covered', e.target.value)}
                      className="w-24 px-2 py-1 border border-gray-300 rounded-md text-right"
                    />
                  </td>
                  <td className="px-4 py-2 border-t text-right">
                    {smallStadium?.covered}
                    {smallStadium && calculateDifference(smallStadium.covered, currentStadium.covered)}
                  </td>
                  <td className="px-4 py-2 border-t text-right">
                    {largeStadium?.covered}
                    {largeStadium && calculateDifference(largeStadium.covered, currentStadium.covered)}
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-2 border-t">Members (8%)</td>
                  <td className="px-4 py-2 border-t text-right">
                    <input
                      type="number"
                      value={currentStadium.members}
                      onChange={(e) => handleCurrentStadiumChange('members', e.target.value)}
                      className="w-24 px-2 py-1 border border-gray-300 rounded-md text-right"
                    />
                  </td>
                  <td className="px-4 py-2 border-t text-right">
                    {smallStadium?.members}
                    {smallStadium && calculateDifference(smallStadium.members, currentStadium.members)}
                  </td>
                  <td className="px-4 py-2 border-t text-right">
                    {largeStadium?.members}
                    {largeStadium && calculateDifference(largeStadium.members, currentStadium.members)}
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-2 border-t">Corporate (1%)</td>
                  <td className="px-4 py-2 border-t text-right">
                    <input
                      type="number"
                      value={currentStadium.corporate}
                      onChange={(e) => handleCurrentStadiumChange('corporate', e.target.value)}
                      className="w-24 px-2 py-1 border border-gray-300 rounded-md text-right"
                    />
                  </td>
                  <td className="px-4 py-2 border-t text-right">
                    {smallStadium?.corporate}
                    {smallStadium && calculateDifference(smallStadium.corporate, currentStadium.corporate)}
                  </td>
                  <td className="px-4 py-2 border-t text-right">
                    {largeStadium?.corporate}
                    {largeStadium && calculateDifference(largeStadium.corporate, currentStadium.corporate)}
                  </td>
                </tr>
                <tr className="font-bold">
                  <td className="px-4 py-2 border-t">Total Seats</td>
                  <td className="px-4 py-2 border-t text-right">{currentTotal}</td>
                  <td className="px-4 py-2 border-t text-right">
                    {smallStadiumTotal}
                    {smallStadiumTotal && calculateDifference(smallStadiumTotal, currentTotal)}
                  </td>
                  <td className="px-4 py-2 border-t text-right">
                    {largeStadiumTotal}
                    {largeStadiumTotal && calculateDifference(largeStadiumTotal, currentTotal)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StadiumCalculator;