"use client"

import { useEffect, useState, useRef } from "react"
import { useSocket } from "@/hooks/use-socket"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useSession } from "next-auth/react"

interface Message {
    id: string
    content: string
    senderId: string
    createdAt: string
}

interface ChatWindowProps {
    chatId: string
    initialMessages: Message[]
}

export function ChatWindow({ chatId, initialMessages }: ChatWindowProps) {
    const { data: session } = useSession()
    const socket = useSocket()
    const [messages, setMessages] = useState<Message[]>(initialMessages)
    const [input, setInput] = useState("")
    const scrollRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (!socket) return

        socket.emit("join_room", chatId)

        socket.on("receive_message", (msg: Message) => {
            setMessages((prev) => [...prev, msg])
        })

        return () => {
            socket.off("receive_message")
        }
    }, [socket, chatId])

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
    }, [messages])

    const sendMessage = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!input.trim() || !session?.user) return

        const msg = {
            id: Date.now().toString(), // Temp ID
            content: input,
            senderId: session.user.id,
            createdAt: new Date().toISOString(),
            chatId
        }

        // Send to backend API to persist
        await fetch(`/api/chats/${chatId}/messages`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ content: input })
        })

        // Emit to socket for realtime
        // Actually, logic choice:
        // A) Emit -> Server saves -> Server broadcasts
        // B) Client saves via API -> API saves -> Client Emits (or API emits via socket server)
        // C) Client saves via API -> API broadcasts via Redis/Socket

        // For simplicity:
        // 1. Save via API. 
        // 2. Emit via socket manually from client for immediate feedback, OR trust backend to emit.
        // My socket server is simple info-relay. It doesn't write to DB.

        socket?.emit("send_message", { ...msg, roomId: chatId })
        setMessages((prev) => [...prev, msg])
        setInput("")
    }

    return (
        <div className="flex flex-col h-[600px] border rounded-md">
            <div className="flex-grow p-4 overflow-y-auto space-y-4" ref={scrollRef}>
                {messages.map((m) => {
                    const isMe = m.senderId === session?.user?.id
                    return (
                        <div key={m.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                            <div className={`max-w-[70%] p-2 rounded-lg ${isMe ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                                <p>{m.content}</p>
                                <span className="text-[10px] opacity-70 block text-right">
                                    {new Date(m.createdAt).toLocaleTimeString()}
                                </span>
                            </div>
                        </div>
                    )
                })}
            </div>
            <form onSubmit={sendMessage} className="p-4 border-t flex gap-2">
                <Input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type a message..." />
                <Button type="submit">Send</Button>
            </form>
        </div>
    )
}
