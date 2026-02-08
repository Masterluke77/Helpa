import { auth } from "@/auth"
import { prisma } from "@helpa/db"
import { NextResponse } from "next/server"

export async function GET() {
    const session = await auth()
    if (!session?.user) return new NextResponse("Unauthorized", { status: 401 })

    const chats = await prisma.chat.findMany({
        where: {
            participants: { has: session.user.id }
        },
        include: {
            request: { select: { title: true } },
            messages: {
                orderBy: { createdAt: 'desc' },
                take: 1
            }
        }
    })

    // We need to enrich with other participant name.
    // Since participants is array of IDs, we need to fetch user names.
    // Ideally, Prisma relation would be better but array is flexible.
    // Let's filter out 'me' from participants and fetch user.

    const enrichedChats = await Promise.all(chats.map(async (chat) => {
        const otherUserId = chat.participants.find(id => id !== session.user.id)
        let otherUser = null
        if (otherUserId) {
            otherUser = await prisma.user.findUnique({
                where: { id: otherUserId },
                select: { name: true, image: true }
            })
        }
        return { ...chat, otherUser }
    }))

    return NextResponse.json(enrichedChats)
}
