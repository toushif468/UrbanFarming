import express from 'express'
import { createPost, getAllPosts, deletePost } from '../controllers/forumController.js'
import { verifyToken } from '../middlewares/authMiddleware.js'

const router = express.Router()
// forumroutes
router.get('/', getAllPosts)                         
router.post('/', verifyToken, createPost)           
router.delete('/:id', verifyToken, deletePost)      

export default router