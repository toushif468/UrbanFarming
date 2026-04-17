import prisma from '../config/db.js'
import { successResponse, errorResponse } from '../utils/apiResponse.js'

// Place Order (Customer only)
export const placeOrder = async (req, res) => {
    try {
        const { produceId } = req.body
        const userId = req.user.id

        // Check produce exists
        const produce = await prisma.produce.findUnique({
            where: { id: parseInt(produceId) }
        })
        if (!produce) return errorResponse(res, 'Produce not found.', 404)

        // Check availability
        if (produce.availableQuantity < 1) {
            return errorResponse(res, 'Produce is out of stock.', 400)
        }

        // Create order and reduce quantity
        const [order] = await prisma.$transaction([
            prisma.order.create({
                data: {
                    userId,
                    produceId: produce.id,
                    vendorId: produce.vendorId,
                    status: 'PENDING'
                }
            }),
            prisma.produce.update({
                where: { id: produce.id },
                data: { availableQuantity: produce.availableQuantity - 1 }
            })
        ])

        return successResponse(res, 'Order placed successfully.', order, 201)
    } catch (err) {
        return errorResponse(res, err.message, 500)
    }
}

// Get My Orders (Customer) with pagination
export const getMyOrders = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 10
        const skip = (page - 1) * limit

        const [orders, total] = await Promise.all([
            prisma.order.findMany({
                where: { userId: req.user.id },
                skip,
                take: limit,
                orderBy: { orderDate: 'desc' },
                include: {
                    produce: { select: { name: true, price: true, category: true } }
                }
            }),
            prisma.order.count({ where: { userId: req.user.id } })
        ])

        return successResponse(res, 'Orders fetched.', {
            data: orders,
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

// Get Vendor Orders (Vendor only)
export const getVendorOrders = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 10
        const skip = (page - 1) * limit

        const vendor = await prisma.vendorProfile.findUnique({
            where: { userId: req.user.id }
        })
        if (!vendor) return errorResponse(res, 'Vendor profile not found.', 404)

        const [orders, total] = await Promise.all([
            prisma.order.findMany({
                where: { vendorId: vendor.id },
                skip,
                take: limit,
                orderBy: { orderDate: 'desc' },
                include: {
                    produce: { select: { name: true, price: true } },
                    user: { select: { name: true, email: true } }
                }
            }),
            prisma.order.count({ where: { vendorId: vendor.id } })
        ])

        return successResponse(res, 'Vendor orders fetched.', {
            data: orders,
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

// Update Order Status (Vendor only)
export const updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body
        const allowedStatuses = ['PENDING', 'CONFIRMED', 'DELIVERED', 'CANCELLED']

        if (!allowedStatuses.includes(status)) {
            return errorResponse(res, 'Invalid status.', 400)
        }

        const vendor = await prisma.vendorProfile.findUnique({
            where: { userId: req.user.id }
        })
        if (!vendor) return errorResponse(res, 'Vendor profile not found.', 404)

        const order = await prisma.order.findUnique({
            where: { id: parseInt(req.params.id) }
        })
        if (!order) return errorResponse(res, 'Order not found.', 404)
        if (order.vendorId !== vendor.id) {
            return errorResponse(res, 'Unauthorized to update this order.', 403)
        }

        const updated = await prisma.order.update({
            where: { id: parseInt(req.params.id) },
            data: { status }
        })

        return successResponse(res, 'Order status updated.', updated)
    } catch (err) {
        return errorResponse(res, err.message, 500)
    }
}

// Get All Orders (Admin only)
export const getAllOrders = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 10
        const skip = (page - 1) * limit

        const [orders, total] = await Promise.all([
            prisma.order.findMany({
                skip,
                take: limit,
                orderBy: { orderDate: 'desc' },
                include: {
                    produce: { select: { name: true, price: true } },
                    user: { select: { name: true, email: true } }
                }
            }),
            prisma.order.count()
        ])

        return successResponse(res, 'All orders fetched.', {
            data: orders,
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