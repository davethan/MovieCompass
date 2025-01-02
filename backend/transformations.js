const { v4: uuidv4 } = require('uuid');
const cheerio = require('cheerio');

const extractImdbMovieCode = (html) => {
    const regex = /<ul class="ipc-metadata-list[^"]*--dividers-after[^"]*".*?<li.*?<a[^>]*href="([^"]+)"/s;
    const match = regex.exec(html);
    return match ? match[1] : null;
};

const extractDataFromIMDB = (html) => {
    const $ = cheerio.load(html);
    
    const container = $('.sc-9a2a0028-3.bwWOiy');
    const rating = container.find('div[data-testid="hero-rating-bar__aggregate-rating"] span.sc-d541859f-1').text().trim();
    const popularity = container.find('div[data-testid="hero-rating-bar__aggregate-rating"] div.sc-d541859f-3.dwhNqC').text().trim();

    return {rating, popularity};
};

const parseAthinoramaMovies = (html_data) => {
    const $ = cheerio.load(html_data);
    const container = $('div.tabs-panel').eq(1).find('ul.panel-guide-list');
    const athinoramaMovieURLs = [];

    container.find('li').each((_, li) => {
        const link = $(li).find('a');
        const url = link.attr('href');
        const id = uuidv4();
        athinoramaMovieURLs.push({url, id});
    });

    return athinoramaMovieURLs;
};

const extractAthinoramaMovieDetails = (html_data) => {
    const $ = cheerio.load(html_data);

    const header = $('div.review-title');

    const greekTitle = $(header).children().first().text().trim() || '';
    const originalTitle = $(header).find('span.original-title').text().trim() || '';
    const year = $(header).find('span.year').text().trim() || '';
    const duration = $(header).find('span.duration').text().trim().match(/\d+/g)?.join('') || '';

    const reviewTags = $(header).find('ul.review-tags').find('a');
    let tags = [];
    reviewTags.each((i, tag) => {
        tags.push($(tag).text().trim());
    })

    const summary = $(header).find('div.summary').children().text().trim() || '';
    const imdbLink = $('div.review-links').find('a.imdb').attr('href') || '';

    const directors = $(header).find('div.cast-crew').children().first().find('a');
    const drcts = [];
    directors.each((i, dir) => {
        const director = $(dir).text().trim();
        drcts.push(director);
    });

    const stars = $(header).find('div.cast-crew').children().eq(1).find('a');
    const actors = [];
    stars.each((i, star) => {
        const actor = $(star).text().trim();
        actors.push(actor);
    });

    const locationsAndCinemas = $('div.guide-list.locations-list').children().children();
    const theaters = [];
    let location = '';
    let counter = 0;
    locationsAndCinemas.each((index, locationOrCinema) => {
        const isLocation = $(locationOrCinema).hasClass('sticky-breaker-title');
        if (isLocation) location = $(locationOrCinema).children().text().trim();
        else {
            const cinemaLocation = location;
            const cinemaTitle = $(locationOrCinema).find('h2.item-title').children('a').text().trim();
            const isOutdoor = $(locationOrCinema).children().first().children().first().find('div.tags').text().includes('Θερινός') || false;
            theaters[counter] = { cinema: cinemaTitle, cinemaLocation, isOutdoor, cinemaSchedule: [] };
            const timeTables = $(locationOrCinema).children('div.grid.schedule-grid');
            timeTables.each((i, timeTable) => {
                const times = $(timeTable).find('span.time').text().trim();
                theaters[counter].cinemaSchedule.push(splitByHours(times));
            });
            theaters[counter].cinemaSchedule = theaters[counter].cinemaSchedule.flat();
            //adds ':' after the days if not there.
            theaters[counter].cinemaSchedule = theaters[counter].cinemaSchedule.map(str => {
                if (str.includes(':')) return str;
                return str.replace(/(\.\s*)(\d)/, '.: $2');
            });
            counter++;
        }
    });
    theaters.forEach((theater) => {
        theater.cinemaSchedule = parseSchedule(theater.cinemaSchedule);
    });

    return {
        greekTitle,
        originalTitle,
        year,
        duration,
        tags,
        summary,
        directors: drcts,
        actors,
        imdbLink,
        cinemas: theaters,
    };
};

