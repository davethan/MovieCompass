const TIME_ZONE = 'Europe/Athens';

const athensParts = new Intl.DateTimeFormat('en-US', {
  timeZone: TIME_ZONE,
  hourCycle: 'h23',
  year: 'numeric', month: 'numeric', day: 'numeric',
  hour: 'numeric', minute: 'numeric', second: 'numeric',
  weekday: 'short',
});

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// Athens wall-clock time of a moment, as numbers.
const getAthensParts = (date: Date) => {
  const parts = Object.fromEntries(athensParts.formatToParts(date).map(p => [p.type, p.value]));
  return {
    year: Number(parts.year), month: Number(parts.month), day: Number(parts.day),
    hour: Number(parts.hour), minute: Number(parts.minute), second: Number(parts.second),
    weekday: WEEKDAYS.indexOf(parts.weekday),
  };
};

// How far Athens is ahead of UTC at a moment, in ms.
const athensOffset = (date: Date): number => {
  const p = getAthensParts(date);
  const asUtc = Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute, p.second);
  return asUtc - Math.floor(date.getTime() / 1000) * 1000;
};

// Start of the current cinema week: the latest Thursday 00:00, Athens time.
const athensWeekStart = (now = new Date()): Date => {
  const p = getAthensParts(now);
  const daysSinceThursday = (p.weekday - 4 + 7) % 7;
  const midnightAsUtc = Date.UTC(p.year, p.month - 1, p.day - daysSinceThursday);
  // DST changes happen at 03:00/04:00, so the offset at midnight is stable.
  return new Date(midnightAsUtc - athensOffset(new Date(midnightAsUtc)));
};

// "YYYY-MM-DD HH:mm:ss" in Athens time.
const formatAthens = (date: Date): string => date.toLocaleString('sv-SE', { timeZone: TIME_ZONE });

export { athensWeekStart, formatAthens };
