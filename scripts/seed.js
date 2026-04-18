import { PrismaClient } from '../generated/prisma/index.js'
import { faker } from '@faker-js/faker'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
    console.log('🌱 Seeding started...')

    // Clean existing data - ORDER MATTERS (children before parents)
    await prisma.plantTracking.deleteMany()
    await prisma.sustainabilityCert.deleteMany()
    await prisma.communityPost.deleteMany()
    await prisma.order.deleteMany()
    await prisma.produce.deleteMany()
    await prisma.rentalSpace.deleteMany()
    await prisma.vendorProfile.deleteMany()
    await prisma.user.deleteMany()

    console.log('🗑️  Cleaned existing data')

    // ─── 1. Create Admin ───────────────────────────────────────────
    const adminPassword = await bcrypt.hash('admin123', 10)
    const admin = await prisma.user.create({
        data: {
            name: 'Platform Admin',
            email: 'admin@urbanfarming.com',
            password: adminPassword,
            role: 'ADMIN',
            status: 'active'
        }
    })
    console.log('✅ Admin created:', admin.email)

    // ─── 2. Create 10 Vendors ──────────────────────────────────────
    const vendorUsers = []
    for (let i = 0; i < 10; i++) {
        const password = await bcrypt.hash('vendor123', 10)
        const user = await prisma.user.create({
            data: {
                name: faker.person.fullName(),
                email: faker.internet.email(),
                password,
                role: 'VENDOR',
                status: 'active'
            }
        })
        vendorUsers.push(user)
    }
    console.log('✅ 10 Vendor users created')

    // ─── 3. Create Vendor Profiles ─────────────────────────────────
    const vendorProfiles = []
    for (const user of vendorUsers) {
        const profile = await prisma.vendorProfile.create({
            data: {
                userId: user.id,
                farmName: faker.company.name() + ' Farm',
                farmLocation: faker.location.city() + ', Bangladesh',
                certificationStatus: faker.helpers.arrayElement([
                    'PENDING', 'APPROVED', 'REJECTED'
                ])
            }
        })
        vendorProfiles.push(profile)
    }
    console.log('✅ 10 Vendor profiles created')

    // ─── 4. Create 100 Produce items ──────────────────────────────
    const categories = ['Vegetables', 'Fruits', 'Herbs', 'Seeds', 'Tools']
    const produceNames = [
        'Tomatoes', 'Spinach', 'Carrots', 'Lettuce', 'Peppers',
        'Cucumbers', 'Mangoes', 'Bananas', 'Basil', 'Mint',
        'Sunflower Seeds', 'Pumpkin Seeds', 'Garden Trowel', 'Watering Can',
        'Eggplant', 'Okra', 'Bitter Gourd', 'Bottle Gourd', 'Radish', 'Garlic'
    ]

    for (let i = 0; i < 100; i++) {
        const vendor = faker.helpers.arrayElement(vendorProfiles)
        await prisma.produce.create({
            data: {
                vendorId: vendor.id,
                name: faker.helpers.arrayElement(produceNames),
                description: faker.lorem.sentence(),
                price: parseFloat(faker.commerce.price({ min: 1, max: 500 })),
                category: faker.helpers.arrayElement(categories),
                certificationStatus: faker.helpers.arrayElement([
                    'PENDING', 'APPROVED'
                ]),
                availableQuantity: faker.number.int({ min: 1, max: 200 })
            }
        })
    }
    console.log('✅ 100 Produce items created')

    // ─── 5. Create 5 Customers ────────────────────────────────────
    const customers = []
    for (let i = 0; i < 5; i++) {
        const password = await bcrypt.hash('customer123', 10)
        const user = await prisma.user.create({
            data: {
                name: faker.person.fullName(),
                email: faker.internet.email(),
                password,
                role: 'CUSTOMER',
                status: 'active'
            }
        })
        customers.push(user)
    }
    console.log('✅ 5 Customer users created')

    // ─── 6. Create Community Posts ────────────────────────────────
    const allUsers = [...vendorUsers, ...customers]
    for (let i = 0; i < 20; i++) {
        const user = faker.helpers.arrayElement(allUsers)
        await prisma.communityPost.create({
            data: {
                userId: user.id,
                postContent: faker.lorem.paragraph()
            }
        })
    }
    console.log('✅ 20 Community posts created')

    // ─── 7. Create Rental Spaces ──────────────────────────────────
    for (const vendor of vendorProfiles) {
        await prisma.rentalSpace.create({
            data: {
                vendorId: vendor.id,
                location: faker.location.city() + ', Bangladesh',
                size: faker.helpers.arrayElement([
                    '5x5 meters', '10x10 meters', '20x20 meters', '50x50 meters'
                ]),
                price: parseFloat(faker.commerce.price({ min: 100, max: 5000 })),
                availability: faker.datatype.boolean()
            }
        })
    }
    console.log('✅ 10 Rental spaces created')

    // ─── 8. Create Sustainability Certs ───────────────────────────
    for (const vendor of vendorProfiles) {
        await prisma.sustainabilityCert.create({
            data: {
                vendorId: vendor.id,
                certifyingAgency: faker.helpers.arrayElement([
                    'Bangladesh Organic Board',
                    'Green Cert Asia',
                    'Eco Verified BD',
                    'Organic Trust Foundation'
                ]),
                certificationDate: faker.date.past()
            }
        })
    }
    console.log('✅ 10 Sustainability certs created')

    // ─── 9. Create Plant Tracking entries ─────────────────────────
    const growthStages = ['SEEDLING', 'VEGETATIVE', 'FLOWERING', 'FRUITING', 'HARVEST']
    const healthStatuses = ['HEALTHY', 'DISEASED', 'PEST_AFFECTED', 'WILTING', 'DEAD']
    const plantNames = ['Tomato', 'Spinach', 'Basil', 'Carrot', 'Pepper', 'Cucumber', 'Mint', 'Lettuce']

    for (let i = 0; i < 10; i++) {
        const customer = faker.helpers.arrayElement(customers)
        await prisma.plantTracking.create({
            data: {
                userId: customer.id,
                plantName: faker.helpers.arrayElement(plantNames),
                growthStage: faker.helpers.arrayElement(growthStages),
                healthStatus: faker.helpers.arrayElement(healthStatuses),
                notes: faker.lorem.sentence(),
                harvestDate: faker.date.future()
            }
        })
    }
    console.log('✅ 10 Plant tracking entries created')

    console.log('\n🎉 Seeding completed successfully!')
    console.log('─────────────────────────────────')
    console.log('Admin login:    admin@urbanfarming.com / admin123')
    console.log('Vendor login:   (check DB for emails) / vendor123')
    console.log('Customer login: (check DB for emails) / customer123')
}

main()
    .catch((e) => {
        console.error('❌ Seeding failed:', e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })