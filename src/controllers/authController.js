import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import prisma from '../config/db.js'
import { successResponse, errorResponse } from '../utils/apiResponse.js'

// REGISTER
export const register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({ where: { email } })
        if (existingUser) {
            return errorResponse(res, 'Email already registered.', 409)
        }

        // Validate role
        const allowedRoles = ['CUSTOMER', 'VENDOR']
        if (role && !allowedRoles.includes(role)) {
            return errorResponse(res, 'Invalid role.', 400)
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10)

        // Create user
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: role || 'CUSTOMER'
            }
        })

        return successResponse(res, 'User registered successfully.', {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
        }, 201)

    } catch (err) {
        return errorResponse(res, err.message, 500)
    }
}

// LOGIN
export const login = async (req, res) => {
    try {
        const { email, password } = req.body

        // Find user
        const user = await prisma.user.findUnique({ where: { email } })
        if (!user) {
            return errorResponse(res, 'Invalid email or password.', 401)
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return errorResponse(res, 'Invalid email or password.', 401)
        }

        // Generate token
        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        )

        return successResponse(res, 'Login successful.', {
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        })

    } catch (err) {
        return errorResponse(res, err.message, 500)
    }
}