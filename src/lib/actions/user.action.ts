"use server";

import User from "../modals/use.modal";
import { dbConnect } from "../db";

export async function createUser(user: any) {
    try {
        await dbConnect();
        const newUser = await User.create({
            clerkId: user.clerkId,
            name: user.name,
            email: user.email,
            imageUrl: user.imageUrl,
            firstName: user.firstName,
            lastName: user.lastName
        });
        return JSON.parse(JSON.stringify(newUser));
    } catch (error) {
        console.log(error);
        console.error("Error creating user:", error);
        throw error;
    }
}