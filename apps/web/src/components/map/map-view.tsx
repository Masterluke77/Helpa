"use client"

import * as React from "react"
import Map, { Marker, Popup, NavigationControl } from "react-map-gl"
import "mapbox-gl/dist/mapbox-gl.css"
import { useState } from "react"
import Link from "next/link"

interface RequestMarker {
    id: string
    latitude: number
    longitude: number
    title: string
    price?: number
}

interface MapViewProps {
    requests: RequestMarker[]
    initialViewState?: {
        latitude: number
        longitude: number
        zoom: number
    }
}

export function MapView({ requests, initialViewState }: MapViewProps) {
    const [popupInfo, setPopupInfo] = useState<RequestMarker | null>(null)

    return (
        <div className="h-[500px] w-full rounded-md overflow-hidden border">
            <Map
                initialViewState={initialViewState || {
                    longitude: 13.405,
                    latitude: 52.52,
                    zoom: 12
                }}
                style={{ width: "100%", height: "100%" }}
                mapStyle="mapbox://styles/mapbox/streets-v11"
                mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
            >
                <NavigationControl position="top-right" />

                {requests.map((request) => (
                    <Marker
                        key={request.id}
                        longitude={request.longitude}
                        latitude={request.latitude}
                        anchor="bottom"
                        onClick={e => {
                            e.originalEvent.stopPropagation()
                            setPopupInfo(request)
                        }}
                    >
                        <div className="cursor-pointer text-2xl">📍</div>
                    </Marker>
                ))}

                {popupInfo && (
                    <Popup
                        anchor="top"
                        longitude={popupInfo.longitude}
                        latitude={popupInfo.latitude}
                        onClose={() => setPopupInfo(null)}
                    >
                        <div className="p-2">
                            <h3 className="font-bold">{popupInfo.title}</h3>
                            {popupInfo.price && <p className="text-sm">Suggest: {popupInfo.price}€</p>}
                            <Link href={`/requests/${popupInfo.id}`} className="text-blue-500 text-sm hover:underline">
                                View Details
                            </Link>
                        </div>
                    </Popup>
                )}
            </Map>
        </div>
    )
}
