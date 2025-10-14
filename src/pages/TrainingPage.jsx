import { useTeam } from '../context/TeamContext';

const TrainingPage = () => {
  const { trainingReport, loading } = useTeam();

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-gray-600">Loading training report...</div>
      </div>
    );
  }

  if (!trainingReport) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-gray-600">No training report available</div>
      </div>
    );
  }

  const { data } = trainingReport;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Training Report</h2>
          <div className="text-sm text-gray-600">
            Season {data.season} - Round {data.round}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">Squad Overview</h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm text-gray-600">Total Players</div>
                <div className="text-2xl font-bold text-gray-800">{data.total_players}</div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm text-gray-600">Average Age</div>
                <div className="text-2xl font-bold text-gray-800">{data.average_age}</div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm text-gray-600">Average CSR</div>
                <div className="text-2xl font-bold text-gray-800">{data.average_csr}</div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm text-gray-600">Average Fitness</div>
                <div className="text-2xl font-bold text-gray-800">{data.average_fitness}%</div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">Training Summary</h3>

            <div className="space-y-3">
              {data.training_intensity && (
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600">Training Intensity</span>
                  <span className="font-semibold text-gray-800">{data.training_intensity}</span>
                </div>
              )}

              {data.focus_area && (
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600">Focus Area</span>
                  <span className="font-semibold text-gray-800">{data.focus_area}</span>
                </div>
              )}

              {data.morale && (
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600">Team Morale</span>
                  <span className="font-semibold text-gray-800">{data.morale}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {data.notes && (
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="text-sm font-semibold text-blue-800 mb-2">Coach Notes</h3>
            <p className="text-sm text-blue-900">{data.notes}</p>
          </div>
        )}

        {data.injuries && data.injuries.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-700 border-b pb-2 mb-4">Injury Report</h3>
            <div className="space-y-2">
              {data.injuries.map((injury, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-red-50 rounded-lg border border-red-200">
                  <span className="text-sm text-gray-800">{injury.player_name}</span>
                  <span className="text-sm text-red-600">{injury.injury_type} ({injury.weeks_out} weeks)</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrainingPage;
