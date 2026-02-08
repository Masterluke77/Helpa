import { prisma } from "@helpa/db"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

export default async function AdminDashboard() {
    const userCount = await prisma.user.count()
    const requestCount = await prisma.request.count()
    const offerCount = await prisma.offer.count()

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Users</CardTitle>
                    </CardHeader>
                    <CardContent className="text-4xl font-bold">
                        {userCount}
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Requests</CardTitle>
                    </CardHeader>
                    <CardContent className="text-4xl font-bold">
                        {requestCount}
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Offers</CardTitle>
                    </CardHeader>
                    <CardContent className="text-4xl font-bold">
                        {offerCount}
                    </CardContent>
                </Card>
            </div>

            <div className="bg-muted p-4 rounded-md">
                <h2 className="text-xl font-semibold mb-2">System Status</h2>
                <div className="flex gap-4">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        <span>Database Connected</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
