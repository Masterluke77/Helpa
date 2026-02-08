"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"

export default function CreateRequestPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [images, setImages] = useState<string[]>([])

    // Simple state form for now
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [category, setCategory] = useState("general")
    const [price, setPrice] = useState("")

    // Location (hardcoded or user geo)
    const [lat, setLat] = useState<number | null>(null)
    const [lng, setLng] = useState<number | null>(null)

    // Get location
    const getLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((pos) => {
                setLat(pos.coords.latitude)
                setLng(pos.coords.longitude)
            })
        }
    }

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.[0]) return
        const file = e.target.files[0]

        try {
            // Get presigned URL
            const res = await fetch("/api/upload", {
                method: "POST",
                body: JSON.stringify({ filename: file.name, contentType: file.type }),
            })
            const { url, publicUrl } = await res.json()

            // Upload to S3
            await fetch(url, {
                method: "PUT",
                body: file,
                headers: { "Content-Type": file.type }
            })

            setImages([...images, publicUrl])
        } catch (error) {
            console.error("Upload failed", error)
            alert("Upload failed")
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!lat || !lng) {
            alert("Please enable location")
            return
        }
        setLoading(true)

        try {
            const res = await fetch("/api/requests", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title,
                    description,
                    category,
                    price: price ? parseFloat(price) : undefined,
                    latitude: lat,
                    longitude: lng,
                    radius: 2000, // Default 2km radius
                    images
                })
            })

            if (res.ok) {
                router.push("/requests")
            } else {
                throw new Error("Failed to create")
            }
        } catch (error) {
            console.error(error)
            alert("Error creating request")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="container max-w-lg py-10">
            <Card>
                <CardHeader>
                    <CardTitle>Create Request</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label>Title</Label>
                            <Input value={title} onChange={(e) => setTitle(e.target.value)} required />
                        </div>

                        <div className="space-y-2">
                            <Label>Description</Label>
                            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} required />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Category</Label>
                                <Input value={category} onChange={(e) => setCategory(e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <Label>Price (Optional)</Label>
                                <Input type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Images</Label>
                            <Input type="file" accept="image/*" onChange={handleUpload} />
                            <div className="flex gap-2 mt-2">
                                {images.map((img, i) => (
                                    <img key={i} src={img} className="w-20 h-20 object-cover rounded" alt="preview" />
                                ))}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Location</Label>
                            <div className="flex gap-2">
                                <Button type="button" variant="outline" onClick={getLocation}>
                                    📍 Get Current Location
                                </Button>
                                <div className="text-sm self-center">
                                    {lat && lng ? `${lat.toFixed(4)}, ${lng.toFixed(4)}` : "Not set"}
                                </div>
                            </div>
                        </div>

                        <Button type="submit" disabled={loading} className="w-full">
                            {loading ? "Creating..." : "Create Request"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
