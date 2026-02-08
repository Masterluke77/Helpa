import { auth } from "@/auth"
import { NextResponse } from "next/server"
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import { v4 as uuidv4 } from "uuid"

const s3 = new S3Client({
    region: "us-east-1", // MinIO default
    endpoint: process.env.UPLOAD_S3_ENDPOINT,
    credentials: {
        accessKeyId: process.env.UPLOAD_S3_ACCESS_KEY!,
        secretAccessKey: process.env.UPLOAD_S3_SECRET_KEY!,
    },
    forcePathStyle: true,
})

export async function POST(req: Request) {
    const session = await auth()
    if (!session?.user) {
        return new NextResponse("Unauthorized", { status: 401 })
    }

    try {
        const { filename, contentType } = await req.json()

        const key = `${uuidv4()}-${filename}`

        const command = new PutObjectCommand({
            Bucket: process.env.UPLOAD_S3_BUCKET,
            Key: key,
            ContentType: contentType,
        })

        const url = await getSignedUrl(s3, command, { expiresIn: 3600 })

        // Public URL for accessing the file later
        // If running locally with MinIO, we need to ensure the browser can reach this.
        // Docker internal endpoint is http://minio:9000, but browser needs localhost:9000
        // We use a separate env var for public access or replace.
        const publicUrl = `${process.env.UPLOAD_S3_PUBLIC_URL || 'http://localhost:9000'}/${process.env.UPLOAD_S3_BUCKET}/${key}`

        return NextResponse.json({ url, publicUrl, key })
    } catch (error) {
        console.error(error)
        return new NextResponse("Upload failed", { status: 500 })
    }
}
