import prisma from '../config/db.js'
import { successResponse, errorResponse } from '../utils/apiResponse.js'

// Add Plant (Customer only)
export const addPlant = async (req, res) => {
    try {
        const { plantName, growthStage, healthStatus, notes, harvestDate } = req.body

        if (!plantName) return errorResponse(res, 'Plant name is required.', 400)

        const plant = await prisma.plantTracking.create({
            data: {
                userId: req.user.id,
                plantName,
                growthStage: growthStage || 'SEEDLING',
                healthStatus: healthStatus || 'HEALTHY',
                notes: notes || null,
                harvestDate: harvestDate ? new Date(harvestDate) : null
            }
        })

        return successResponse(res, 'Plant added successfully.', plant, 201)
    } catch (err) {
        return errorResponse(res, err.message, 500)
    }
}

// Get My Plants (Customer only)
export const getMyPlants = async (req, res) => {
    try {
        const plants = await prisma.plantTracking.findMany({
            where: { userId: req.user.id },
            orderBy: { createdAt: 'desc' }
        })

        return successResponse(res, 'Plants fetched.', plants)
    } catch (err) {
        return errorResponse(res, err.message, 500)
    }
}

// Get Single Plant
export const getPlantById = async (req, res) => {
    try {
        const plant = await prisma.plantTracking.findUnique({
            where: { id: parseInt(req.params.id) }
        })

        if (!plant) return errorResponse(res, 'Plant not found.', 404)
        if (plant.userId !== req.user.id) {
            return errorResponse(res, 'Unauthorized to view this plant.', 403)
        }

        return successResponse(res, 'Plant fetched.', plant)
    } catch (err) {
        return errorResponse(res, err.message, 500)
    }
}

// Update Plant (Customer only)
export const updatePlant = async (req, res) => {
    try {
        const { plantName, growthStage, healthStatus, notes, harvestDate } = req.body

        const plant = await prisma.plantTracking.findUnique({
            where: { id: parseInt(req.params.id) }
        })
        if (!plant) return errorResponse(res, 'Plant not found.', 404)
        if (plant.userId !== req.user.id) {
            return errorResponse(res, 'Unauthorized to update this plant.', 403)
        }

        const allowedGrowthStages = ['SEEDLING', 'VEGETATIVE', 'FLOWERING', 'FRUITING', 'HARVEST']
        const allowedHealthStatuses = ['HEALTHY', 'DISEASED', 'PEST_AFFECTED', 'WILTING', 'DEAD']

        if (growthStage && !allowedGrowthStages.includes(growthStage)) {
            return errorResponse(res, `Invalid growth stage. Use: ${allowedGrowthStages.join(', ')}`, 400)
        }
        if (healthStatus && !allowedHealthStatuses.includes(healthStatus)) {
            return errorResponse(res, `Invalid health status. Use: ${allowedHealthStatuses.join(', ')}`, 400)
        }

        const updated = await prisma.plantTracking.update({
            where: { id: parseInt(req.params.id) },
            data: {
                plantName,
                growthStage,
                healthStatus,
                notes,
                harvestDate: harvestDate ? new Date(harvestDate) : undefined
            }
        })

        return successResponse(res, 'Plant updated successfully.', updated)
    } catch (err) {
        return errorResponse(res, err.message, 500)
    }
}

// Delete Plant (Customer only)
export const deletePlant = async (req, res) => {
    try {
        const plant = await prisma.plantTracking.findUnique({
            where: { id: parseInt(req.params.id) }
        })
        if (!plant) return errorResponse(res, 'Plant not found.', 404)
        if (plant.userId !== req.user.id) {
            return errorResponse(res, 'Unauthorized to delete this plant.', 403)
        }

        await prisma.plantTracking.delete({
            where: { id: parseInt(req.params.id) }
        })

        return successResponse(res, 'Plant deleted successfully.')
    } catch (err) {
        return errorResponse(res, err.message, 500)
    }
}

// Get All Plants (Admin only)
export const getAllPlants = async (req, res) => {
    try {
        const plants = await prisma.plantTracking.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                user: { select: { name: true, email: true } }
            }
        })

        return successResponse(res, 'All plants fetched.', plants)
    } catch (err) {
        return errorResponse(res, err.message, 500)
    }
}