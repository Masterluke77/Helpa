
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    const admin = await prisma.user.upsert({
        where: { email: 'admin@helpa.local' },
        update: {},
        create: {
            email: 'admin@helpa.local',
            name: 'Admin User',
            latitude: 52.5200,
            longitude: 13.4050, // Berlin
            role: 'ADMIN', // Need to add role to User model if strictly required, but for now just seed
        },
    })

    const user = await prisma.user.upsert({
        where: { email: 'user@helpa.local' },
        update: {},
        create: {
            email: 'user@helpa.local',
            name: 'Normal User',
            latitude: 52.5100,
            longitude: 13.4000,
        },
    })

    console.log({ admin, user })
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
