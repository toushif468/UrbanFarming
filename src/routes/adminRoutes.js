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


router.use(verifyToken, authorizeRole('ADMIN'))


router.get('/stats', getPlatformStats)


router.get('/users', getAllUsers)
router.get('/users/:id', getUserById)
router.patch('/users/:id/status', updateUserStatus)
router.delete('/users/:id', deleteUser)


router.patch('/vendors/:id/approve', approveVendor)


router.get('/orders', getAllOrders)

export default router