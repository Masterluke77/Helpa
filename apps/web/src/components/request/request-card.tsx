import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface RequestCardProps {
    request: {
        id: string
        title: string
        description: string
        price?: number | null
        images: string[]
        createdAt: string
        user?: {
            name: string | null
            image: string | null
        }
        distance?: number
    }
}

export function RequestCard({ request }: RequestCardProps) {
    return (
        <Card className="flex flex-col h-full hover:shadow-md transition-shadow">
            <CardHeader className="p-4">
                <div className="flex justify-between items-start">
                    <CardTitle className="text-lg line-clamp-1" title={request.title}>{request.title}</CardTitle>
                    {request.price && <span className="font-bold text-green-600 ml-2">{request.price}€</span>}
                </div>
                <p className="text-xs text-muted-foreground">
                    {new Date(request.createdAt).toLocaleDateString()}
                    {request.distance !== undefined && ` • ${Math.round(request.distance)}m away`}
                </p>
            </CardHeader>
            <CardContent className="flex-grow p-4 pt-0">
                <p className="text-sm line-clamp-3 text-gray-600 dark:text-gray-300">
                    {request.description}
                </p>
            </CardContent>
            <CardFooter className="p-4 pt-0 flex justify-between items-center">
                <div className="flex items-center text-xs text-muted-foreground">
                    {request.user?.name || "Anonymous"}
                </div>
                <Link href={`/requests/${request.id}`}>
                    <Button size="sm" variant="outline">View</Button>
                </Link>
            </CardFooter>
        </Card>
    )
}
