import { compareAsc, parse } from 'date-fns'

export const formatDuration = (minutes) => {
  const hours = Math.floor(minutes / 60)
  const restMinutes = minutes % 60

  if (hours === 0) {
    return `${restMinutes}'`
  } else if (restMinutes === 0) {
    return `${hours}h`
  } else {
    return `${hours}h ${restMinutes}'`
  }
}

export const convertToNumber = (input) => {
  if (typeof input !== 'string') {
    return NaN
  }
  input = input.replace(/,/g, '')

  const suffixes = {
    K: 1e3,
    M: 1e6,
    B: 1e9,
    T: 1e12,
  }

  const match = input.match(/^(\d+(\.\d+)?)([KMBT])?$/i)
  if (!match) {
    return parseFloat(input) || NaN
  }

  const value = parseFloat(match[1])
  const suffix = match[3] ? match[3].toUpperCase() : null

  return suffix ? value * (suffixes[suffix] || 1) : value
}

export const toPascalCase = (input) => {
  return input.toLowerCase().replace(/(?:^|[\s\-.])(\p{L})/gu, (match) => match.toUpperCase())
}

const dayNameMapping = {
  Monday: 'Δευτέρα',
  Tuesday: 'Τρίτη',
  Wednesday: 'Τετάρτη',
  Thursday: 'Πέμπτη',
  Friday: 'Παρασκευή',
  Saturday: 'Σάββατο',
  Sunday: 'Κυριακή',
}

export const mapDayName = (dayName) => {
  return dayNameMapping[dayName] || dayName
}

// ---- Day & hour filters ----
// Day filter values: 1 every day, 2 today, 3 tomorrow, 4 weekend.
// Hour filter: [lower, upper] in hours; the full range means "no hour filter".
export const HOUR_RANGE = [0, 24]
const EVERY_DAY = 1, TODAY = 2, TOMORROW = 3, WEEKEND = 4
const ALL_DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

export const isFullHourRange = ([lower, upper] = HOUR_RANGE) =>
  lower <= HOUR_RANGE[0] && upper >= HOUR_RANGE[1]

export const formatHour = (hour) => `${String(hour).padStart(2, '0')}:00`

// "20.30" -> 20.5
export const parseShowtime = (time) => {
  const match = String(time).match(/(\d{1,2})[.:](\d{2})/)
  return match ? Number(match[1]) + Number(match[2]) / 60 : null
}

export const isShowtimeInRange = (time, [lower, upper] = HOUR_RANGE) => {
  const start = parseShowtime(time)
  return start !== null && start >= lower && start <= upper
}

// English weekday names the day filter refers to
export const getFilterDays = (day) => {
  const weekday = (offset) => {
    const date = new Date()
    date.setDate(date.getDate() + offset)
    return date.toLocaleDateString('en-US', { weekday: 'long' })
  }
  if (day === TODAY) return [weekday(0)]
  if (day === TOMORROW) return [weekday(1)]
  if (day === WEEKEND) return ['Saturday', 'Sunday']
  return ALL_DAYS
}

// True when the cinema has a showtime on the filtered day(s) that starts within the hour range
export const cinemaPlaysAt = (cinema, day = EVERY_DAY, hourRange = HOUR_RANGE) => {
  if (day === EVERY_DAY && isFullHourRange(hourRange)) return true
  const schedule = cinema.cinemaSchedule
  if (!schedule || typeof schedule === 'string') return false
  return getFilterDays(day).some((dayName) =>
    (schedule[dayName] || []).some((time) => isShowtimeInRange(time, hourRange)))
}

export const sortByDate = (date1, date2) => {
  const format = 'dd-MM-yyyy'

  if (!date1 && !date2) return 0
  if (!date1) return 1
  if (!date2) return -1

  const parsedDate1 = parse(date1, format, new Date())
  const parsedDate2 = parse(date2, format, new Date())
  return compareAsc(parsedDate1, parsedDate2)
}
