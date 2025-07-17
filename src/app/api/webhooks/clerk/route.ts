import { verifyWebhook } from '@clerk/nextjs/webhooks';
import { dbConnect } from "@/lib/db";
import { createUser } from "@/lib/actions/user.action";
import { config } from "@/lib/config";

interface NextRequest {
  headers: Headers;
  json: () => Promise<any>;
}

type NextResponse = Response;

export async function POST(req: NextRequest) {
  try {
    const headerSignature = req.headers.get('x-clerk-signature');
    if (!headerSignature) {
      throw new Error('Missing x-clerk-signature header');
    }

    const body = await req.json();
    if (!config.clerk.webhookSecret) {
      throw new Error('WEBHOOK_SECRET is not configured');
    }

    const isValid = verifyWebhook(body);
    if (!isValid) {
      throw new Error('Invalid webhook signature');
    }

    const evt = body as {
      type: string;
      data: {
        id: string;
        username: string;
        email_addresses: Array<{ email_address: string }>;
        image_url: string;
        first_name?: string;
        last_name?: string;
      };
    };

    if (evt.type === "user.created") {
      const { id, username, email_addresses, image_url, first_name = "", last_name = "" } = evt.data;
      
      // Create user in database
      await dbConnect();
      const user = await createUser({
        clerkId: id,
        username: username,
        email: email_addresses[0].email_address,
        imageUrl: image_url,
        firstName: first_name,
        lastName: last_name
      });

      // Update Clerk user metadata with internal user ID
      const clerkUser = await fetch(`https://api.clerk.dev/v1/users/${id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${config.clerk.secretKey!}`,
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

    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200
    });
  } catch (error) {
    console.error('Webhook error:', error);
    return new Response(JSON.stringify({ error: 'Invalid request' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 400
    });
  }
}
