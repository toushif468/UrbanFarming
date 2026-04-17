import express from 'express'
import {
    createRentalSpace,
    getAllRentalSpaces,
    updateRentalAvailability,
    deleteRentalSpace
} from '../controllers/rentalController.js'
import { verifyToken } from '../middlewares/authMiddleware.js'
import { authorizeRole } from '../middlewares/authMiddleware.js'

const router = express.Router()

router.get('/', getAllRentalSpaces)
router.post('/', verifyToken, authorizeRole('VENDOR'), createRentalSpace)
router.patch('/:id', verifyToken, authorizeRole('VENDOR'), updateRentalAvailability)
router.delete('/:id', verifyToken, authorizeRole('VENDOR'), deleteRentalSpace)

export default router