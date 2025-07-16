"use server";

import User from "../modals/use.modal";
import { dbConnect } from "../db";
import { Document } from "mongoose";

interface UserDocument extends Document {
    clerkId: string;
    name: string;
    email: string;
    imageUrl: string;
    firstName: string;
    lastName: string;
}

interface CreateUserProps {
    clerkId: string;
    name: string;
    email: string;
    imageUrl: string;
    firstName: string;
    lastName: string;
}

export async function createUser(user: CreateUserProps) {
    try {
        await dbConnect();
        const createdUser = new User({
            clerkId: user.clerkId,
            email: user.email,
            imageUrl: user.imageUrl,
            firstName: user.firstName,
            lastName: user.lastName,
        });
        await createdUser.save();
        return createdUser;
    } catch (error) {
        console.log(error);
        console.error("Error creating user:", error);
        throw error;
    }
}