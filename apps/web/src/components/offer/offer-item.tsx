"use client"

import { Button } from "@/components/ui/button"
import { useState } from "react"

interface OfferItemProps {
    offer: {
        id: string
        price: number
        message: string | null
        status: string
        user: {
            name: string | null
            image: string | null
        }
    }
    isOwner: boolean
}

export function OfferItem({ offer, isOwner }: OfferItemProps) {
    const [status, setStatus] = useState(offer.status)
    const [loading, setLoading] = useState(false)

    const handleAction = async (newStatus: "ACCEPTED" | "REJECTED") => {
        setLoading(true)
        try {
            const res = await fetch(`/api/offers/${offer.id}`, { // Fixed typo
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus })
            })
            if (res.ok) {
                setStatus(newStatus)
            }
        } catch (e) {
            console.error(e)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="border p-4 rounded-md flex justify-between items-center bg-card">
            <div>
                <div className="font-semibold">{offer.user.name || "User"} offered {offer.price}€</div>
                <p className="text-sm text-muted-foreground">{offer.message}</p>
                <div className="text-xs uppercase mt-1 font-bold text-gray-500">{status}</div>
            </div>
            {isOwner && status === "PENDING" && (
                <div className="flex gap-2">
                    <Button size="sm" variant="destructive" onClick={() => handleAction("REJECTED")} disabled={loading}>
                        Reject
                    </Button>
                    <Button size="sm" onClick={() => handleAction("ACCEPTED")} disabled={loading}>
                        Accept
                    </Button>
                </div>
            )}
        </div>
    )
}
