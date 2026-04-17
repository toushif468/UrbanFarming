import express from 'express'
import {
    getAllUsers,
    getUserById,
    updateUserStatus,
    deleteUser,
    getPlatformStats,
    approveVendor,
    getAllOrders
} from '../controllers/adminController.js'
import { verifyToken } from '../middlewares/authMiddleware.js'
import { authorizeRole } from '../middlewares/authMiddleware.js'

const router = express.Router()

// All admin routes require ADMIN role
router.use(verifyToken, authorizeRole('ADMIN'))

// Platform stats
router.get('/stats', getPlatformStats)

// User management
router.get('/users', getAllUsers)
router.get('/users/:id', getUserById)
router.patch('/users/:id/status', updateUserStatus)
router.delete('/users/:id', deleteUser)

// Vendor management
router.patch('/vendors/:id/approve', approveVendor)

// Order overview
router.get('/orders', getAllOrders)

export default router