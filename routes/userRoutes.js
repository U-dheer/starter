const express = require('express');

const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const reviewController = require('../controllers/reviewController');

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
 *         - passwordConfirm
 *       properties:
 *         name:
 *           type: string
 *         email:
 *           type: string
 *         role:
 *           type: string
 *           enum: [user, guide, lead-guide, admin]
 *         password:
 *           type: string
 *           format: password
 *         passwordConfirm:
 *           type: string
 *           format: password
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management and authentication
 */

/**
 * @swagger
 * /api/v1/users/signup:
 *   post:
 *     summary: Register a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: User registered successfully
 */
router.post('/signup', authController.signup);

/**
 * @swagger
 * /api/v1/users/login:
 *   post:
 *     summary: User login
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: {type: string}
 *               password: {type: string, format: password}
 *     responses:
 *       200:
 *         description: Login successful
 */
router.post('/login', authController.login);

/**
 * @swagger
 * /api/v1/users/forgotPassword:
 *   post:
 *     summary: Send password reset token to email
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email]
 *             properties:
 *               email: {type: string}
 *     responses:
 *       200:
 *         description: Token sent to email
 */
router.post('/forgotPassword', authController.forgotPassword);

/**
 * @swagger
 * /api/v1/users/resetPassword/{token}:
 *   patch:
 *     summary: Reset password with token
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema: {type: string}
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [password, passwordConfirm]
 *             properties:
 *               password: {type: string, format: password}
 *               passwordConfirm: {type: string, format: password}
 *     responses:
 *       200:
 *         description: Password reset successful
 */
router.patch('/resetPassword/:token', authController.resetPassword);

router.use(authController.protect); //methnin pahla hma route ekktm login wela inna oni nisa

/**
 * @swagger
 * /api/v1/users/updateMyPassword:
 *   patch:
 *     summary: Update current user password
 *     tags: [Users]
 *     security: [{bearerAuth: []}]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [passwordCurrent, password, passwordConfirm]
 *             properties:
 *               passwordCurrent: {type: string, format: password}
 *               password: {type: string, format: password}
 *               passwordConfirm: {type: string, format: password}
 *     responses:
 *       200:
 *         description: Password updated successfully
 */
router.patch('/updateMyPassword', authController.updatePassword);

/**
 * @swagger
 * /api/v1/users/updateMe:
 *   patch:
 *     summary: Update current user data
 *     tags: [Users]
 *     security: [{bearerAuth: []}]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: {type: string}
 *               email: {type: string}
 *     responses:
 *       200:
 *         description: User updated successfully
 */
router.patch('/updateMe', userController.updateMe);

/**
 * @swagger
 * /api/v1/users/deleteMe:
 *   delete:
 *     summary: Deactivate current user
 *     tags: [Users]
 *     security: [{bearerAuth: []}]
 *     responses:
 *       204:
 *         description: User deactivated successfully
 */
router.delete('/deleteMe', userController.deleteMe);

/**
 * @swagger
 * /api/v1/users/me:
 *   get:
 *     summary: Get current user info
 *     tags: [Users]
 *     security: [{bearerAuth: []}]
 *     responses:
 *       200:
 *         description: Successfully retrieved user info
 */
router.get('/me', userController.getMe, userController.getUser);

router.use(authController.restrictTo('admin'));

/**
 * @swagger
 * /api/v1/users:
 *   get:
 *     summary: Get all users (Admin only)
 *     tags: [Users]
 *     security: [{bearerAuth: []}]
 *     responses:
 *       200:
 *         description: Successfully retrieved all users
 *   post:
 *     summary: Create a user (Admin only)
 *     tags: [Users]
 *     security: [{bearerAuth: []}]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: User created successfully
 */
router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);

/**
 * @swagger
 * /api/v1/users/{id}:
 *   get:
 *     summary: Get user by ID (Admin only)
 *     tags: [Users]
 *     security: [{bearerAuth: []}]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: {type: string}
 *     responses:
 *       200:
 *         description: Successfully retrieved user
 *   patch:
 *     summary: Update user (Admin only)
 *     tags: [Users]
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
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: User updated successfully
 *   delete:
 *     summary: Delete user (Admin only)
 *     tags: [Users]
 *     security: [{bearerAuth: []}]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: {type: string}
 *     responses:
 *       204:
 *         description: User deleted successfully
 */
router
  .route('/:id')
  .get(userController.getUser)
  .delete(userController.deleteUser)
  .patch(userController.updateUser);

module.exports = router;
