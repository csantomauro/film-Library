import dayjs from "dayjs";
import pool from "./db.mjs";
import Film from "./Film.mjs";

const filters = {
  'filter-favorite': {label: 'Favorites', filterFunction: film => film.favorite},
  'filter-best': {label: 'Best Rated', filterFunction: film => film.rating >= 5},
  'filter-lastmonth': {label: 'Seen Last Month', filterFunction: film => isSeenLastMonth(film)},
  'filter-unseen': {label: 'Unseen', filterFunction: film => !film.watchDate}
};

const isSeenLastMonth = (film) => {
  if (film.watchDate) {
    const diff = dayjs(film.watchDate).diff(dayjs(), 'month');
    return diff <= 0 && diff > -1;
  }
};

function mapRowsToFilms(rows) {
  return rows.map(row =>
    new Film(
      row.id,
      row.title,
      row.isfavorite === true,
      row.watchdate,
      row.rating,
      row.userid
    )
  );
}

export default function FilmDao() {

  // GET all films
  this.getFilms = async (userId, filter) => {
    const result = await pool.query(
      "SELECT * FROM films WHERE userId=$1",
      [userId]
    );

    const films = mapRowsToFilms(result.rows);

    if (filters.hasOwnProperty(filter))
      return films.filter(filters[filter].filterFunction);
    else
      return films;
  };


  // GET film by id
  this.getFilm = async (userId, id) => {
    const result = await pool.query(
      "SELECT * FROM films WHERE id=$1 AND userId=$2",
      [id, userId]
    );

    if (result.rows.length === 0)
      return { error: "Film not found." };

    return mapRowsToFilms(result.rows)[0];
  };


  // INSERT film
  this.addFilm = async (film) => {

    const watchDate = film.watchDate
      ? film.watchDate.format("YYYY-MM-DD")
      : null;

    let rating = null;
    if (film.rating && film.rating >= 1 && film.rating <= 5)
      rating = film.rating;

    const result = await pool.query(
      `INSERT INTO films (title, isFavorite, rating, watchDate, userId)
       VALUES ($1,$2,$3,$4,$5)
       RETURNING id`,
      [film.title, film.favorite, rating, watchDate, film.userId]
    );

    film.id = result.rows[0].id;
    return film;
  };


  // UPDATE film
  this.updateFilm = async (userId, id, film) => {

    const watchDate = film.watchDate
      ? film.watchDate.format("YYYY-MM-DD")
      : null;

    let rating = null;
    if (film.rating && film.rating >= 1 && film.rating <= 5)
      rating = film.rating;

    const result = await pool.query(
      `UPDATE films
       SET title=$1, isFavorite=$2, rating=$3, watchDate=$4
       WHERE id=$5 AND userId=$6`,
      [film.title, film.favorite, rating, watchDate, id, userId]
    );

    if (result.rowCount === 0)
      return { error: "Film not found." };

    return film;
  };


  // DELETE film
  this.deleteFilm = async (userId, id) => {

    const result = await pool.query(
      "DELETE FROM films WHERE id=$1 AND userId=$2",
      [id, userId]
    );

    return result.rowCount;
  };

}