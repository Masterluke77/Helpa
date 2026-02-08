import { auth } from "@/auth"
import { prisma } from "@helpa/db"
import { NextResponse } from "next/server"

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
    const session = await auth()
    if (!session?.user) return new NextResponse("Unauthorized", { status: 401 })

    try {
        const { status } = await req.json() // ACCEPTED or REJECTED

        const offer = await prisma.offer.findUnique({
            where: { id: params.id },
            include: { request: true }
        })

        if (!offer) return new NextResponse("Not Found", { status: 404 })

        // Only request owner can accept/reject
        if (offer.request.userId !== session.user.id) {
            return new NextResponse("Forbidden", { status: 403 })
        }

        const updatedOffer = await prisma.offer.update({
            where: { id: params.id },
            data: { status },
        })

        if (status === "ACCEPTED") {
            // Close request or set to negotiating?
            // Requirement: "1:1 Chat between request creator and offerer after offer"
            // Maybe set Request to NEGOTIATING
            await prisma.request.update({
                where: { id: offer.requestId },
                data: { status: "NEGOTIATING" }
            })

            // Generate Chat
            await prisma.chat.create({
                data: {
                    requestId: offer.requestId,
                    participants: [offer.request.userId, offer.userId]
                }
            })
        }

        return NextResponse.json(updatedOffer)

    } catch (e) {
        console.error(e)
        return new NextResponse("Error", { status: 500 })
    }
}
