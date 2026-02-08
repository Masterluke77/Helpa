import { useEffect, useState } from "react"
import { io, Socket } from "socket.io-client"

export const useSocket = () => {
    const [socket, setSocket] = useState<Socket | null>(null)

    useEffect(() => {
        const socketInstance = io(process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3001", {
            transports: ["websocket"],
        })

        socketInstance.on("connect", () => {
            console.log("Connected to socket")
        })

        setSocket(socketInstance)

        return () => {
            socketInstance.disconnect()
        }
    }, [])

    return socket
}
