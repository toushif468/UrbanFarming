import { PrismaClient } from '../generated/prisma/index.js'
import { faker } from '@faker-js/faker'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
    console.log('🌱 Seeding started...')


    await prisma.sustainabilityCert.deleteMany()
    await prisma.communityPost.deleteMany()
    await prisma.order.deleteMany()
    await prisma.produce.deleteMany()
    await prisma.rentalSpace.deleteMany()
    await prisma.vendorProfile.deleteMany()
    await prisma.user.deleteMany()

    console.log('🗑️  Cleaned existing data')

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
    console.log('✅ Rental spaces created')

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
    console.log('✅ Sustainability certs created')

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