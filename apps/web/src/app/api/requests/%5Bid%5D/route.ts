import { auth } from "@/auth"
import { prisma } from "@helpa/db"
import { NextResponse } from "next/server"

export async function GET(req: Request, { params }: { params: { id: string } }) {
    const request = await prisma.request.findUnique({
        where: { id: params.id },
        include: {
            user: { select: { id: true, name: true, image: true, rating: true, bio: true } },
            offers: {
                include: { user: { select: { id: true, name: true, image: true } } },
                orderBy: { createdAt: "desc" }
            }
        }
    })

    if (!request) {
        return new NextResponse("Not Found", { status: 404 })
    }

    return NextResponse.json(request)
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    const session = await auth()
    if (!session?.user) return new NextResponse("Unauthorized", { status: 401 })

    // Check ownership
    const existing = await prisma.request.findUnique({ where: { id: params.id } })
    if (!existing || existing.userId !== session.user.id) {
        // Allow admin too
        if (session.user.role !== "ADMIN") {
            return new NextResponse("Forbidden", { status: 403 })
        }
    }

    await prisma.request.delete({ where: { id: params.id } })
    return new NextResponse("Deleted", { status: 200 })
}
