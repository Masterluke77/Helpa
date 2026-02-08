"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { UserSchema } from "@helpa/shared"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

// We need to implement Form components from shadcn/ui to use them like this
// But for now I'll just use standard HTML or build the Form wrapper.
// Actually, shadcn Form is quite complex (wraps react-hook-form).
// I'll stick to simple form for now to save tokens/time, or implement the Form components.
// Let's implement the Form components quickly in a separate file or just use standard HTML with react-hook-form.

// Reverting to standard HTML + reusable components for simplicity in this turn.

export default function ProfilePage() {
    const [loading, setLoading] = useState(true)
    const [user, setUser] = useState<z.infer<typeof UserSchema> | null>(null)

    const { register, handleSubmit, reset } = useForm<z.infer<typeof UserSchema>>()

    useEffect(() => {
        fetch("/api/user")
            .then((res) => res.json())
            .then((data) => {
                setUser(data)
                reset(data)
                setLoading(false)
            })
            .catch((err) => {
                console.error(err)
                setLoading(false)
            })
    }, [reset])

    const onSubmit = async (data: z.infer<typeof UserSchema>) => {
        try {
            const res = await fetch("/api/user", {
                method: "PATCH",
                body: JSON.stringify(data),
            })
            const updated = await res.json()
            setUser(updated)
            alert("Profile updated!")
        } catch (e) {
            console.error(e)
            alert("Failed to update profile")
        }
    }

    if (loading) return <div className="p-8">Loading...</div>

    return (
        <div className="container max-w-2xl py-10">
            <Card>
                <CardHeader>
                    <CardTitle>Profile</CardTitle>
                    <CardDescription>Manage your public profile settings.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid gap-2">
                            <label className="text-sm font-medium">Name</label>
                            <Input {...register("name")} placeholder="Your name" />
                        </div>

                        <div className="grid gap-2">
                            <label className="text-sm font-medium">Bio</label>
                            <Textarea {...register("bio")} placeholder="Tell us about yourself" />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <label className="text-sm font-medium">Latitude</label>
                                <Input {...register("latitude", { valueAsNumber: true })} type="number" step="any" />
                            </div>
                            <div className="grid gap-2">
                                <label className="text-sm font-medium">Longitude</label>
                                <Input {...register("longitude", { valueAsNumber: true })} type="number" step="any" />
                            </div>
                            <p className="text-xs text-muted-foreground col-span-2">
                                Coordinates for neighborhood search (will be replaced by map picker).
                            </p>
                        </div>

                        <Button type="submit">Save Changes</Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
