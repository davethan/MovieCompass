const { v4: uuidv4 } = require('uuid');
const cheerio = require('cheerio');
const {
    splitByHours,
    convertGreekDate,
    parseDuration,
    parseSchedule,
    uniformDate,
} = require('./tools');

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

const parseUpcomingMovies = (html_data) => {
    const $ = cheerio.load(html_data);
    try {
        const table = $('div.supsystic-tables-wrap');
        const tableRows = table.find('tbody').find('tr');
        const summaryMovies = [];
        tableRows.each((i, row) => {
            const premiere = $(row).children('td:eq(0)').text().trim();
            let originalTitle = $(row).children('td:eq(1)').text().replace('*', '').replace('(κ.σ.)', '').trim();
            let greekTitle = $(row).children('td:eq(2)').text().replace('*', '').replace('(κ.σ.)', '').trim();
            if (!greekTitle || greekTitle === '-') {
                greekTitle = originalTitle;
                originalTitle = '';
            }
            if (greekTitle === originalTitle) originalTitle = '';
            const directors = $(row).children('td:eq(3)').text().trim();
            if (premiere) summaryMovies.push({
                greekTitle, 
                originalTitle, 
                directors, 
                premiere: uniformDate(premiere), 
                isBrief: true
            });
        });
        return summaryMovies;
    } catch {
        console.log('Error @parseUpcomingMovies')
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
            if (tags.length < 4) tags.push($(tag).text().trim());
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
            premiere: convertGreekDate(premiere),
            isBrief: false,
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
    parseUpcomingMovies,
    parseUpcomingFilmDetails,
};