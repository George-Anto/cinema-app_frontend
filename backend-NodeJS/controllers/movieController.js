const multer = require('multer');
const sharp = require('sharp');
const Movie = require('../models/movieModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require('./handlerFactory');

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/jpeg')) {
    cb(null, true);
  } else {
    cb(
      new AppError(
        'Not a valid image file! Please upload only jpg images.',
        400
      ),
      false
    );
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadMoviePoster = upload.single('poster');

exports.resizeMoviePoster = catchAsync(async (req, res, next) => {
  if (!req.file) return next();

  req.body.poster = `movie-${req.params.id}-${Date.now()}.jpg`;

  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/movies/${req.body.poster}`);

  next();
});

exports.createMovie = factory.createOne(Movie);
exports.getAllMovies = factory.getAll(Movie);
exports.getMovie = factory.getOne(Movie);
exports.updateMovie = factory.updateOne(Movie);
exports.deleteMovie = factory.deleteOne(Movie);
