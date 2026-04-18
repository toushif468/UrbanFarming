import prisma from '../config/db.js'
import { successResponse, errorResponse } from '../utils/apiResponse.js'


export const submitCertification = async (req, res) => {
    try {
        const { certifyingAgency, certificationDate } = req.body

        const vendor = await prisma.vendorProfile.findUnique({
            where: { userId: req.user.id }
        })
        if (!vendor) return errorResponse(res, 'Vendor profile not found.', 404)

        const cert = await prisma.sustainabilityCert.create({
            data: {
                vendorId: vendor.id,
                certifyingAgency,
                certificationDate: new Date(certificationDate)
            }
        })

        return successResponse(res, 'Certification submitted successfully.', cert, 201)
    } catch (err) {
        return errorResponse(res, err.message, 500)
    }
}


export const getMyCertifications = async (req, res) => {
    try {
        const vendor = await prisma.vendorProfile.findUnique({
            where: { userId: req.user.id }
        })
        if (!vendor) return errorResponse(res, 'Vendor profile not found.', 404)

        const certs = await prisma.sustainabilityCert.findMany({
            where: { vendorId: vendor.id },
            orderBy: { certificationDate: 'desc' }
        })

        return successResponse(res, 'Certifications fetched.', certs)
    } catch (err) {
        return errorResponse(res, err.message, 500)
    }
}


export const getAllCertifications = async (req, res) => {
    try {
        const certs = await prisma.sustainabilityCert.findMany({
            orderBy: { certificationDate: 'desc' },
            include: {
                vendor: {
                    select: {
                        farmName: true,
                        farmLocation: true,
                        certificationStatus: true,
                        user: { select: { name: true, email: true } }
                    }
                }
            }
        })

        return successResponse(res, 'All certifications fetched.', certs)
    } catch (err) {
        return errorResponse(res, err.message, 500)
    }
}


export const approveCertification = async (req, res) => {
    try {
        const cert = await prisma.sustainabilityCert.findUnique({
            where: { id: parseInt(req.params.id) }
        })
        if (!cert) return errorResponse(res, 'Certification not found.', 404)

        // Update vendor certification status
        const vendor = await prisma.vendorProfile.update({
            where: { id: cert.vendorId },
            data: { certificationStatus: 'APPROVED' }
        })

        return successResponse(res, 'Certification approved. Vendor is now certified.', vendor)
    } catch (err) {
        return errorResponse(res, err.message, 500)
    }
}


export const rejectCertification = async (req, res) => {
    try {
        const cert = await prisma.sustainabilityCert.findUnique({
            where: { id: parseInt(req.params.id) }
        })
        if (!cert) return errorResponse(res, 'Certification not found.', 404)

        const vendor = await prisma.vendorProfile.update({
            where: { id: cert.vendorId },
            data: { certificationStatus: 'REJECTED' }
        })

        return successResponse(res, 'Certification rejected.', vendor)
    } catch (err) {
        return errorResponse(res, err.message, 500)
    }
}