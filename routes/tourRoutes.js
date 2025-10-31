const express = require('express');
const tourController = require('../controllers/tourController');
const authController = require('../controllers/authController')
const reviewController = require('../controllers/reviewController')


const router = express.Router();

// router.param('id', tourController.checkID)


router.route('/top-5-cheap')
    .get(tourController.aliasTopTours,
        tourController.getAllTours);

router.route('/tour-stats')
    .get(tourController.getTourStats)

router.route('/monthly-plan/:year')
    .get(authController.protect,
        authController.restrictTo('admin', 'lead-guide'),
        tourController.getMonthPlan);

router.route('/tours-within/:distance/center/:lating/unit/:unit').get(tourController.getToursWithin)  //center=>danata inn location eka           lating ekat api denna oni coodinattes   unit means the mesurement(km,m)

router.route('/distances/:lating/unit/:unit').get(tourController.getDistances)

router.route('/').get(tourController.getAllTours)
    .post(authController.protect,
        authController.restrictTo('admin', 'lead-guide'),
        tourController.createTour);

router.route('/:id')
    .get(tourController.getTour)

    .patch(authController.protect,
        authController.restrictTo('admin', 'lead-guide'),
        tourController.updateTour)


    .delete(authController.protect,
        authController.restrictTo('admin', 'lead-guide'),
        tourController.deleteTour);



// POST  /tour/234/reviews
// GET  /tour/234/reviews
// GET  /tour/234/reviews/34435435

router.route('/:tourId/reviews')
    .post(authController.protect,
        authController.restrictTo('user'),
        reviewController.setTourUserIds,
        reviewController.createReview)

    .get(authController.protect,
        authController.restrictTo('user'),
        reviewController.getAllReviews)






module.exports = router;