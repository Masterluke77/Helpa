import { auth } from "@/auth"
import { prisma } from "@helpa/db"
import { CreateOfferSchema } from "@helpa/shared"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
    const session = await auth()
    if (!session?.user) {
        return new NextResponse("Unauthorized", { status: 401 })
    }

    try {
        const json = await req.json()
        const body = CreateOfferSchema.parse(json)

        // Check if request exists and is open
        const request = await prisma.request.findUnique({
            where: { id: body.requestId },
        })

        if (!request || request.status !== "OPEN") {
            return new NextResponse("Request not available", { status: 400 })
        }

        if (request.userId === session.user.id) {
            return new NextResponse("Cannot offer on own request", { status: 400 })
        }

        const offer = await prisma.offer.create({
            data: {
                price: body.price,
                message: body.message,
                requestId: body.requestId,
                userId: session.user.id,
                status: "PENDING",
            },
        })

        // TODO: Notify request owner via socket/notification

        return NextResponse.json(offer)
    } catch (error) {
        console.error(error)
        return new NextResponse("Invalid offer", { status: 400 })
    }
}
