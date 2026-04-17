import express from 'express'
import { createPost, getAllPosts, deletePost } from '../controllers/forumController.js'
import { verifyToken } from '../middlewares/authMiddleware.js'

const router = express.Router()

router.get('/', getAllPosts)                          // Public
router.post('/', verifyToken, createPost)            // Any logged in user
router.delete('/:id', verifyToken, deletePost)       // Owner or Admin

export default router