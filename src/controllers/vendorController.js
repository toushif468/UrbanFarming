import prisma from '../config/db.js'
import { successResponse, errorResponse } from '../utils/apiResponse.js'

// Create Vendor Profile (Vendor only)
export const createVendorProfile = async (req, res) => {
    try {
        const { farmName, farmLocation } = req.body
        const userId = req.user.id

        const existing = await prisma.vendorProfile.findUnique({ where: { userId } })
        if (existing) {
            return errorResponse(res, 'Vendor profile already exists.', 409)
        }

        const profile = await prisma.vendorProfile.create({
            data: { userId, farmName, farmLocation }
        })

        return successResponse(res, 'Vendor profile created.', profile, 201)
    } catch (err) {
        return errorResponse(res, err.message, 500)
    }
}

// Get My Vendor Profile
export const getMyVendorProfile = async (req, res) => {
    try {
        const profile = await prisma.vendorProfile.findUnique({
            where: { userId: req.user.id },
            include: { user: { select: { name: true, email: true } } }
        })

        if (!profile) return errorResponse(res, 'Vendor profile not found.', 404)

        return successResponse(res, 'Vendor profile fetched.', profile)
    } catch (err) {
        return errorResponse(res, err.message, 500)
    }
}

// Get All Vendors (Admin only)
export const getAllVendors = async (req, res) => {
    try {
        const vendors = await prisma.vendorProfile.findMany({
            include: { user: { select: { name: true, email: true } } }
        })

        return successResponse(res, 'All vendors fetched.', vendors)
    } catch (err) {
        return errorResponse(res, err.message, 500)
    }
}

// Approve Vendor (Admin only)
export const approveVendor = async (req, res) => {
    try {
        const { id } = req.params

        const vendor = await prisma.vendorProfile.update({
            where: { id: parseInt(id) },
            data: { certificationStatus: 'APPROVED' }
        })

        return successResponse(res, 'Vendor approved.', vendor)
    } catch (err) {
        return errorResponse(res, err.message, 500)
    }
}