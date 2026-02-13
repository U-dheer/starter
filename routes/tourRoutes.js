const express = require('express');
const tourController = require('../controllers/tourController');
const authController = require('../controllers/authController');
const reviewController = require('../controllers/reviewController');

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Tour:
 *       type: object
 *       required:
 *         - name
 *         - duration
 *         - maxGroupSize
 *         - difficulty
 *         - price
 *         - summary
 *         - description
 *         - imageCover
 *       properties:
 *         name:
 *           type: string
 *         duration:
 *           type: integer
 *         maxGroupSize:
 *           type: integer
 *         difficulty:
 *           type: string
 *           enum: [easy, medium, difficult]
 *         ratingsAverage:
 *           type: number
 *         ratingsQuantity:
 *           type: integer
 *         price:
 *           type: number
 *         summary:
 *           type: string
 *         description:
 *           type: string
 *         imageCover:
 *           type: string
 *         images:
 *           type: array
 *           items:
 *             type: string
 *         startDates:
 *           type: array
 *           items:
 *             type: string
 *             format: date-time
 */

/**
 * @swagger
 * tags:
 *   name: Tours
 *   description: Tour management
 */

// router.param('id', tourController.checkID)

/**
 * @swagger
 * /api/v1/tours/top-5-cheap:
 *   get:
 *     summary: Get top 5 cheap tours
 *     tags: [Tours]
 *     responses:
 *       200:
 *         description: Successfully retrieved top 5 cheap tours
 */
router
  .route('/top-5-cheap')
  .get(tourController.aliasTopTours, tourController.getAllTours);

/**
 * @swagger
 * /api/v1/tours/tour-stats:
 *   get:
 *     summary: Get tour statistics
 *     tags: [Tours]
 *     responses:
 *       200:
 *         description: Successfully retrieved tour statistics
 */
router.route('/tour-stats').get(tourController.getTourStats);

/**
 * @swagger
 * /api/v1/tours/monthly-plan/{year}:
 *   get:
 *     summary: Get monthly plan for a given year
 *     tags: [Tours]
 *     parameters:
 *       - in: path
 *         name: year
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Successfully retrieved monthly plan
 */
router
  .route('/monthly-plan/:year')
  .get(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.getMonthPlan,
  );

/**
 * @swagger
 * /api/v1/tours/tours-within/{distance}/center/{lating}/unit/{unit}:
 *   get:
 *     summary: Get tours within a certain distance from a location
 *     tags: [Tours]
 *     parameters:
 *       - in: path
 *         name: distance
 *         required: true
 *         schema:
 *           type: number
 *       - in: path
 *         name: lating
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: unit
 *         required: true
 *         schema:
 *           type: string
 *           enum: [mi, km]
 *     responses:
 *       200:
 *         description: Successfully retrieved tours
 */
router
  .route('/tours-within/:distance/center/:lating/unit/:unit')
  .get(tourController.getToursWithin); //center=>danata inn location eka           lating ekat api denna oni coodinattes   unit means the mesurement(km,m)

/**
 * @swagger
 * /api/v1/tours/distances/{lating}/unit/{unit}:
 *   get:
 *     summary: Get distances of tours from a location
 *     tags: [Tours]
 *     parameters:
 *       - in: path
 *         name: lating
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: unit
 *         required: true
 *         schema:
 *           type: string
 *           enum: [mi, km]
 *     responses:
 *       200:
 *         description: Successfully retrieved distances
 */
router.route('/distances/:lating/unit/:unit').get(tourController.getDistances);

/**
 * @swagger
 * /api/v1/tours:
 *   get:
 *     summary: Get all tours
 *     tags: [Tours]
 *     responses:
 *       200:
 *         description: Successfully retrieved all tours
 *   post:
 *     summary: Create a new tour
 *     tags: [Tours]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Tour'
 *     responses:
 *       201:
 *         description: Tour created successfully
 */
router
  .route('/')
  .get(tourController.getAllTours)
  .post(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.createTour,
  );

/**
 * @swagger
 * /api/v1/tours/{id}:
 *   get:
 *     summary: Get a specific tour by ID
 *     tags: [Tours]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved the tour
 *   patch:
 *     summary: Update a tour
 *     tags: [Tours]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Tour'
 *     responses:
 *       200:
 *         description: Tour updated successfully
 *   delete:
 *     summary: Delete a tour
 *     tags: [Tours]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Tour deleted successfully
 */
router
  .route('/:id')
  .get(tourController.getTour)

  .patch(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.updateTour,
  )

  .delete(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.deleteTour,
  );

// POST  /tour/234/reviews
// GET  /tour/234/reviews
// GET  /tour/234/reviews/34435435

router
  .route('/:tourId/reviews')
  .post(
    authController.protect,
    authController.restrictTo('user'),
    reviewController.setTourUserIds,
    reviewController.createReview,
  )

  .get(
    authController.protect,
    authController.restrictTo('user'),
    reviewController.getAllReviews,
  );

module.exports = router;
