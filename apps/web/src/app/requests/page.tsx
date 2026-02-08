"use client"

import { useState, useEffect } from "react"
import { useQuery } from "@tanstack/react-query"
import { MapView } from "@/components/map/map-view"
import { RequestCard } from "@/components/request/request-card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

// Helper to get location
const useGeolocation = () => {
    const [location, setLocation] = useState<{ lat: number, lng: number } | null>(null)
    useEffect(() => {
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(({ coords }) => {
                setLocation({ lat: coords.latitude, lng: coords.longitude })
            })
        }
    }, [])
    return location
}

export default function RequestsPage() {
    const userLocation = useGeolocation()
    const [view, setView] = useState<"list" | "map">("list")

    // Default to Berlin if no location
    const lat = userLocation?.lat || 52.52
    const lng = userLocation?.lng || 13.405
    const radius = 10000 // 10km

    const { data: requests, isLoading } = useQuery({
        queryKey: ['requests', lat, lng, radius],
        queryFn: async () => {
            const res = await fetch(`/api/requests?lat=${lat}&lng=${lng}&radius=${radius}`)
            if (!res.ok) throw new Error("Failed to fetch")
            return res.json()
        },
        enabled: true
    })

    return (
        <div className="container py-6 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Local Requests</h1>
                <div className="flex gap-2">
                    <Link href="/requests/create">
                        <Button>+ Create Request</Button>
                    </Link>
                    <div className="md:hidden">
                        <Button variant="outline" onClick={() => setView(view === 'list' ? 'map' : 'list')}>
                            {view === 'list' ? 'Map' : 'List'}
                        </Button>
                    </div>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 h-[calc(100vh-200px)]">
                {/* List View */}
                <div className={`overflow-y-auto space-y-4 ${view === 'map' ? 'hidden md:block' : ''}`}>
                    {isLoading ? (
                        <p>Loading requests nearby...</p>
                    ) : requests?.length === 0 ? (
                        <div className="text-center py-10 text-muted-foreground">
                            No requests found nearby. Be the first!
                        </div>
                    ) : (
                        requests?.map((req: any) => (
                            <RequestCard key={req.id} request={req} />
                        ))
                    )}
                </div>

                {/* Map View */}
                <div className={`h-full ${view === 'list' ? 'hidden md:block' : ''}`}>
                    <MapView
                        requests={requests || []}
                        initialViewState={{ latitude: lat, longitude: lng, zoom: 12 }}
                    />
                </div>
            </div>
        </div>
    )
}
