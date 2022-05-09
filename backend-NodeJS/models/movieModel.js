const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    poster: {
      type: String,
    },
    runtime: {
      type: Number,
      required: true,
    },
    year: {
      type: Number,
      required: true,
    },
    released: {
      type: Date,
      required: true,
    },
    plot: {
      type: String,
    },
    fullplot: {
      type: String,
    },
    directors: [String],
    cast: [String],
    imdb: {
      rating: { type: Number, min: 0, max: 10 },
      votes: { type: Number, min: 0 },
    },
    tomatoes: {
      rating: { type: Number, min: 0, max: 10 },
      votes: { type: Number, min: 0 },
    },
  },
  { timestamps: true }
);

movieSchema.index({ title: 1, year: 1 }, { unique: true });

const Movie = mongoose.model('Movie', movieSchema);
module.exports = Movie;
