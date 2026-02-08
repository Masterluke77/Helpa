import { auth } from "@/auth"
import { prisma } from "@helpa/db"
import { CreateRequestSchema } from "@helpa/shared"
import { NextRequest, NextResponse } from "next/server"

// Helper to convert Prisma raw result to proper JSON (BigInt issue)
function replacer(key: string, value: any) {
    if (typeof value === "bigint") return Number(value)
    return value
}

export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams
    const latParam = searchParams.get("lat")
    const lngParam = searchParams.get("lng")
    const radiusParam = searchParams.get("radius") || "5000" // default 5km

    if (!latParam || !lngParam) {
        // Return recent requests globally if no location provided (or maybe fail?)
        // For user experience, global recent is better than error.
        const requests = await prisma.request.findMany({
            take: 50,
            orderBy: { createdAt: "desc" },
            include: { user: { select: { name: true, image: true, rating: true, id: true } } }
        })
        return NextResponse.json(requests)
    }

    const lat = parseFloat(latParam)
    const lng = parseFloat(lngParam)
    const radius = parseInt(radiusParam)

    // PostGIS query
    try {
        const requests = await prisma.$queryRaw`
      SELECT 
       id, title, description, category, price, images, latitude, longitude, "userId", "createdAt",
       (ST_DistanceSphere(
            ST_MakePoint(longitude, latitude),
            ST_MakePoint(${lng}, ${lat})
        )) as distance
      FROM "Request"
      WHERE 
        status = 'OPEN' AND
        ST_DWithin(
            ST_MakePoint(longitude, latitude)::geography,
            ST_MakePoint(${lng}, ${lat})::geography,
            ${radius}
        )
      ORDER BY distance ASC
      LIMIT 50;
    `
        // We need to fetch user details separately or join in raw query.
        // Joining in raw query is better but harder to map to Prisma types.
        // Let's just fetch user details for these IDs or use a simpler findMany with ID filtering if strictly typed needed.
        // But Raw is fastest for geo.
        // Wait, the result of raw query needs to be parsed.

        // Let's stick to simple "Fetch IDs then Fetch Objects" pattern if performance allows, 
        // OR just basic raw query return.

        return NextResponse.json(requests, { headers: { 'Content-Type': 'application/json' } })
    } catch (e) {
        console.error(e)
        return new NextResponse("Database Error", { status: 500 })
    }
}

export async function POST(req: Request) {
    const session = await auth()
    if (!session?.user) {
        return new NextResponse("Unauthorized", { status: 401 })
    }

    try {
        const json = await req.json()
        const body = CreateRequestSchema.parse(json)

        const request = await prisma.request.create({
            data: {
                ...body,
                userId: session.user.id,
                status: "OPEN",
            },
        })

        return NextResponse.json(request)
    } catch (error) {
        console.error(error)
        return new NextResponse("Invalid request", { status: 400 })
    }
}
