import express from 'express'
import {
    createProduce,
    getAllProduce,
    getProduceById,
    updateProduce,
    deleteProduce
} from '../controllers/productController.js'
import { verifyToken } from '../middlewares/authMiddleware.js'
import { authorizeRole } from '../middlewares/authMiddleware.js'

const router = express.Router()

router.get('/', getAllProduce)
router.get('/:id', getProduceById)

router.post('/', verifyToken, authorizeRole('VENDOR'), createProduce)
router.put('/:id', verifyToken, authorizeRole('VENDOR'), updateProduce)
router.delete('/:id', verifyToken, authorizeRole('VENDOR'), deleteProduce)

export default router