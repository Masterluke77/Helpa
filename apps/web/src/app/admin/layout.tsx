import { auth } from "@/auth"
import Link from "next/link"
import { redirect } from "next/navigation"

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const session = await auth()

    if (session?.user?.role !== "ADMIN" && session?.user?.role !== "MODERATOR") {
        redirect("/")
    }

    return (
        <div className="flex min-h-screen">
            <aside className="w-64 bg-muted p-6 hidden md:block border-r">
                <h2 className="text-xl font-bold mb-6">Helpa Admin</h2>
                <nav className="space-y-2">
                    <Link href="/admin" className="block p-2 hover:bg-background rounded">Dashboard</Link>
                    <Link href="/admin/users" className="block p-2 hover:bg-background rounded">Users</Link>
                    <Link href="/admin/requests" className="block p-2 hover:bg-background rounded">Requests</Link>
                    <Link href="/admin/reports" className="block p-2 hover:bg-background rounded">Reports</Link>
                </nav>
            </aside>
            <main className="flex-1 p-8">
                {children}
            </main>
        </div>
    )
}
