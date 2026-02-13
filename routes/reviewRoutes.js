const express = require('express');
const reviewController = require('../controllers/reviewController');
const authController = require('../controllers/authController');

const router = express.Router({ mergeParams: true });

/**
 * @swagger
 * components:
 *   schemas:
 *     Review:
 *       type: object
 *       required:
 *         - review
 *         - rating
 *         - tour
 *         - user
 *       properties:
 *         review:
 *           type: string
 *         rating:
 *           type: integer
 *           minimum: 1
 *           maximum: 5
 *         tour:
 *           type: string
 *           description: ID of the tour
 *         user:
 *           type: string
 *           description: ID of the user
 */

/**
 * @swagger
 * tags:
 *   name: Reviews
 *   description: Review management
 */

router.use(authController.protect);

/**
 * @swagger
 * /api/v1/reviews:
 *   get:
 *     summary: Get all reviews
 *     tags: [Reviews]
 *     security: [{bearerAuth: []}]
 *     responses:
 *       200:
 *         description: Successfully retrieved all reviews
 *   post:
 *     summary: Create a new review
 *     tags: [Reviews]
 *     security: [{bearerAuth: []}]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Review'
 *     responses:
 *       201:
 *         description: Review created successfully
 */
router
  .route('/')
  .get(reviewController.getAllReviews)

  .post(
    authController.restrictTo('user'),
    reviewController.setTourUserIds,
    reviewController.createReview,
  );

/**
 * @swagger
 * /api/v1/reviews/{id}:
 *   get:
 *     summary: Get review by ID
 *     tags: [Reviews]
 *     security: [{bearerAuth: []}]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: {type: string}
 *     responses:
 *       200:
 *         description: Successfully retrieved review
 *   patch:
 *     summary: Update review
 *     tags: [Reviews]
 *     security: [{bearerAuth: []}]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: {type: string}
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Review'
 *     responses:
 *       200:
 *         description: Review updated successfully
 *   delete:
 *     summary: Delete review
 *     tags: [Reviews]
 *     security: [{bearerAuth: []}]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: {type: string}
 *     responses:
 *       204:
 *         description: Review deleted successfully
 */
router
  .route('/:id')
  .delete(
    authController.restrictTo('user', 'admin'),
    reviewController.deleteReview,
  )

  .patch(
    authController.restrictTo('user', 'admin'),
    reviewController.updateReview,
  )

  .get(reviewController.getReview);

module.exports = router;
