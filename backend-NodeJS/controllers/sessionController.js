const Session = require('../models/sessionModel');
const Cinema = require('../models/cinemaModel');
const Movie = require('../models/movieModel');
const Invitation = require('../models/invitationEntryModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require('./handlerFactory');
const Email = require('../utils/email');

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });

  return newObj;
};

exports.createSession = catchAsync(async (req, res, next) => {
  let query = Movie.findById(req.body.movie);
  const movie = await query;

  if (!movie) {
    return next(new AppError('Movie not found.', 404));
  }

  query = Cinema.findById(req.body.cinema);
  const cinema = await query;

  if (!cinema) {
    return next(new AppError('Cinema not found.', 404));
  }

  req.body.seatsLayout = cinema.seatsLayout;
  req.body.seatsAvailable = cinema.seatsAvailable;

  const doc = await Session.create(req.body);

  res.status(201).json({
    status: 'success',
    data: { data: doc },
  });
});

exports.updateSession = catchAsync(async (req, res, next) => {
  const filteredBody = filterObj(
    req.body,
    'startDate',
    'startTime',
    'code',
    'name',
    'movie',
    'cinema',
    'active'
  );

  if (filteredBody.cinema) {
    const query = Cinema.findById(req.body.cinema);
    const cinema = await query;

    if (!cinema) {
      return next(new AppError('Invalid cinema selection', 404));
    }

    filteredBody.seatsLayout = cinema.seatsLayout;
    filteredBody.seatsAvailable = cinema.seatsAvailable;
  }

  const updatedSession = await Session.findByIdAndUpdate(
    req.params.id,
    filteredBody,
    {
      new: true,
      runValidators: true,
    }
  );

  res
    .status(200)
    .json({ status: 'success', data: { session: updatedSession } });

  const inivitationList = await Invitation.find({
    session: req.params.id,
    $or: [
      { sessionTime: { $ne: updatedSession.startTime } },
      { cinema: { $ne: updatedSession.cinema } },
      { movie: { $ne: updatedSession.movie } },
      { sessionDate: { $ne: updatedSession.startDate } },
    ],
  });

  if (inivitationList) {
    const newSessionData = {
      sessionDate: updatedSession.startDate,
      sessionTime: updatedSession.startTime,
      cinema: updatedSession.cinema.name,
      movie: updatedSession.movie.title,
    };

    inivitationList.forEach((inivitationEntry) => {
      new Email(
        { email: inivitationEntry.email, name: req.user.name },
        ''
      ).sendSessionChanged(inivitationEntry, newSessionData);
    });
  }
});

exports.getAllSessions = factory.getAll(Session);
exports.getSession = factory.getOne(Session);
exports.deleteSession = factory.deleteOne(Session);
