import express from 'express'
import {
    submitCertification,
    getMyCertifications,
    getAllCertifications,
    approveCertification,
    rejectCertification
} from '../controllers/certController.js'
import { verifyToken } from '../middlewares/authMiddleware.js'
import { authorizeRole } from '../middlewares/authMiddleware.js'

const router = express.Router()


router.post('/', verifyToken, authorizeRole('VENDOR'), submitCertification)
router.get('/my', verifyToken, authorizeRole('VENDOR'), getMyCertifications)


router.get('/all', verifyToken, authorizeRole('ADMIN'), getAllCertifications)
router.patch('/:id/approve', verifyToken, authorizeRole('ADMIN'), approveCertification)
router.patch('/:id/reject', verifyToken, authorizeRole('ADMIN'), rejectCertification)

export default router