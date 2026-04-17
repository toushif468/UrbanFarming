import prisma from '../config/db.js'
import { successResponse, errorResponse } from '../utils/apiResponse.js'

// Create Post (Any logged in user)
export const createPost = async (req, res) => {
    try {
        const { postContent } = req.body

        if (!postContent) return errorResponse(res, 'Post content is required.', 400)

        const post = await prisma.communityPost.create({
            data: {
                userId: req.user.id,
                postContent
            }
        })

        return successResponse(res, 'Post created successfully.', post, 201)
    } catch (err) {
        return errorResponse(res, err.message, 500)
    }
}

// Get All Posts (Public) with pagination
export const getAllPosts = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 10
        const skip = (page - 1) * limit

        const [posts, total] = await Promise.all([
            prisma.communityPost.findMany({
                skip,
                take: limit,
                orderBy: { postDate: 'desc' },
                include: {
                    user: { select: { name: true, role: true } }
                }
            }),
            prisma.communityPost.count()
        ])

        return successResponse(res, 'Posts fetched.', {
            data: posts,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        })
    } catch (err) {
        return errorResponse(res, err.message, 500)
    }
}

// Delete Post (Admin or post owner)
export const deletePost = async (req, res) => {
    try {
        const post = await prisma.communityPost.findUnique({
            where: { id: parseInt(req.params.id) }
        })
        if (!post) return errorResponse(res, 'Post not found.', 404)

        const isOwner = post.userId === req.user.id
        const isAdmin = req.user.role === 'ADMIN'

        if (!isOwner && !isAdmin) {
            return errorResponse(res, 'Unauthorized to delete this post.', 403)
        }

        await prisma.communityPost.delete({
            where: { id: parseInt(req.params.id) }
        })

        return successResponse(res, 'Post deleted successfully.')
    } catch (err) {
        return errorResponse(res, err.message, 500)
    }
}