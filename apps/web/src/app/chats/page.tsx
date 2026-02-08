"use client"

import { useQuery } from "@tanstack/react-query"
import Link from "next/link"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function ChatsListPage() {
    const { data: chats, isLoading } = useQuery({
        queryKey: ['chats'],
        queryFn: async () => {
            const res = await fetch(`/api/chats`)
            if (!res.ok) throw new Error("Failed")
            return res.json()
        }
    })

    if (isLoading) return <div className="p-8">Loading chats...</div>

    return (
        <div className="container max-w-2xl py-10 space-y-4">
            <h1 className="text-3xl font-bold">Inbox</h1>
            {chats?.length === 0 ? (
                <p>No active chats.</p>
            ) : (
                chats?.map((chat: any) => (
                    <Link href={`/chats/${chat.id}`} key={chat.id}>
                        <Card className="hover:bg-muted/50 transition-colors cursor-pointer mb-2">
                            <CardHeader className="flex flex-row items-center gap-4 p-4">
                                <Avatar>
                                    <AvatarImage src={chat.otherUser?.image} />
                                    <AvatarFallback>{chat.otherUser?.name?.[0] || "?"}</AvatarFallback>
                                </Avatar>
                                <div className="flex-grow">
                                    <CardTitle className="text-base">{chat.otherUser?.name || "Deleted User"}</CardTitle>
                                    <p className="text-xs text-muted-foreground">re: {chat.request?.title}</p>
                                </div>
                                <div className="text-xs text-muted-foreground whitespace-nowrap">
                                    {chat.messages?.[0] ? new Date(chat.messages[0].createdAt).toLocaleDateString() : ""}
                                </div>
                            </CardHeader>
                            <CardContent className="p-4 pt-0">
                                <p className="text-sm text-muted-foreground truncate">
                                    {chat.messages?.[0]?.content || "No messages yet"}
                                </p>
                            </CardContent>
                        </Card>
                    </Link>
                ))
            )}
        </div>
    )
}
