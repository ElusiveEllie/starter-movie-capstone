const knex = require("../db/connection");
const moviesController = require("../movies/movies.controller");
const reduceProperties = require("../utils/reduce-properties");

// Reduce movie properties to array within data
const reduceMovies = reduceProperties("theater_id", {
  title: ["movies", null, "title"],
  runtime_in_minutes: ["movies", null, "runtime_in_minutes"],
  rating: ["movies", null, "rating"],
  description: ["movies", null, "description"],
  image_url: ["movies", null, "image_url"],
  movie_id: ["movies", null, "movie_id"],
})

// List all theaters and movies that are shown
function list() {
  return knex("theaters as t")
    .join("movies_theaters as mt", "t.theater_id", "mt.theater_id")
    .join("movies as m", "m.movie_id", "mt.movie_id")
    .select("t.*", "m.title", "m.runtime_in_minutes", "m.rating", "m.description", "m.image_url", "m.movie_id")
    .then((data) => reduceMovies(data));
}

module.exports = {
  list,
}