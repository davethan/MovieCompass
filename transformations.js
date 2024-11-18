const cheerio = require('cheerio');

const extractHrefFromFirstLi = (html) => {
    const regex = /<ul class="ipc-metadata-list[^"]*--dividers-after[^"]*".*?<li.*?<a[^>]*href="([^"]+)"/s;
    const match = regex.exec(html);
    return match ? match[1] : null;
};

const extractDataFromIMDB = (html) => {
    const $ = cheerio.load(html);
    
    const container = $('.sc-9a2a0028-3.bwWOiy');
    const title = container.find('h1[data-testid="hero__pageTitle"] .hero__primary-text').text().trim();
    const rating = container.find('div[data-testid="hero-rating-bar__aggregate-rating"] span.sc-d541859f-1').text().trim();

    return {
        title,
        rating
    };
};

const parseAthinoramaMovies = (html_data) => {
    const $ = cheerio.load(html_data);
    const container = $('div.tabs-panel').eq(1).find('ul.panel-guide-list');
    const athinoramaMovieURLs = [];

    container.find('li').each((_, li) => {
        const link = $(li).find('a');
        const url = link.attr('href');
        athinoramaMovieURLs.push(url);
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

    const cinemas = $('div.guide-list.locations-list').children().children('div.item.card-item');
    const schedule = [];
    cinemas.each((index, cinema) => {
        const cinemaTitle = $(cinema).find('h2.item-title').children('a').text().trim();
        schedule[index] = { cinema: cinemaTitle, cinemaSchedule: [] };
        const timeTables = $(cinema).children('div.grid.schedule-grid');
        timeTables.each((i, timeTable) => {
            const times = $(timeTable).find('span.time').text().trim();
            schedule[index].cinemaSchedule.push(times);
        });
    });

    return {
        greekTitle,
        originalTitle,
        year,
        duration,
        summary,
        directors: drcts,
        actors,
        imdbLink,
        schedule,
    };
};

module.exports = {
    extractHrefFromFirstLi,
    extractDataFromIMDB,
    parseAthinoramaMovies,
    extractAthinoramaMovieDetails,
};