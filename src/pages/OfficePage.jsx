import { useEffect } from "react";
import { useTeam } from "../hooks/useTeam";
import { useBRTools } from "../hooks/useBRTools";
import { accessElf } from "../components/accessElf";

const OfficePage = () => {
  const { teamId, team, players } = useTeam();
  const { getTeamById } = useBRTools();

  useEffect(() => {
    if (teamId) {
      accessElf.track("Team/Office", teamId);
    }
  }, [teamId]);

  const teamData = team || getTeamById(teamId);

  const getTopPlayers = () => {
    return [...players]
      .sort((a, b) => Number(b.csr) - Number(a.csr))
      .slice(0, 3);
  };

  const topPlayers = getTopPlayers();

  const stats = [
    { label: "Squad Size", value: players.length },
    { label: "Average Age", value: (players.reduce((sum, p) => sum + Number(p.age), 0) / players.length).toFixed(1) },
    { label: "Average CSR", value: Math.round(players.reduce((sum, p) => sum + Number(p.csr), 0) / players.length) },
    { label: "Total Salary", value: `$${(players.reduce((sum, p) => sum + Number(p.salary), 0)).toLocaleString()}` }
  ];

  return (
    <div className="space-y-8">
      <div className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 rounded-2xl shadow-2xl overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/2834917/pexels-photo-2834917.jpeg?auto=compress&cs=tinysrgb&w=1920')] bg-cover bg-center opacity-20"></div>

        <div className="relative z-10 px-8 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block mb-6 px-6 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
              <span className="text-white/90 text-sm font-medium uppercase tracking-wider">
                Official Club Headquarters
              </span>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 tracking-tight">
              {teamData?.name || "Team Office"}
            </h1>

            <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
              Excellence in Rugby. Tradition. Victory.
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <button className="px-8 py-3 bg-white text-blue-900 font-semibold rounded-lg hover:bg-blue-50 transition-all transform hover:scale-105 shadow-lg">
                Club History
              </button>
              <button className="px-8 py-3 bg-blue-600/80 backdrop-blur-sm text-white font-semibold rounded-lg hover:bg-blue-700 transition-all transform hover:scale-105 border border-white/20">
                Latest News
              </button>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-100 to-transparent"></div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-shadow">
            <div className="text-3xl font-bold text-blue-900 mb-2">{stat.value}</div>
            <div className="text-sm text-gray-600 uppercase tracking-wide">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6">
          <h2 className="text-2xl font-bold text-white">Star Players</h2>
          <p className="text-blue-100 text-sm mt-1">Our top performers this season</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 p-8">
          {topPlayers.map((player, index) => (
            <div key={player.id} className="relative group">
              <div className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg z-10">
                {index + 1}
              </div>

              <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 border-2 border-gray-200 hover:border-blue-400 transition-all transform group-hover:scale-105 group-hover:shadow-xl">
                <div className="text-center mb-4">
                  <div className="w-20 h-20 mx-auto mb-3 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                    {player.jersey}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">
                    {player.fname} {player.lname}
                  </h3>
                  <p className="text-sm text-gray-600 capitalize">{player.position}</p>
                </div>

                <div className="space-y-2 pt-4 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">CSR</span>
                    <span className="font-bold text-blue-900">{player.csr}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Age</span>
                    <span className="font-semibold text-gray-700">{player.age}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Form</span>
                    <span className="font-semibold text-gray-700">{player.form}%</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="relative h-48 bg-gradient-to-br from-green-500 to-emerald-600">
            <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/3621104/pexels-photo-3621104.jpeg?auto=compress&cs=tinysrgb&w=800')] bg-cover bg-center opacity-30"></div>
            <div className="relative z-10 p-6 h-full flex flex-col justify-end">
              <h3 className="text-2xl font-bold text-white mb-2">Training Facilities</h3>
              <p className="text-white/90 text-sm">World-class facilities for peak performance</p>
            </div>
          </div>
          <div className="p-6">
            <ul className="space-y-3">
              <li className="flex items-center text-gray-700">
                <svg className="w-5 h-5 mr-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Professional training pitch
              </li>
              <li className="flex items-center text-gray-700">
                <svg className="w-5 h-5 mr-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                State-of-the-art gym
              </li>
              <li className="flex items-center text-gray-700">
                <svg className="w-5 h-5 mr-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Medical & recovery center
              </li>
            </ul>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="relative h-48 bg-gradient-to-br from-blue-500 to-blue-700">
            <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/1884574/pexels-photo-1884574.jpeg?auto=compress&cs=tinysrgb&w=800')] bg-cover bg-center opacity-30"></div>
            <div className="relative z-10 p-6 h-full flex flex-col justify-end">
              <h3 className="text-2xl font-bold text-white mb-2">Club Stadium</h3>
              <p className="text-white/90 text-sm">Home of champions and unforgettable moments</p>
            </div>
          </div>
          <div className="p-6">
            <ul className="space-y-3">
              <li className="flex items-center text-gray-700">
                <svg className="w-5 h-5 mr-3 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Premium seating options
              </li>
              <li className="flex items-center text-gray-700">
                <svg className="w-5 h-5 mr-3 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Corporate hospitality suites
              </li>
              <li className="flex items-center text-gray-700">
                <svg className="w-5 h-5 mr-3 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Fan experience zones
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl shadow-xl overflow-hidden">
        <div className="p-8 md:p-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Join the Legacy
          </h2>
          <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
            Be part of our journey. Support your team and become a member today.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button className="px-8 py-4 bg-white text-blue-900 font-bold rounded-lg hover:bg-gray-100 transition-all transform hover:scale-105 shadow-lg">
              Become a Member
            </button>
            <button className="px-8 py-4 bg-blue-800/50 backdrop-blur-sm text-white font-bold rounded-lg hover:bg-blue-800 transition-all transform hover:scale-105 border-2 border-white/30">
              View Packages
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfficePage;
