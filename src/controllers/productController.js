import prisma from '../config/db.js'
import { successResponse, errorResponse } from '../utils/apiResponse.js'

// Create Produce (Vendor only)
export const createProduce = async (req, res) => {
    try {
        const { name, description, price, category, availableQuantity } = req.body

        // Get vendor profile from logged in user
        const vendor = await prisma.vendorProfile.findUnique({
            where: { userId: req.user.id }
        })
        if (!vendor) return errorResponse(res, 'Vendor profile not found.', 404)

        const produce = await prisma.produce.create({
            data: {
                vendorId: vendor.id,
                name,
                description,
                price: parseFloat(price),
                category,
                availableQuantity: parseInt(availableQuantity),
                certificationStatus: 'PENDING'
            }
        })

        return successResponse(res, 'Produce listed successfully.', produce, 201)
    } catch (err) {
        return errorResponse(res, err.message, 500)
    }
}

// Get All Produce (Public) with pagination
export const getAllProduce = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 10
        const skip = (page - 1) * limit
        const { category } = req.query

        const where = category ? { category } : {}

        const [produce, total] = await Promise.all([
            prisma.produce.findMany({
                where,
                skip,
                take: limit,
                orderBy: { id: 'desc' }
            }),
            prisma.produce.count({ where })
        ])

        return successResponse(res, 'Produce fetched.', {
            data: produce,
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

// Get Single Produce
export const getProduceById = async (req, res) => {
    try {
        const produce = await prisma.produce.findUnique({
            where: { id: parseInt(req.params.id) }
        })
        if (!produce) return errorResponse(res, 'Produce not found.', 404)

        return successResponse(res, 'Produce fetched.', produce)
    } catch (err) {
        return errorResponse(res, err.message, 500)
    }
}

// Update Produce (Vendor only)
export const updateProduce = async (req, res) => {
    try {
        const { name, description, price, category, availableQuantity } = req.body

        const vendor = await prisma.vendorProfile.findUnique({
            where: { userId: req.user.id }
        })
        if (!vendor) return errorResponse(res, 'Vendor profile not found.', 404)

        const produce = await prisma.produce.findUnique({
            where: { id: parseInt(req.params.id) }
        })
        if (!produce) return errorResponse(res, 'Produce not found.', 404)
        if (produce.vendorId !== vendor.id) {
            return errorResponse(res, 'Unauthorized to update this produce.', 403)
        }

        const updated = await prisma.produce.update({
            where: { id: parseInt(req.params.id) },
            data: { name, description, price: parseFloat(price), category, availableQuantity: parseInt(availableQuantity) }
        })

        return successResponse(res, 'Produce updated.', updated)
    } catch (err) {
        return errorResponse(res, err.message, 500)
    }
}

// Delete Produce (Vendor only)
export const deleteProduce = async (req, res) => {
    try {
        const vendor = await prisma.vendorProfile.findUnique({
            where: { userId: req.user.id }
        })
        if (!vendor) return errorResponse(res, 'Vendor profile not found.', 404)

        const produce = await prisma.produce.findUnique({
            where: { id: parseInt(req.params.id) }
        })
        if (!produce) return errorResponse(res, 'Produce not found.', 404)
        if (produce.vendorId !== vendor.id) {
            return errorResponse(res, 'Unauthorized to delete this produce.', 403)
        }

        await prisma.produce.delete({ where: { id: parseInt(req.params.id) } })

        return successResponse(res, 'Produce deleted successfully.')
    } catch (err) {
        return errorResponse(res, err.message, 500)
    }
}