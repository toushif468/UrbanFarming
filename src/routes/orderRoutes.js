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

router.post('/', verifyToken, authorizeRole('CUSTOMER'), placeOrder)
router.get('/my', verifyToken, authorizeRole('CUSTOMER'), getMyOrders)

router.get('/vendor', verifyToken, authorizeRole('VENDOR'), getVendorOrders)
router.patch('/:id/status', verifyToken, authorizeRole('VENDOR'), updateOrderStatus)

router.get('/all', verifyToken, authorizeRole('ADMIN'), getAllOrders)

export default router