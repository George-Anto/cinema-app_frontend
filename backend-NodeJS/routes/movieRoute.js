const express = require('express');
const authController = require('../controllers/authController');
const movieController = require('../controllers/movieController');

const router = express.Router();

router
  .route('/')
  .get(movieController.getAllMovies)
  .post(
    authController.protect,
    authController.restrictTo('admin', 'ticketAdmin'),
    movieController.createMovie
  );

router
  .route('/:id')
  .get(movieController.getMovie)
  .patch(
    authController.protect,
    authController.restrictTo('admin', 'ticketAdmin'),
    movieController.uploadMoviePoster,
    movieController.resizeMoviePoster,
    movieController.updateMovie
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'ticketAdmin'),
    movieController.deleteMovie
  );

module.exports = router;
