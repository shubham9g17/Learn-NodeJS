const express = require("express");
const { Genre } = require("../models/genre");
const router = express.Router();
const { Movie, validate } = require("../models/movie");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

// get all movies
router.get("/", async (req, res) => {
  const movies = await Movie.find().sort("title");
  res.send(movies);
});

// post one movie
router.post("/", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const genre = await Genre.findById(req.body.genreId);
  if (!genre) return res.status(400).send("Invalid Genre Id");

  let movie = new Movie({
    title: req.body.title,
    genre: new Genre({
      _id: genre._id,
      name: genre.name,
    }),
    numberInStock: req.body.numberInStock,
    dailyRentalRate: req.body.dailyRentalRate,
  });
  await movie.save();
  res.send(movie);
});

// get movies by id
router.get("/:id", async (req, res) => {
  const movie = await Movie.findById(req.params.id);
  if (!movie) return res.status(404).send("Error: Movie Not Found");
  res.send(movie);
});

// updating movie by id
router.put("/:id", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const genre = await Genre.findById(req.body.genreId);
  if (!genre) return res.status(400).send("Invalid Genre Id");

  const movie = await Movie.findByIdAndUpdate(
    req.params.id,
    {
      title: req.body.title,
      genre: new Genre({
        _id: genre._id,
        name: genre.name,
      }),
      numberInStock: req.body.numberInStock,
      dailyRentalRate: req.body.dailyRentalRate,
    },
    { new: true }
  );
  if (!movie) return res.status(404).send("Error: Movie Not Found");
  res.send(movie);
});

// deleting movie by id
router.delete("/:id", [auth, admin], async (req, res) => {
  const movie = await Movie.findByIdAndDelete(req.params.id);
  if (!movie) return res.status(404).send("Error: Movie Not Found");
  res.send(movie);
});

module.exports = router;
