import { dbConnect } from '@/lib/mongoose'; // vagy: import { dbConnect } from '../../lib/mongoose';
import User from '@/models/User'; // vagy: import User from '../../models/User';
import { Webhook } from 'svix';

const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  // Svix header-ek:
  const svix_id = req.headers['svix-id'];
  const svix_signature = req.headers['svix-signature'];
  const svix_timestamp = req.headers['svix-timestamp'];

  if (!svix_id || !svix_signature || !svix_timestamp) {
    return res.status(400).send('Missing Svix headers');
  }

  const wh = new Webhook(webhookSecret);

  let event;
  try {
    const headerSignature = req.headers.get('x-clerk-signature');
    if (!headerSignature) {
      throw new Error('Missing x-clerk-signature header');
    }

    const body = req.body;
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
        email_addresses: Array<{ email_address: string }>;
        image_url: string;
        first_name?: string;
        last_name?: string;
        deleted_at?: string;
      };
    };

    await dbConnect();

    switch (evt.type) {
      case "user.created": {
        const { id, email_addresses, image_url, first_name, last_name } = evt.data;
        
        const user = await User.create({
          clerkUserId: id,
          email: email_addresses[0].email_address,
          image: image_url,
          firstName: first_name,
          lastName: last_name
        });

        return res.status(200).json({
          success: true,
          message: 'User created successfully',
          user
        });
      }
      case "user.updated": {
        const { id, email_addresses, image_url, first_name, last_name } = evt.data;
        
        const user = await User.findOneAndUpdate(
          { clerkUserId: id },
          {
            email: email_addresses[0].email_address,
            image: image_url,
            firstName: first_name,
            LastName: last_name,
            updatedAt: new Date()
          },
          { new: true }
        );

        return res.status(200).json({
          success: true,
          message: 'User updated successfully',
          user
        });
      }
      case "user.deleted": {
        const { id } = evt.data;
        
        await User.findOneAndDelete({ clerkUserId: id });

        return res.status(200).json({
          success: true,
          message: 'User deleted successfully'
        });
      }
      default:
        return res.status(400).json({
          success: false,
          message: 'Unsupported event type'
        });
    }
  } catch (error) {
    console.error('Webhook error:', error);
    return res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error occurred'
    });
  }
}

// Next.js-nek fontos: a bodyParser-t ACTIVIZÁLNI KELL custom JSON-hoz!
export const config = {
  api: {
    bodyParser: true, 
  },
};
