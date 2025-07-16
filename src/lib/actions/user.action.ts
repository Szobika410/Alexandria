"use server";

import User from "../modals/use.modal";
import { dbConnect } from "../db";
<<<<<<< HEAD

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
=======
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
>>>>>>> 3ff7d3fe4cd03edd8331a22f101e0b26b137dde4
    } catch (error) {
        console.log(error);
        console.error("Error creating user:", error);
        throw error;
    }
}