export const formatDuration = (minutes) => {
  const hours = Math.floor(minutes / 60);
  const restMinutes = minutes % 60;

  if (hours === 0) {
    return `${restMinutes}'`;
  } else if (restMinutes === 0) {
    return `${hours}h`;
  } else {
    return `${hours}h ${restMinutes}'`;
  }
};
