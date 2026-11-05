import type { Day, WeeklySchedule } from "./types.ts";

const splitByHours = (input: string): string[] => {
    // Matches "hh.mm" or "hh.mm/ hh.mm" or "hh.mm /hh.mm" or "hh.mm/ hh.mm/ hh.mm/ hh.mm"
    const timePattern = /\b\d{2}\.\d{2}(?:\s*\/\s*\d{2}\.\d{2})*\b/g;

    const parts = input.split(timePattern);
    const times = input.match(timePattern);
    if (!times) return [];

    return times.map((time, index) => {
        let precedingText = parts[index].trim();
        if (precedingText[0] === ',') precedingText = precedingText.substring(1).trim();
        return `${precedingText} ${time}`.trim();
    });
};

const getDaysInRange = (start: Day, end: Day) :Day[] => {
    const daysOrder: Day[] = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    let startIndex = daysOrder.indexOf(start);
    let endIndex = daysOrder.indexOf(end);

    if (startIndex <= endIndex) {
        return daysOrder.slice(startIndex, endIndex + 1);
    } else {
        // Handle wrap-around for ranges like "Πέμ.-Τρι."
        return [...daysOrder.slice(startIndex), ...daysOrder.slice(0, endIndex + 1)];
    }
};

const convertGreekDate = (inputDate: string) :string => {
    const greekMonths: Record<string, string> = {
        'Ιανουαρίου': '01',
        'Φεβρουαρίου': '02',
        'Μαρτίου': '03',
        'Απριλίου': '04',
        'Μαΐου': '05',
        'Ιουνίου': '06',
        'Ιουλίου': '07',
        'Αυγούστου': '08',
        'Σεπτεμβρίου': '09',
        'Οκτωβρίου': '10',
        'Νοεμβρίου': '11',
        'Δεκεμβρίου': '12'
    };
    const [day, monthGreek, year] = inputDate.split(' ');
    const monthNumber = greekMonths[monthGreek];

    if (!monthNumber) return '';
    return `${day}-${monthNumber}-${year}`;
};

const parseDuration = (duration: string) :number|null => {
    const match = duration.match(/(\d+)\s*ωρ\.\s*(\d+)\s*λεπ\./);
    if (match) {
        const hours = parseInt(match[1], 10);
        const minutes = parseInt(match[2], 10);
        return hours * 60 + minutes;
    }
    return null;
};

const parseSchedule = (schedule: string[]) :WeeklySchedule|string => {
    const daysMap: Record<string, Day> = {
        "Δευτ.": "Monday",
        "Τρ.": "Tuesday",
        "Τετ.": "Wednesday",
        "Πέμ.": "Thursday",
        "Παρ.": "Friday",
        "Σάβ.": "Saturday",
        "Κυρ.": "Sunday",
    };

    const weeklySchedule: WeeklySchedule = {
        Monday: [],
        Tuesday: [],
        Wednesday: [],
        Thursday: [],
        Friday: [],
        Saturday: [],
        Sunday: [],
    };
    try {
        for (const entry of schedule) {
            const [daysPart, timesPart] = entry.split(":").map(str => str.trim());
            const times = timesPart.split("/").map(time => time.trim());
            const daysGroups = daysPart.split(",");

            for (const group of daysGroups) {
                const [startDay, endDay] = group.includes("-")
                    ? group.split("-").map(day => daysMap[day.trim()])
                    : [daysMap[group.trim()], daysMap[group.trim()]];
                
                const days = endDay ? getDaysInRange(startDay, endDay) : [startDay];
                for (const day of days) {
                    weeklySchedule[day].push(...times);
                }
            }
        };

        // Remove duplicates and sort times for each day
        for (const day of Object.keys(weeklySchedule) as Day[]) {
            weeklySchedule[day] = [...new Set(weeklySchedule[day])].sort();
        };
        return weeklySchedule;
    } catch {
        return schedule.join(' ');
    }
}

// Only filmy.gr pages may be fetched, so the server can't be used to request other addresses.
const isFilmyUrl = (value: unknown): value is string => {
    if (typeof value !== 'string') return false;
    try {
        const url = new URL(value);
        return ['http:', 'https:'].includes(url.protocol) && ['filmy.gr', 'www.filmy.gr'].includes(url.hostname);
    } catch {
        return false;
    }
};

// Athinorama's own movie id, so it stays the same across scrapes and /film/:id links keep working.
// "/cinema/movie/drakoulas-1004566/" -> "1004566". Falls back to the last part of the url.
const getAthinoramaMovieId = (url: string): string =>
    url.match(/-(\d+)\/?$/)?.[1] ?? url.split('/').filter(Boolean).pop() ?? url;

export {
    splitByHours,
    convertGreekDate,
    parseDuration,
    parseSchedule,
    isFilmyUrl,
    getAthinoramaMovieId,
};