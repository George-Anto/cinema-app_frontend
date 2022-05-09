const express = require('express');
const authController = require('../controllers/authController');
const invitationController = require('../controllers/invitationController');

const router = express.Router();

router
  .route('/')
  .get(
    authController.protect,
    authController.restrictTo('user', 'ticketAdmin', 'admin'),
    invitationController.getAllInvitationEntriesStrict('ticketAdmin', 'admin')
  );

router
  .route('/:id')
  .get(
    authController.protect,
    authController.restrictTo('user', 'ticketAdmin', 'admin'),
    invitationController.getInvitationEntryStrict('ticketAdmin', 'admin')
  );

router
  .route('/checkin/:id')
  .patch(
    authController.protect,
    authController.restrictTo('user', 'ticketAdmin', 'admin'),
    invitationController.checkin
  );

module.exports = router;
