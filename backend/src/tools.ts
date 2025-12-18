import type { WeeklySchedule } from "./types.ts";

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

const getDaysInRange = (start: string, end: string) :string[] => {
    const daysOrder = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
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
    const greekMonths = {
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
    const daysMap = {
        "Δευτ.": "Monday",
        "Τρ.": "Tuesday",
        "Τετ.": "Wednesday",
        "Πέμ.": "Thursday",
        "Παρ.": "Friday",
        "Σάβ.": "Saturday",
        "Κυρ.": "Sunday",
    };

    const weeklySchedule = {
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
        for (const day in weeklySchedule) {
            weeklySchedule[day] = [...new Set(weeklySchedule[day])].sort();
        };
        return weeklySchedule;
    } catch {
        return schedule.join(' ');
    }
}

export {
    splitByHours,
    convertGreekDate,
    parseDuration,
    parseSchedule,
};