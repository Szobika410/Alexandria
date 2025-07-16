"use server";

import User from "../modals/use.modal";
import { dbConnect } from "../db";

interface CreateUserProps {
  clerkId: string;
  username: string;
  email: string;
  imageUrl: string;
  firstName: string;
  lastName: string;
}

export async function createUser({
  clerkId,
  username,
  email,
  imageUrl,
  firstName,
  lastName
}: CreateUserProps) {
  try {
    await dbConnect();
    const newUser = new User({
      clerkId,
      username,
      email,
      imageUrl,
      firstName,
      lastName
    });
    await newUser.save();
    return newUser;
  } catch (error) {
    console.log(error);
    console.error("Error creating user:", error);
    throw error;
  }
}