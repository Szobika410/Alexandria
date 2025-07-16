<<<<<<< HEAD
import {clerkClient} from "@clerk/nextjs";
import {WebhookEvent} from "@clerk/nextjs/server";
import {headers} from "next/headers";
import {NextResponse} from "next/server";
import {Webhook} from "svix";

import {createUser} from "@/lib/actions/user.action";

export async function POST(req: NextRequest) {
    try {
      const evt = await verifyWebhook(req)
  
      // Do something with payload
      // For this guide, log payload to console
      const { id } = evt.data
      const eventType = evt.type

      if (eventType === "user.created") {
        const {id, name, email_addresses, image_url, first_name, last_name} = evt.data

        const user = {
          clerkId: id,
          name: name!,
          email: email_addresses[0].email_address,
          imageUrl: image_url,
          firstName: first_name,
          lastName: last_name,
        }

        console.log(user);

        const newUser = await createUser(user);
        
        if(newUser){
            await clerkClient().users.updateUser(id, {
               publicMetadata: {
                userId: newUser._id,
               },
            });
        }

        return NextResponse.json ({message: "User created", user: newUser});


      }
      console.log(`Received webhook with ID ${id} and event type of ${eventType}`)
      console.log('Webhook payload:', evt.data)
  
      return new Response('Webhook received', { status: 200 })
    } catch (err) {
      console.error('Error verifying webhook:', err)
      return new Response('Error verifying webhook', { status: 400 })
    }
  }
=======
import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { createUser } from "@/lib/actions/user.action";

export async function POST(req: NextRequest) {
  try {
    const headerSignature = req.headers.get("x-clerk-signature");
    const body = await req.json();

    if (!headerSignature || !body) {
      throw new Error('Missing signature or body');
    }

    // Verify Clerk webhook signature
    if (!process.env.WEBHOOK_SECRET) {
      throw new Error('WEBHOOK_SECRET is not configured');
    }

    // Verify the signature format
    const [algorithm, signature] = headerSignature.split(',');
    if (!algorithm || !signature) {
      throw new Error('Invalid signature format');
    }

    // Verify the signature algorithm
    if (!algorithm.startsWith('t=') || !signature.startsWith('s=')) {
      throw new Error('Invalid signature format');
    }

    // Verify the body format
    if (typeof body !== 'object' || !body.event) {
      throw new Error('Invalid webhook body');
    }

    const payload = body;
    
    const evt = payload as {
      data: {
        id: string;
        name: string;
        email_addresses: Array<{ email_address: string }>;
        image_url: string;
        first_name?: string;
        last_name?: string;
      };
      type: string;
    };

    if (evt.type === "user.created") {
      const { id, name, email_addresses, image_url, first_name = "", last_name = "" } = evt.data;
      
      // Create user in database
      await dbConnect();
      const user = await createUser({
        clerkId: id,
        name: name,
        email: email_addresses[0].email_address,
        imageUrl: image_url,
        firstName: first_name,
        lastName: last_name
      });

      // Update Clerk user metadata with internal user ID
      const clerkUser = await fetch(`https://api.clerk.dev/v1/users/${id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${process.env.CLERK_SECRET_KEY!}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          public_metadata: {
            internalUserId: user._id.toString(),
          },
        }),
      });

      if (!clerkUser.ok) {
        throw new Error('Failed to update Clerk user metadata');
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
>>>>>>> 3ff7d3fe4cd03edd8331a22f101e0b26b137dde4
