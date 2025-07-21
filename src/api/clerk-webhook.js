import { Webhook } from "svix";
import mongoose from "mongoose";
import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";

const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

export async function POST(req) {
  try {
    const headers = req.headers;
    const payload = await req.json();
    const svix_id = headers.get("svix-id");
    const svix_timestamp = headers.get("svix-timestamp");
    const svix_signature = headers.get("svix-signature");

    const wh = new Webhook(WEBHOOK_SECRET);
    let event = wh.verify(payload, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature
    });

    await dbConnect();

    switch (event.type) {
      case "user.created":
        await mongoose.model("User").create({
          clerkUserId: event.data.id,
          email: event.data.email_addresses[0].email_address,
          firstName: event.data.first_name || "",
          lastName: event.data.last_name || "",
          image: event.data.image_url
        });
        break;

      case "user.updated":
        await mongoose.model("User").findOneAndUpdate(
          { clerkUserId: event.data.id },
          {
            email: event.data.email_addresses[0].email_address,
            firstName: event.data.first_name || "",
            lastName: event.data.last_name || "",
            image: event.data.image_url
          },
          { upsert: true, new: true }
        );
        break;

      default:
        // We can ignore other event types
        break;
    }

    return NextResponse.json({ status: "success" });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { status: "error", message: error.message },
      { status: 400 }
    );
  }
}

