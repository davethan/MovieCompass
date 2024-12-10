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

export const convertToNumber = (input) => {
  if (typeof input !== 'string') {
    return NaN;
  }
  input = input.replace(/,/g, '');

  const suffixes = {
      K: 1e3,
      M: 1e6,
      B: 1e9,
      T: 1e12
  };

  const match = input.match(/^(\d+(\.\d+)?)([KMBT])?$/i);
  if (!match) {
      return parseFloat(input) || NaN;
  }

  const value = parseFloat(match[1]);
  const suffix = match[3] ? match[3].toUpperCase() : null;

  return suffix ? value * (suffixes[suffix] || 1) : value;
}

export const toPascalCase = (input) => {
  return input
    .toLowerCase()
    .replace(/(?:^|[\s\-.])(\p{L})/gu, match => match.toUpperCase());
}

const dayNameMapping = {
  Monday: 'Δευτέρα',
  Tuesday: 'Τρίτη',
  Wednesday: 'Τετάρτη',
  Thursday: 'Πέμπτη',
  Friday: 'Παρασκευή',
  Saturday: 'Σάββατο',
  Sunday: 'Κυριακή'
};

export const mapDayName = (dayName) => {
  return dayNameMapping[dayName] || dayName;
};
