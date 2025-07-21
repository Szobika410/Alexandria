import { dbConnect } from "@/lib/mongoose";
import Profile from "@/models/Profile";
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

    // Create the profile
    const profile = await Profile.create({
      clerkUserId,
      email,
      username,
      firstName,
      lastName,
      image
    });

    return NextResponse.json(profile, { status: 201 });
  } catch (error) {
    console.error("Profile creation error:", error);
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
