import React from "react";
import { useBRTools } from "../context/BRToolsContext";

const Team = ({ id, field = "name", style }) => {
   const { getTeamById } = useBRTools();
 
   const team = getTeamById(id);

   if (team) {
       return <span style={style}>{team[field]}</span>
   }
   return <span>{id}</span>;
}

export default Team;