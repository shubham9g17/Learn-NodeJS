const express = require("express");
const router = express.Router();
const { Movie } = require("../models/movie");
const { Customer } = require("../models/customer");
const { Rental, validate } = require("../models/rental");
const auth = require("../middleware/auth");

// get all rentals
router.get("/", async (req, res) => {
  const rental = await Rental.find().sort("-dateOut");
  res.send(rental);
});

// post one rental
router.post("/", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const customer = await Customer.findById(req.body.customerId);
  if (!customer) return res.status(400).send("Invalid Customer Id");

  const movie = await Movie.findById(req.body.movieId);
  if (!movie) return res.status(400).send("Invalid Movie Id");

  if (movie.numberInStock === 0)
    return res.status(400).send("Movie Out of Stock");

  let rental = new Rental({
    customer: {
      _id: customer._id,
      isGold: customer.isGold,
      name: customer.name,
      phone: customer.phone,
    },
    movie: {
      _id: movie._id,
      title: movie.title,
      dailyRentalRate: movie.dailyRentalRate,
    },
  });
  await rental.save();
  // two phase commit (Transaction)
  movie.numberInStock--;
  movie.save();
  res.send(rental);
});

module.exports = router;
