import express from 'express'
import { register, login } from '../controllers/authController.js'
import { authLimiter } from '../middlewares/rateLimiter.js'
import { register, login, logout } from '../controllers/authController.js'
import { verifyToken } from '../middlewares/authMiddleware.js'

const router = express.Router()

router.post('/register', authLimiter, register)
router.post('/login', authLimiter, login)
router.post('/logout', verifyToken, logout)
export default router