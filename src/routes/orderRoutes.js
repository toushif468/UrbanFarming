import express from 'express'
import {
    placeOrder,
    getMyOrders,
    getVendorOrders,
    updateOrderStatus,
    getAllOrders
} from '../controllers/orderController.js'
import { verifyToken } from '../middlewares/authMiddleware.js'
import { authorizeRole } from '../middlewares/authMiddleware.js'

const router = express.Router()

// Customer routes
router.post('/', verifyToken, authorizeRole('CUSTOMER'), placeOrder)
router.get('/my', verifyToken, authorizeRole('CUSTOMER'), getMyOrders)

// Vendor routes
router.get('/vendor', verifyToken, authorizeRole('VENDOR'), getVendorOrders)
router.patch('/:id/status', verifyToken, authorizeRole('VENDOR'), updateOrderStatus)

// Admin routes
router.get('/all', verifyToken, authorizeRole('ADMIN'), getAllOrders)

export default router