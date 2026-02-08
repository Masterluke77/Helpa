"use client"

import { useQuery } from "@tanstack/react-query"
import { useParams } from "next/navigation"
import { OfferForm } from "@/components/offer/offer-form"
import { OfferItem } from "@/components/offer/offer-item"
import { useSession } from "next-auth/react" // Need client session wrapping
import { Button } from "@/components/ui/button"

export default function RequestDetailPage() {
    const { id } = useParams()
    const { data: session } = useSession() // We need a SessionProvider in layout for this to work elegantly

    const { data: request, isLoading, refetch } = useQuery({
        queryKey: ['request', id],
        queryFn: async () => {
            const res = await fetch(`/api/requests/${id}`)
            if (!res.ok) throw new Error("Not found")
            return res.json()
        }
    })

    if (isLoading) return <div className="p-8">Loading...</div>
    if (!request) return <div className="p-8">Request not found</div>

    const isOwner = session?.user?.email === request.user.email || session?.user?.id === request.userId

    return (
        <div className="container max-w-3xl py-10 space-y-6">
            <div>
                <h1 className="text-3xl font-bold">{request.title}</h1>
                <div className="flex gap-4 text-sm text-muted-foreground mt-2">
                    <span>{request.category}</span>
                    <span>•</span>
                    <span>{new Date(request.createdAt).toLocaleDateString()}</span>
                    <span>•</span>
                    <span>By {request.user?.name || "Anonymous"}</span>
                </div>
            </div>

            {request.price && (
                <div className="text-2xl font-bold text-green-600">
                    Suggested Price: {request.price}€
                </div>
            )}

            <div className="prose dark:prose-invert">
                <p>{request.description}</p>
            </div>

            {request.images?.length > 0 && (
                <div className="grid grid-cols-2 gap-4">
                    {request.images.map((img: string, i: number) => (
                        <img key={i} src={img} alt="Request" className="rounded-lg object-cover h-64 w-full" />
                    ))}
                </div>
            )}

            <div className="border-t pt-6">
                <h2 className="text-2xl font-semibold mb-4">Offers</h2>

                {request.offers?.length === 0 ? (
                    <p className="text-muted-foreground">No offers yet.</p>
                ) : (
                    <div className="space-y-4">
                        {request.offers.map((offer: any) => (
                            <OfferItem key={offer.id} offer={offer} isOwner={isOwner} />
                        ))}
                    </div>
                )}

                {!isOwner && session?.user && (
                    <OfferForm requestId={request.id} onSuccess={refetch} />
                )}

                {!session?.user && (
                    <div className="mt-4 p-4 bg-muted rounded-md text-center">
                        <p>Sign in to make an offer.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
