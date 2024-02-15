const moviesService = require("./movies.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

// Read all reviews, with query for whether movies are showing or not
async function list(req, res, next) {
  const isShowing = req.query.is_showing;
  const movies = await moviesService.list(isShowing);
  res.json({ data: movies });
}

// Check that movie exists
async function movieExists(req, res, next) {
  const movie = await moviesService.read(req.params.movieId);
  if (movie) {
    res.locals.movie = movie;
    return next();
  }
  next({ status: 404, message: `Movie cannot be found.` });
}

// Read specified movie
async function read(req, res, next) {
  const movie = res.locals.movie;
  res.json({ data: movie });
}

// List theaters 
async function listTheaters (req, res, next) {
  const theaters = await moviesService.listMovieTheaters(req.params.movieId);
  res.json({ data: theaters });
}

// List reviews
async function listReviews (req, res, next) {
  const data = await moviesService.listMovieReviews(req.params.movieId);
  res.json({ data });
}

module.exports = {
  list: [asyncErrorBoundary(list)],
  read: [asyncErrorBoundary(movieExists), read],
  theaters: [asyncErrorBoundary(listTheaters)],
  reviews: [asyncErrorBoundary(listReviews)],
};
