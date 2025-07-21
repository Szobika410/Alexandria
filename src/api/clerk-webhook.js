import { Webhook } from "svix";
import User from "@/models/User";
import { dbConnect } from "@/lib/dbConnect";

const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).send("Method Not Allowed");
    return;
  }

  const headers = req.headers;
  const payload = req.body;
  const svix_id = headers["svix-id"];
  const svix_timestamp = headers["svix-timestamp"];
  const svix_signature = headers["svix-signature"];

  const wh = new Webhook(WEBHOOK_SECRET);
  let event;
  try {
    event = wh.verify(JSON.stringify(payload), {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    });
  } catch (e) {
    res.status(400).json({ error: "Invalid webhook" });
    return;
  }

  await dbConnect();
  const { id, email_addresses, first_name, last_name, username, profile_image_url } = event.data;

  if (event.type === "user.created") {
    await User.create({
      clerkUserId: id,
      email: email_addresses[0].email_address,
      firstName: first_name,
      lastName: last_name,
      username: username,
      image: profile_image_url,
    });
  } else if (event.type === "user.updated") {
    await User.updateOne(
      { clerkUserId: id },
      {
        $set: {
          email: email_addresses[0].email_address,
          firstName: first_name,
          lastName: last_name,
          username: username,
          image: profile_image_url,
        },
      }
    );
  }

  res.status(200).json({ success: true });
}
