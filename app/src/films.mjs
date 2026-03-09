/*
 * 01UDFOV Applicazioni Web I / 01TXYOV Web Applications I
 * 2024 - Lab 6
 */

import dayjs from "dayjs";

// This is the same model developed for lab 1.
function Film(id, title, isFavorite = false, watchDate = null, rating = null, userId = 1) {
    this.id = id;
    this.title = title;
    this.favorite = isFavorite;
    this.rating = rating;
    // saved as dayjs object only if watchDate is truthy
    this.watchDate = watchDate && dayjs(watchDate);
    this.userId = userId

    this.toString = () => {
        const watchDate = this.watchDate ? this.watchDate.format('DD/MM/YYYY') : null

        return `Id: ${this.id}, ` +
            `Title: ${this.title}, Favorite: ${this.favorite}, ` +
            `Watch date: ${watchDate}, Score: ${this.rating}, ` +
            `User: ${this.userId}`;
    }

    this.formatWatchDate = (format = 'MMMM D, YYYY') => {
        return this.watchDate ? this.watchDate.format(format) : undefined;
    };
}

const films = [
    { id: 1, title: "In the Mood for Love", favorite: true, watchDate: "2025-04-02", rating: 5, userId: 1 },
    { id: 2, title: "Parasite", favorite: true, watchDate: "2021-04-13", rating: 5, userId: 1 },
    { id: 3, title: "Memories of Murder", favorite: true, watchDate: "2005-09-12", rating: 5, userId: 1 },
    { id: 4, title: "The Handmaiden", favorite: true, watchDate: "2025-03-10", rating: 5, userId: 1 },
    { id: 5, title: "Ringu", favorite: false, watchDate: "2001-07-01", rating: 4, userId: 2 },
    { id: 6, title: "The Taste of Tea", favorite: false, watchDate: null, rating: 4, userId: 2 },
    { id: 7, title: "A Separation", favorite: true, watchDate: "2025-03-20", rating: 5, userId: 3 },
    { id: 8, title: "The World of Kanako", favorite: false, watchDate: null, rating: 4, userId: 3 },
    { id: 9, title: "Cure", favorite: true, watchDate: "2022-06-03", rating: 5, userId: 4 },
    { id: 10, title: "Tokyo Sonata", favorite: true, watchDate: "2021-10-14", rating: 5, userId: 4 },
    { id: 11, title: "Yi Yi", favorite: false, watchDate: "2000-09-23", rating: 4, userId: 5 },
    { id: 12, title: "The Cowards Who Looked to the Sky", favorite: false, watchDate: null, rating: 4, userId: 5 },
    { id: 13, title: "The 400 Blows", favorite: true, watchDate: "2023-03-20", rating: 5, userId: 6 },
    { id: 14, title: "A Ghost Story", favorite: true, watchDate: "2022-07-25", rating: 5, userId: 6 },
    { id: 15, title: "The Spirit of the Beehive", favorite: false, watchDate: "1973-05-12", rating: 4, userId: 7 },
    { id: 16, title: "The Assassin", favorite: true, watchDate: "2015-09-12", rating: 5, userId: 7 },
    { id: 17, title: "Oldboy", favorite: true, watchDate: "2025-03-05", rating: 5, userId: 8 },
    { id: 18, title: "Blue Is the Warmest Colour", favorite: false, watchDate: null, rating: 4, userId: 8 },
    { id: 19, title: "Lady Vengeance", favorite: true, watchDate: "2022-11-14", rating: 5, userId: 9 },
    { id: 20, title: "In the Mood for Love", favorite: false, watchDate: "2021-01-22", rating: 4, userId: 9 },
    { id: 21, title: "Sita Sings the Blues", favorite: true, watchDate: "2025-03-17", rating: 5, userId: 10 },
    { id: 22, title: "The Quince Tree Sun", favorite: false, watchDate: "2004-08-02", rating: 4, userId: 10 },
    { id: 23, title: "Princess Mononoke", favorite: true, watchDate: "2022-01-04", rating: 5, userId: 11 },
    { id: 24, title: "Tokyo Story", favorite: true, watchDate: "2023-05-05", rating: 5, userId: 11 },
    { id: 25, title: "The Return", favorite: false, watchDate: "2025-03-01", rating: 4, userId: 12 },
    { id: 26, title: "The Great Beauty", favorite: true, watchDate: "2021-06-18", rating: 5, userId: 12 },
    { id: 27, title: "Porco Rosso", favorite: true, watchDate: "2023-09-23", rating: 5, userId: 13 },
    { id: 28, title: "Rosencrantz & Guildenstern Are Dead", favorite: false, watchDate: null, rating: 4, userId: 13 },
    { id: 29, title: "The Ascent", favorite: true, watchDate: "2023-09-01", rating: 5, userId: 14 },
    { id: 30, title: "The Housemaid", favorite: true, watchDate: "2022-06-12", rating: 5, userId: 14 }
];

const INITIAL_FILMS = films.map((film) => {
    return new Film(film.id, film.title, film.favorite, film.watchDate, film.rating, film.userId)
});

export {Film, INITIAL_FILMS};
