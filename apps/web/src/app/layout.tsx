import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { cn } from '@/lib/utils'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: 'Helpa - Neighborhood Request & Deals',
    description: 'Find help locally. Buy, sell, and request items from neighbors.',
}

import { Navbar } from "@/components/layout/navbar"
import { QueryProvider } from "@/components/providers/query-provider"
import { SessionProvider } from "next-auth/react"

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <body className={cn(inter.className, "min-h-screen bg-background font-sans antialiased")}>
                <SessionProvider>
                    <QueryProvider>
                        <Navbar />
                        {children}
                    </QueryProvider>
                </SessionProvider>
            </body>
        </html>
    )
}
