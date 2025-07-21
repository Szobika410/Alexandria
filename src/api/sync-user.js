import { dbConnect } from "@/lib/mongoose";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { clerkUserId, email, username, firstName, lastName, image } = await req.json();

    // Validate required fields
    if (!clerkUserId || !email || !username) {
      return NextResponse.json(
        { error: "Missing required fields: clerkUserId, email, and username are required" },
        { status: 400 }
      );
    }

    await dbConnect();

    // Create or update the user
    const user = await mongoose.model("User").findOneAndUpdate(
      { clerkUserId },
      {
        $set: {
          email,
          username,
          firstName: firstName || "",
          lastName: lastName || "",
          image: image || ""
        }
      },
      { upsert: true, new: true }
    );

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error("User sync error:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 400 }
    );
  }
}

// Enable body parsing
export const config = {
  api: {
    bodyParser: true
  }
};
