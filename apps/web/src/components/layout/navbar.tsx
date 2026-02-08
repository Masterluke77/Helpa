import Link from "next/link"
import { auth } from "@/auth"
import { Button } from "@/components/ui/button"

export async function Navbar() {
    const session = await auth()

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 items-center">
                <Link href="/" className="mr-6 flex items-center space-x-2">
                    <span className="font-bold">Helpa</span>
                </Link>
                <nav className="flex items-center space-x-6 text-sm font-medium">
                    <Link href="/requests">Requests</Link>
                    <Link href="/map">Map</Link>
                </nav>
                <div className="ml-auto flex items-center space-x-4">
                    {session ? (
                        <div className="flex items-center gap-4">
                            <span>{session.user.name || session.user.email}</span>
                            <Link href="/profile">
                                <Button variant="outline" size="sm">Profile</Button>
                            </Link>
                            {/* SignOut is usually handled via server action or client button calling signOut */}
                        </div>
                    ) : (
                        <Link href="/auth/signin">
                            <Button size="sm">Sign In</Button>
                        </Link>
                    )}
                </div>
            </div>
        </header>
    )
}