const splitByHours = (input) => {
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

const getDaysInRange = (start, end) => {
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

function convertGreekDate(inputDate) {
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

const parseDuration = (duration) => {
    const match = duration.match(/(\d+)\s*ωρ\.\s*(\d+)\s*λεπ\./);
    if (match) {
        const hours = parseInt(match[1], 10);
        const minutes = parseInt(match[2], 10);
        return hours * 60 + minutes;
    }
    return null;
};

const parseSchedule = (schedule) => {
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

const parseAthinoramaSpecials = (html_data) => {
    const $ = cheerio.load(html_data);

    const container = $('div.guide-list.movies-list');
    const items = [];

    container.children('div.item').each((_, item) => {
        try {
            const title = $(item).find('h2.item-title').text().trim();
            let cinema = $(item).find('div.item-description').find('h4').text().trim();
            if (!cinema) {
                cinema = $(item).find('div.title-infos').children('p').first().text().trim();
                cinema = cinema.startsWith(',') ? '' : cinema.split(',')[0].trim();
            }

            if (!title && !cinema) return false;
            items.push({title, cinema})
        } catch {
            console.log('parseAthinoramaSpecials: failed at an item');
        }
    })

    return items
}

const parseUpcomingLinks = (html_data) => {
    const $ = cheerio.load(html_data);
    try {
        const containers = $('div.amy-shortcode.amy-mv-grid.layout3');
        const movies = containers.find('div.col-md-15.grid-item');
        const movieUrls = [];
        movies.each((i, movie) => {
            const link = $(movie).find('h3.entry-title').find('a').attr('href');
            if (link) movieUrls.push(link);
        });
        return movieUrls;
    } catch {
        console.log('Error @parseUpcomingLinks')
        return [];
    }
}

const parseUpcomingFilmDetails = (html_data) => {
    const $ = cheerio.load(html_data);
    try {
        const container = $('div.page-content')
        let greekTitle = container.find('li:contains("Ελληνικός Τίτλος")').text().replace('Ελληνικός Τίτλος:', '').trim();
        let originalTitle = container.find('li:contains("Αυθεντικός Τίτλος")').text().replace('Αυθεντικός Τίτλος:', '').trim();
        if (!greekTitle) {
            greekTitle = originalTitle;
            originalTitle = '';
        }
        const year = container.find('li:contains("Χρονιά")').text().replace('Χρονιά:', '').trim();
        const duration = container.find('span.duration').first().text().trim();

        const reviewTags = container.find('li:contains("Είδος")').find('a');
        let tags = [];
        reviewTags.each((i, tag) => {
            tags.push($(tag).text().trim());
        })

        const summary = container.find('div.entry-content.e-content').find('div.vc_tta-panels-container').find('em').first().text().trim();
        const directors = container.find('p:contains("Σκηνοθεσία")').next().text().trim();
        const premiere = container.find('li:contains("Πρεμιέρα")').text().replace('Πρεμιέρα:', '').trim();
        
        return {
            greekTitle,
            originalTitle,
            year,
            duration: parseDuration(duration),
            tags,
            summary,
            directors,
            premiere : convertGreekDate(premiere),
        }
    } catch {
        console.log('Error @parseUpcomingFilmDetails')
        throw('Error @parseUpcomingFilmDetails') ;
    }
}

module.exports = {
    extractImdbMovieCode,
    extractDataFromIMDB,
    parseAthinoramaMovies,
    extractAthinoramaMovieDetails,
    parseAthinoramaSpecials,
    parseUpcomingLinks,
    parseUpcomingFilmDetails,
};