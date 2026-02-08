"use client"

import { useQuery } from "@tanstack/react-query"
import { ChatWindow } from "@/components/chat/chat-window"
import { useParams } from "next/navigation"

export default function ChatPage() {
    const { id } = useParams()

    // Fetch initial messages
    const { data: messages, isLoading } = useQuery({
        queryKey: ['chat', id],
        queryFn: async () => {
            const res = await fetch(`/api/chats/${id}/messages`)
            if (!res.ok) throw new Error("Failed")
            return res.json()
        }
    })

    if (isLoading) return <div className="p-8">Loading chat...</div>

    return (
        <div className="container max-w-3xl py-10">
            <h1 className="text-2xl font-bold mb-4">Chat</h1>
            <ChatWindow chatId={id as string} initialMessages={messages || []} />
        </div>
    )
}
