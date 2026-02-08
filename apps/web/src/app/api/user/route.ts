import { auth } from "@/auth"
import { prisma } from "@helpa/db"
import { UserSchema } from "@helpa/shared"
import { NextResponse } from "next/server"

export async function GET() {
    const session = await auth()
    if (!session?.user?.email) {
        return new NextResponse("Unauthorized", { status: 401 })
    }

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
    })

    return NextResponse.json(user)
}

export async function PATCH(req: Request) {
    const session = await auth()
    if (!session?.user?.email) {
        return new NextResponse("Unauthorized", { status: 401 })
    }

    try {
        const json = await req.json()
        const body = UserSchema.partial().parse(json)

        const user = await prisma.user.update({
            where: { email: session.user.email },
            data: body,
        })

        return NextResponse.json(user)
    } catch (error) {
        return new NextResponse("Invalid request", { status: 400 })
    }
}
