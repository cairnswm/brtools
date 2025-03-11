import React, { useEffect } from "react";
import { useFixtures } from "../context/FixtureContext";
import Team from "../components/team";
import BRDate from "../components/brdate";

const TeamFixtures = () => {
  const { fixtures } = useFixtures();

  console.log("fixtures", fixtures);

  return (
    <div className="min-h-screen bg-gray-100">
      {fixtures &&
        fixtures.map((item) => {
          console.log("item", item);
          const homeStyle = Number(item.matchSummary.home.points) > Number(item.matchSummary.guest.points) ? { fontWeight: "bold" } : {};
          const guestStyle = Number(item.matchSummary.guest.points) > Number(item.matchSummary.home.points) ? { fontWeight: "bold" } : {};
          return (
            <div key={item.id} style={{borderTop: "1px solid black", padding: "10px"}}>
              <div>Fixture ID: {item.id}</div>
              <div>
                <BRDate season={item.season} round={item.round} date={item.matchstart}  /> <Team style={homeStyle} id={item.hometeamid} /> {item.matchSummary.home.points} vs {item.matchSummary.guest.points} <Team style={guestStyle} id={item.guestteamid} />
              </div>
            </div>
          );
        })}
    </div>
  );
};

export default TeamFixtures;
