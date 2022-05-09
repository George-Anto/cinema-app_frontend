const InvitationEntry = require('../models/invitationEntryModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');

exports.checkin = catchAsync(async (req, res, next) => {
  let query = InvitationEntry.findOne({
    _id: req.params.id,
    checkin: true,
    status: 'valid',
  });
  let invitation = await query;

  if (invitation) {
    return next(new AppError('Check-in already happened', 404));
  }

  query = InvitationEntry.findOne({
    _id: req.params.id,
    checkin: false,
    status: 'valid',
  });
  invitation = await query;

  if (!invitation) {
    return next(new AppError('No valid invitation found with that ID', 404));
  }

  invitation.checkin = true;
  invitation.checkinDate = Date.now();
  await invitation.save();

  res.status(201).json({
    status: 'success',
    data: { data: invitation },
  });
});

exports.getAllInvitationEntriesStrict = (...roles) =>
  factory.getAllStrict(InvitationEntry, ...roles);

exports.getInvitationEntryStrict = (...roles) =>
  factory.getOneStrict(InvitationEntry, false, ...roles);
