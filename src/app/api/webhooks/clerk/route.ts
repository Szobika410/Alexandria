import {clerkClient} from "@clerk/nextjs";
import {WebhookEvent} from "@clerk/nextjs/server";
import {headers} from "next/headers";
import {NextResponse} from "next/server";
import {Webhook} from "svix";

export async function POST(req: NextRequest) {
    try {
      const evt = await verifyWebhook(req)
  
      // Do something with payload
      // For this guide, log payload to console
      const { id } = evt.data
      const eventType = evt.type
      console.log(`Received webhook with ID ${id} and event type of ${eventType}`)
      console.log('Webhook payload:', evt.data)
  
      return new Response('Webhook received', { status: 200 })
    } catch (err) {
      console.error('Error verifying webhook:', err)
      return new Response('Error verifying webhook', { status: 400 })
    }
  }