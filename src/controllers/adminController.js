import prisma from '../config/db.js'
import { successResponse, errorResponse } from '../utils/apiResponse.js'

export const getAllUsers = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 10
        const skip = (page - 1) * limit

        const [users, total] = await Promise.all([
            prisma.user.findMany({
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true,
                    status: true,
                    createdAt: true
                }
            }),
            prisma.user.count()
        ])

        return successResponse(res, 'All users fetched.', {
            data: users,
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


export const getUserById = async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: parseInt(req.params.id) },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                status: true,
                createdAt: true,
                vendorProfile: true
            }
        })

        if (!user) return errorResponse(res, 'User not found.', 404)

        return successResponse(res, 'User fetched.', user)
    } catch (err) {
        return errorResponse(res, err.message, 500)
    }
}


export const updateUserStatus = async (req, res) => {
    try {
        const { status } = req.body
        const allowedStatuses = ['active', 'suspended', 'banned']

        if (!allowedStatuses.includes(status)) {
            return errorResponse(res, 'Invalid status. Use: active, suspended, banned.', 400)
        }

        const user = await prisma.user.findUnique({
            where: { id: parseInt(req.params.id) }
        })
        if (!user) return errorResponse(res, 'User not found.', 404)

        if (user.role === 'ADMIN') {
            return errorResponse(res, 'Cannot change status of an admin.', 403)
        }

        const updated = await prisma.user.update({
            where: { id: parseInt(req.params.id) },
            data: { status },
            select: { id: true, name: true, email: true, role: true, status: true }
        })

        return successResponse(res, `User status updated to ${status}.`, updated)
    } catch (err) {
        return errorResponse(res, err.message, 500)
    }
}


export const deleteUser = async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: parseInt(req.params.id) }
        })
        if (!user) return errorResponse(res, 'User not found.', 404)

        if (user.role === 'ADMIN') {
            return errorResponse(res, 'Cannot delete an admin account.', 403)
        }

        await prisma.user.delete({ where: { id: parseInt(req.params.id) } })

        return successResponse(res, 'User deleted successfully.')
    } catch (err) {
        return errorResponse(res, err.message, 500)
    }
}


export const getPlatformStats = async (req, res) => {
    try {
        const [
            totalUsers,
            totalVendors,
            totalCustomers,
            totalProduce,
            totalOrders,
            totalRentals,
            totalPosts,
            totalCerts,
            pendingCerts
        ] = await Promise.all([
            prisma.user.count(),
            prisma.user.count({ where: { role: 'VENDOR' } }),
            prisma.user.count({ where: { role: 'CUSTOMER' } }),
            prisma.produce.count(),
            prisma.order.count(),
            prisma.rentalSpace.count(),
            prisma.communityPost.count(),
            prisma.sustainabilityCert.count(),
            prisma.vendorProfile.count({ where: { certificationStatus: 'PENDING' } })
        ])

        return successResponse(res, 'Platform stats fetched.', {
            users: {
                total: totalUsers,
                vendors: totalVendors,
                customers: totalCustomers
            },
            produce: totalProduce,
            orders: totalOrders,
            rentalSpaces: totalRentals,
            communityPosts: totalPosts,
            certifications: {
                total: totalCerts,
                pendingApproval: pendingCerts
            }
        })
    } catch (err) {
        return errorResponse(res, err.message, 500)
    }
}


export const approveVendor = async (req, res) => {
    try {
        const vendor = await prisma.vendorProfile.findUnique({
            where: { id: parseInt(req.params.id) }
        })
        if (!vendor) return errorResponse(res, 'Vendor not found.', 404)

        const updated = await prisma.vendorProfile.update({
            where: { id: parseInt(req.params.id) },
            data: { certificationStatus: 'APPROVED' }
        })

        return successResponse(res, 'Vendor approved successfully.', updated)
    } catch (err) {
        return errorResponse(res, err.message, 500)
    }
}


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
                    user: { select: { name: true, email: true } },
                    produce: { select: { name: true, price: true } }
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