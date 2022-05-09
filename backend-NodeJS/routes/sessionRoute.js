const express = require('express');
const authController = require('../controllers/authController');
const sessionController = require('../controllers/sessionController');

const router = express.Router();

router
  .route('/')
  .get(sessionController.getAllSessions)
  .post(
    authController.protect,
    authController.restrictTo('admin'),
    sessionController.createSession
  );

router
  .route('/:id')
  .get(sessionController.getSession)
  .patch(
    authController.protect,
    authController.restrictTo('admin'),
    sessionController.updateSession
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin'),
    sessionController.deleteSession
  );

module.exports = router;
