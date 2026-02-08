import { z } from "zod";

export const UserSchema = z.object({
    id: z.string(),
    name: z.string().nullable(),
    email: z.string().email().nullable(),
    image: z.string().url().nullable(),
    bio: z.string().max(500).nullable(),
    latitude: z.number().nullable(),
    longitude: z.number().nullable(),
});

export const CreateRequestSchema = z.object({
    title: z.string().min(5).max(100),
    description: z.string().min(20),
    category: z.string(),
    price: z.number().min(0).optional(),
    latitude: z.number(),
    longitude: z.number(),
    radius: z.number().min(100).max(50000), // meters
    images: z.array(z.string().url()).optional(),
});

export const CreateOfferSchema = z.object({
    requestId: z.string(),
    price: z.number().min(0),
    message: z.string().optional(),
});
