const BRDate = ({ season, round, day, date }) => {
  let formattedDay = day;
  let formattedTime = "";
  
  if (date) {
    const dateObj = new Date(date);
    
    // If day is not supplied, extract it from the date
    if (!formattedDay) {
      const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      formattedDay = days[dateObj.getDay()];
    }
    
    // Format time as HH:MM
    const hours = dateObj.getHours().toString().padStart(2, "0");
    const minutes = dateObj.getMinutes().toString().padStart(2, "0");
    formattedTime = `${hours}:${minutes}`;
  } else {
    // Default values if date is not provided
    if (!formattedDay) {
      formattedDay = "Wed"; // Default day if neither day nor date is provided
    }
    formattedTime = "19:35"; // Default time if date is not provided
  }
  
  return `S${season} R${round} ${formattedDay}, ${formattedTime}`;
}

export default BRDate;
