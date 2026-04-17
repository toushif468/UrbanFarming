import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { errorHandler } from './src/middlewares/errorHandler.js'
import authRoutes from './src/routes/authRoutes.js'
import vendorRoutes from './src/routes/vendorRoutes.js'
import marketplaceRoutes from './src/routes/marketplaceRoutes.js'
import orderRoutes from './src/routes/orderRoutes.js'
import forumRoutes from './src/routes/forumRoutes.js'
import rentalRoutes from './src/routes/rentalRoutes.js'
import certRoutes from './src/routes/certRoutes.js'
import { setupSwagger } from './src/docs/swagger.js'
import adminRoutes from './src/routes/adminRoutes.js'
import plantRoutes from './src/routes/plantRoutes.js'
const app = express()
const PORT = process.env.PORT || 4000

app.use(cors())
app.use(express.json())

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/vendors', vendorRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/forum', forumRoutes)
app.use('/api/rentals', rentalRoutes)
app.use('/api/produce', marketplaceRoutes)
app.use('/api/certs', certRoutes)
app.use('/api/plants', plantRoutes)


app.use('/api/admin', adminRoutes)

// Error handler (must be last)
app.use(errorHandler)
setupSwagger(app)
app.listen(PORT, () => {
    console.log(`Server running at port: ${PORT}`)
})