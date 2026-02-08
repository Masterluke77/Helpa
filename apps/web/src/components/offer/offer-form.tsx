"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

interface OfferFormProps {
    requestId: string
    onSuccess: () => void
}

export function OfferForm({ requestId, onSuccess }: OfferFormProps) {
    const [price, setPrice] = useState("")
    const [message, setMessage] = useState("")
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        try {
            const res = await fetch("/api/offers", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    requestId,
                    price: parseFloat(price),
                    message
                })
            })
            if (res.ok) {
                onSuccess()
                setPrice("")
                setMessage("")
                alert("Offer sent!")
            } else {
                alert("Failed to send offer")
            }
        } catch (e) {
            console.error(e)
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4 border p-4 rounded-md mt-4">
            <h3 className="font-semibold">Make an Offer</h3>
            <div className="space-y-2">
                <Label>Your Price (€)</Label>
                <Input type="number" value={price} onChange={(e) => setPrice(e.target.value)} required />
            </div>
            <div className="space-y-2">
                <Label>Message</Label>
                <Textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="I can help with this..." />
            </div>
            <Button type="submit" disabled={loading}>
                {loading ? "Sending..." : "Send Offer"}
            </Button>
        </form>
    )
}
