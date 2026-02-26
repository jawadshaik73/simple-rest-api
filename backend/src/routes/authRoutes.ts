import { Router } from 'express';
import { register, login, getProfile, forgotPassword, resetPassword } from '../controllers/authController';
import { registerValidation, loginValidation, validate } from '../middlewares/validation';
import { authenticate } from '../middlewares/auth';
import { authLimiter, resetLimiter } from '../middlewares/rateLimiter';

const router = Router();

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 minLength: 6
 *                 example: securePass123
 *               role:
 *                 type: string
 *                 enum: [user, admin]
 *                 default: user
 *               phoneNumber:
 *                 type: string
 *                 example: "+919876543210"
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       $ref: '#/components/schemas/User'
 *                     token:
 *                       type: string
 *       409:
 *         description: Email already exists
 */
router.post('/register', authLimiter, validate(registerValidation), register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login with email and password
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: securePass123
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       $ref: '#/components/schemas/User'
 *                     token:
 *                       type: string
 *       401:
 *         description: Invalid credentials
 */
router.post('/login', authLimiter, validate(loginValidation), login);

/**
 * @swagger
 * /auth/profile:
 *   get:
 *     summary: Get current user profile
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized
 */
router.get('/profile', authenticate, getProfile);

/**
 * @swagger
 * /auth/forgot-password:
 *   post:
 *     summary: Request password reset via email or SMS
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [method, contact]
 *             properties:
 *               method:
 *                 type: string
 *                 enum: [email, sms]
 *               contact:
 *                 type: string
 *                 description: Email address or phone number
 *                 example: user@example.com
 *     responses:
 *       200:
 *         description: Reset link/code sent
 *       404:
 *         description: User not found
 */
router.post('/forgot-password', resetLimiter, forgotPassword);

/**
 * @swagger
 * /auth/reset-password:
 *   post:
 *     summary: Reset password using code or token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [newPassword]
 *             properties:
 *               code:
 *                 type: string
 *                 description: 6-digit OTP code (for SMS reset)
 *                 example: "123456"
 *               token:
 *                 type: string
 *                 description: JWT reset token (for email reset)
 *               email:
 *                 type: string
 *                 description: User's email (required with token)
 *               newPassword:
 *                 type: string
 *                 minLength: 6
 *                 example: newSecurePass123
 *     responses:
 *       200:
 *         description: Password reset successfully
 *       400:
 *         description: Invalid code/token or missing fields
 */
router.post('/reset-password', resetLimiter, resetPassword);

export default router;
