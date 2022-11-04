const express = require('express');
const reviewController = require('../controllers/reviewController');
const authController = require('../controllers/authController');
const bookingController = require('../controllers/bookingController');

const router = express.Router();

router.use(authController.protect);

router.get('/checkout-session/:tourId', bookingController.getCheckoutSession);

router.use(authController.restrictTo('admin', 'leadguide'));

router
  .route('/')
  .get(bookingController.getAllBookings)
  .post(bookingController.createBooking);

router
  .route('/:id')
  .get(bookingController.getBooking)
  .patch(bookingController.updateBooking)
  .delete(bookingController.deleteBooking);

module.exports = router;
