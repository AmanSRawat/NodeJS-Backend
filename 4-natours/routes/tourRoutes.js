const express = require('express');
const tourController = require('../controllers/tourControllers');
const authController = require('../controllers/authControllers');
const router = express.Router();

router
    .route('/top-five-cheap')
    .get(tourController.aliasTopTours, tourController.getAllTours);

router
    .route('/tour-stats')
    .get(tourController.getTourStats);

router
    .route('/month-plan/:year')
    .get(tourController.getMonthlyPlan);

router
    .route('/')
    .get(authController.protect,tourController.getAllTours)
    .post(tourController.createTour);

router
    .route('/:id')
    .get(tourController.getTour)
    .patch(tourController.updateTour)
    .delete(authController.protect,authController.restrictTo('admin','lead-guide'),tourController.deleteTour);

module.exports = router;