import { auth } from "@/auth"
import { prisma } from "@helpa/db"
import { NextResponse } from "next/server"

export async function GET(req: Request, { params }: { params: { id: string } }) {
    const session = await auth()
    if (!session?.user) return new NextResponse("Unauthorized", { status: 401 })

    // Check participation
    const chat = await prisma.chat.findUnique({
        where: { id: params.id },
        select: { participants: true }
    })

    if (!chat || !chat.participants.includes(session.user.id)) {
        return new NextResponse("Forbidden", { status: 403 })
    }

    const messages = await prisma.message.findMany({
        where: { chatId: params.id },
        orderBy: { createdAt: "asc" },
        take: 100 // Limit for now
    })

    return NextResponse.json(messages)
}

export async function POST(req: Request, { params }: { params: { id: string } }) {
    const session = await auth()
    if (!session?.user) return new NextResponse("Unauthorized", { status: 401 })

    try {
        const { content } = await req.json()

        // Verify participation
        const chat = await prisma.chat.findUnique({ where: { id: params.id } })
        if (!chat || !chat.participants.includes(session.user.id)) {
            return new NextResponse("Forbidden", { status: 403 })
        }

        const message = await prisma.message.create({
            data: {
                content,
                chatId: params.id,
                senderId: session.user.id
            }
        })

        return NextResponse.json(message)
    } catch (error) {
        return new NextResponse("Error", { status: 500 })
    }
}
