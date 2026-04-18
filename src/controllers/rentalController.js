import prisma from '../config/db.js'
import { successResponse, errorResponse } from '../utils/apiResponse.js'


export const createRentalSpace = async (req, res) => {
    try {
        const { location, size, price } = req.body

        const vendor = await prisma.vendorProfile.findUnique({
            where: { userId: req.user.id }
        })
        if (!vendor) return errorResponse(res, 'Vendor profile not found.', 404)

        const space = await prisma.rentalSpace.create({
            data: {
                vendorId: vendor.id,
                location,
                size,
                price: parseFloat(price),
                availability: true
            }
        })

        return successResponse(res, 'Rental space created.', space, 201)
    } catch (err) {
        return errorResponse(res, err.message, 500)
    }
}


export const getAllRentalSpaces = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 10
        const skip = (page - 1) * limit
        const { location } = req.query

        const where = location
            ? { location: { contains: location, mode: 'insensitive' } }
            : {}

        const [spaces, total] = await Promise.all([
            prisma.rentalSpace.findMany({
                where,
                skip,
                take: limit,
                orderBy: { id: 'desc' }
            }),
            prisma.rentalSpace.count({ where })
        ])

        return successResponse(res, 'Rental spaces fetched.', {
            data: spaces,
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


export const updateRentalAvailability = async (req, res) => {
    try {
        const { availability } = req.body

        const vendor = await prisma.vendorProfile.findUnique({
            where: { userId: req.user.id }
        })
        if (!vendor) return errorResponse(res, 'Vendor profile not found.', 404)

        const space = await prisma.rentalSpace.findUnique({
            where: { id: parseInt(req.params.id) }
        })
        if (!space) return errorResponse(res, 'Rental space not found.', 404)
        if (space.vendorId !== vendor.id) {
            return errorResponse(res, 'Unauthorized to update this space.', 403)
        }

        const updated = await prisma.rentalSpace.update({
            where: { id: parseInt(req.params.id) },
            data: { availability }
        })

        return successResponse(res, 'Rental space updated.', updated)
    } catch (err) {
        return errorResponse(res, err.message, 500)
    }
}


export const deleteRentalSpace = async (req, res) => {
    try {
        const vendor = await prisma.vendorProfile.findUnique({
            where: { userId: req.user.id }
        })
        if (!vendor) return errorResponse(res, 'Vendor profile not found.', 404)

        const space = await prisma.rentalSpace.findUnique({
            where: { id: parseInt(req.params.id) }
        })
        if (!space) return errorResponse(res, 'Rental space not found.', 404)
        if (space.vendorId !== vendor.id) {
            return errorResponse(res, 'Unauthorized to delete this space.', 403)
        }

        await prisma.rentalSpace.delete({
            where: { id: parseInt(req.params.id) }
        })

        return successResponse(res, 'Rental space deleted.')
    } catch (err) {
        return errorResponse(res, err.message, 500)
    }
}