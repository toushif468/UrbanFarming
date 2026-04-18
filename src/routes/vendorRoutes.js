import express from 'express'
import {
    createVendorProfile,
    getMyVendorProfile,
    getAllVendors,
    approveVendor
} from '../controllers/vendorController.js'
import { verifyToken } from '../middlewares/authMiddleware.js'
import { authorizeRole } from '../middlewares/authMiddleware.js'

const router = express.Router()

router.post('/profile', verifyToken, authorizeRole('VENDOR'), createVendorProfile)
router.get('/profile/me', verifyToken, authorizeRole('VENDOR'), getMyVendorProfile)

router.get('/all', verifyToken, authorizeRole('ADMIN'), getAllVendors)
router.patch('/approve/:id', verifyToken, authorizeRole('ADMIN'), approveVendor)

export default router