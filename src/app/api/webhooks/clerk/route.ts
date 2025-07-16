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