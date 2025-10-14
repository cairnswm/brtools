import { useFixtures } from "../hooks/useFixtures";

const TeamFixturesPage = () => {
  const { fixtures, loading, error } = useFixtures();

  if (loading) {
    return <div className="text-center py-8">Loading fixtures...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-600">{error}</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Team Fixtures</h2>
      {fixtures.length === 0 ? (
        <p className="text-gray-600">No fixtures found</p>
      ) : (
        <div className="space-y-4">
          {fixtures.map((fixture) => (
            <div key={fixture.id} className="bg-white p-4 rounded shadow">
              <p>Fixture ID: {fixture.id}</p>
              {/* Add more fixture details here */}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TeamFixturesPage;
