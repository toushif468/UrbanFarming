import express from 'express'
import {
    addPlant,
    getMyPlants,
    getPlantById,
    updatePlant,
    deletePlant,
    getAllPlants
} from '../controllers/plantController.js'
import { verifyToken } from '../middlewares/authMiddleware.js'
import { authorizeRole } from '../middlewares/authMiddleware.js'

const router = express.Router()

// Customer routes
router.post('/', verifyToken, authorizeRole('CUSTOMER'), addPlant)
router.get('/my', verifyToken, authorizeRole('CUSTOMER'), getMyPlants)
router.get('/:id', verifyToken, authorizeRole('CUSTOMER'), getPlantById)
router.put('/:id', verifyToken, authorizeRole('CUSTOMER'), updatePlant)
router.delete('/:id', verifyToken, authorizeRole('CUSTOMER'), deletePlant)

// Admin routes
router.get('/', verifyToken, authorizeRole('ADMIN'), getAllPlants)

export default router