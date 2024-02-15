const knex = require("../db/connection");
const mapProperties = require("../utils/map-properties");

// Map critic to nested data
const addCritic = mapProperties({
  critic_id: "critic.critic_id",
  preferred_name: "critic.preferred_name",
  surname: "critic.surname",
  organization_name: "critic.organization_name",
  created_at: "critic.created_at",
  updated_at: "critic.updated_at",
});

// Show all movies with query for movies that are showing
function list(isShowing = "false") {
  if (isShowing === "true") {
    return knex("movies as m")
      .join("movies_theaters as mt", "m.movie_id", "mt.movie_id")
      .select("m.*")
      .where({ "mt.is_showing": true })
      .groupBy("m.movie_id")
      .orderBy("m.movie_id");
  }
  return knex("movies").select("*");
}

// Read specified movie
function read(movieId) {
  return knex("movies as m")
    .select("m.*")
    .where({ "m.movie_id": movieId })
    .first();
}

// List all theaters showing specified movie
function listMovieTheaters(movieId) {
  return knex("movies as m")
    .join("movies_theaters as mt", "m.movie_id", "mt.movie_id")
    .join("theaters as t", "mt.theater_id", "t.theater_id")
    .select("t.*")
    .where({ "m.movie_id": movieId });
}

// List all reviews for specified movie
function listMovieReviews(movieId) {
  return knex("movies as m")
    .join("reviews as r", "m.movie_id", "r.movie_id")
    .join("critics as c", "r.critic_id", "c.critic_id")
    .select("*")
    .where({ "m.movie_id": movieId })
    .then((result) => result.map((review) => addCritic(review)));
}

module.exports = {
  list,
  read,
  listMovieTheaters,
  listMovieReviews,
};
